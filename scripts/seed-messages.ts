/**
 * Seed all messages from messages_all.json into the GalleryImage table.
 * Downloads any images not already in public/uploads/.
 *
 * Run with: npx tsx scripts/seed-messages.ts
 */

import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import path from 'path';
import fs from 'fs';
import https from 'https';
import http from 'http';
import 'dotenv/config';

const dbUrl = process.env.DATABASE_URL ?? 'file:./dev.db';
const dbFile = dbUrl.replace(/^file:/, '');
const absolutePath = path.isAbsolute(dbFile) ? dbFile : path.resolve(process.cwd(), dbFile);
const adapter = new PrismaLibSql({ url: `file:${absolutePath}` });
const prisma = new PrismaClient({ adapter });

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Download a URL to a local file path, following redirects */
function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const file = fs.createWriteStream(dest);
    const protocol = url.startsWith('https') ? https : http;

    const request = protocol.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        downloadFile(res.headers.location!, dest).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => file.close(() => resolve()));
    });

    request.on('error', (err) => {
      fs.unlinkSync(dest);
      reject(err);
    });
  });
}

/** Given a WP upload URL, return the local path under public/uploads/ and the DB path */
function urlToLocalPath(imgUrl: string): { local: string; dbPath: string } | null {
  const idx = imgUrl.indexOf('/wp-content/uploads/');
  if (idx < 0) return null;
  const rel = imgUrl.slice(idx + '/wp-content/uploads/'.length);
  // Decode percent-encoding for filesystem lookup
  const relDecoded = decodeURIComponent(rel);
  const local = path.join(process.cwd(), 'public', 'uploads', relDecoded);
  const dbPath = '/uploads/' + rel; // Keep encoded for URLs
  return { local, dbPath };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const jsonPath = path.join(process.cwd(), 'messages_all.json');
  const raw = fs.readFileSync(jsonPath, 'utf-8');
  const messages: Array<{ title: string; image: string }> = JSON.parse(raw);

  console.log(`Total messages from JSON: ${messages.length}`);

  // Step 1: Download missing images
  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  console.log('\nChecking / downloading images...');
  for (const msg of messages) {
    const mapped = urlToLocalPath(msg.image);
    if (!mapped) {
      console.warn(`  SKIP (no uploads path): ${msg.image}`);
      skipped++;
      continue;
    }

    if (fs.existsSync(mapped.local)) {
      skipped++;
      continue;
    }

    // Need to download
    try {
      await downloadFile(msg.image, mapped.local);
      downloaded++;
      if (downloaded % 5 === 0) {
        console.log(`  Downloaded ${downloaded} images...`);
      }
    } catch (err) {
      console.error(`  FAILED: ${msg.image} — ${(err as Error).message}`);
      failed++;
    }
  }

  console.log(`\nImages: ${skipped} already present, ${downloaded} downloaded, ${failed} failed`);

  // Step 2: Delete existing messages album entries
  const existing = await prisma.galleryImage.count({ where: { album: 'messages' } });
  if (existing > 0) {
    console.log(`\nDeleting ${existing} existing messages...`);
    await prisma.galleryImage.deleteMany({ where: { album: 'messages' } });
  }

  // Step 3: Insert messages
  console.log('\nSeeding messages into database...');
  let imported = 0;

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    const mapped = urlToLocalPath(msg.image);

    // Skip if image couldn't be mapped
    if (!mapped) continue;

    // Use the local file as dbPath (decoded for the URL path)
    const relDecoded = decodeURIComponent(msg.image.slice(msg.image.indexOf('/wp-content/uploads/') + '/wp-content/uploads/'.length));
    const dbPath = '/uploads/' + relDecoded;

    await prisma.galleryImage.create({
      data: {
        title: msg.title.trim(),
        image: dbPath,
        caption: msg.title.trim(),
        album: 'messages',
        order: i + 1,
        published: true,
      },
    });

    imported++;
    if (imported % 50 === 0) {
      console.log(`  Inserted ${imported}/${messages.length}...`);
    }
  }

  console.log(`\nDone! Seeded ${imported} messages into the database.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
