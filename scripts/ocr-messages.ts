/**
 * OCR all message images and store extracted text in GalleryImage.caption.
 *
 * Run with:  npx tsx scripts/ocr-messages.ts
 *
 * What it does:
 *  1. Fetches all GalleryImage rows where album = 'messages'
 *  2. Skips PDFs (marks caption = title to avoid re-attempting)
 *  3. For image rows where caption == title (no OCR done yet), runs Tesseract OCR
 *  4. Saves the cleaned extracted text back to caption
 *
 * Re-running is safe — rows already processed (caption != title) are skipped.
 * Pass --force to re-OCR everything.
 */

import { createWorker } from 'tesseract.js';
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import path from 'path';
import fs from 'fs';
import 'dotenv/config';

// ---------------------------------------------------------------------------
// DB setup
// ---------------------------------------------------------------------------
const dbUrl = process.env.DATABASE_URL ?? 'file:./dev.db';
const dbFile = dbUrl.replace(/^file:/, '');
const absolutePath = path.isAbsolute(dbFile) ? dbFile : path.resolve(process.cwd(), dbFile);
const adapter = new PrismaLibSql({ url: `file:${absolutePath}` });
const prisma = new PrismaClient({ adapter });

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Clean up raw OCR text: remove junk chars, collapse whitespace, trim */
function cleanOcrText(raw: string): string {
  return raw
    .replace(/[^\x20-\x7E\n\r]/g, ' ')   // strip non-ASCII
    .replace(/\|/g, 'I')                   // | often misread as I
    .replace(/ {2,}/g, ' ')               // collapse spaces
    .replace(/\n{3,}/g, '\n\n')           // max 2 consecutive newlines
    .trim();
}

/** Run OCR on a single image, recreating the worker if needed */
async function ocrImage(
  imgPath: string,
  workerRef: { worker: Awaited<ReturnType<typeof createWorker>> },
): Promise<string> {
  const recognizePromise = workerRef.worker.recognize(imgPath);
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('OCR timeout after 30s')), 30_000),
  );
  const { data } = await Promise.race([recognizePromise, timeoutPromise]);
  return cleanOcrText(data.text);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const force = process.argv.includes('--force');

  const messages = await prisma.galleryImage.findMany({
    where: { album: 'messages', published: true },
    orderBy: { order: 'asc' },
  });

  console.log(`Total messages: ${messages.length}`);

  // Filter to only those needing OCR
  const toProcess = force
    ? messages
    : messages.filter((m) => !m.caption || m.caption.trim() === m.title.trim());

  console.log(`To process: ${toProcess.length} (${messages.length - toProcess.length} already done)`);

  if (toProcess.length === 0) {
    console.log('Nothing to do.');
    await prisma.$disconnect();
    return;
  }

  const publicDir = path.join(process.cwd(), 'public');

  // Create Tesseract worker (loads model once, reuses for all images)
  console.log('\nLoading Tesseract OCR engine (English)...');
  const workerRef = { worker: await createWorker('eng') };

  let processed = 0;
  let skippedPdf = 0;
  let failed = 0;

  for (const msg of toProcess) {
    // Skip PDFs — Tesseract can't read them as images
    if (msg.image.toLowerCase().endsWith('.pdf')) {
      // Mark caption = title so this row won't be re-attempted
      await prisma.galleryImage.update({
        where: { id: msg.id },
        data: { caption: msg.title },
      });
      skippedPdf++;
      console.log(`  [PDF]  id=${msg.id} — "${msg.title.substring(0, 45)}" (skipped)`);
      continue;
    }

    const imgPath = path.join(publicDir, msg.image);

    if (!fs.existsSync(imgPath)) {
      console.warn(`  [SKIP] Image not found: ${msg.image}`);
      failed++;
      continue;
    }

    try {
      const text = await ocrImage(imgPath, workerRef);

      if (text.length < 5) {
        console.warn(`  [WARN] Very short OCR result for id=${msg.id}: "${text}"`);
      }

      await prisma.galleryImage.update({
        where: { id: msg.id },
        data: { caption: text || msg.title },
      });

      processed++;
      if (processed % 10 === 0 || processed <= 5) {
        console.log(
          `  [${processed}/${toProcess.length - skippedPdf}] id=${msg.id} — "${msg.title.substring(0, 40)}"`,
        );
      }
    } catch (err) {
      console.error(`  [ERROR] id=${msg.id}: ${(err as Error).message}`);
      failed++;

      // Recreate worker after an error so subsequent images still work
      try { await workerRef.worker.terminate(); } catch {}
      console.log('  Recreating OCR worker...');
      workerRef.worker = await createWorker('eng');
    }
  }

  await workerRef.worker.terminate();
  await prisma.$disconnect();

  console.log(`\nDone!`);
  console.log(`  OCR processed:  ${processed}`);
  console.log(`  PDFs skipped:   ${skippedPdf}`);
  console.log(`  Failed/missing: ${failed}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
