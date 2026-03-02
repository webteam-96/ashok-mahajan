/**
 * Seed all speeches from the extracted JSON into the database.
 * Run with: npx tsx scripts/seed-speeches.ts
 */

import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import path from 'path';
import fs from 'fs';
import 'dotenv/config';

const dbUrl = process.env.DATABASE_URL ?? 'file:./dev.db';
const dbFile = dbUrl.replace(/^file:/, '');
const absolutePath = path.isAbsolute(dbFile) ? dbFile : path.resolve(process.cwd(), dbFile);
const adapter = new PrismaLibSql({ url: `file:${absolutePath}` });
const prisma = new PrismaClient({ adapter });

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Convert a title to a URL-friendly slug, appending index to ensure uniqueness */
function toSlug(title: string, index: number): string {
  return (
    title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')   // remove special chars
      .replace(/\s+/g, '-')       // spaces → hyphens
      .replace(/-{2,}/g, '-')     // collapse double hyphens
      .replace(/^-|-$/g, '')      // trim leading/trailing hyphens
      .slice(0, 80) +
    `-${index + 1}`
  );
}

/** Try to extract a date from the speech title or body text */
function extractDate(title: string, body: string): Date | null {
  // Patterns like "5TH MAY 2019", "30th January 2016", "9th July 2017", "6th September 2013"
  const monthNames: Record<string, number> = {
    january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
    july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
  };
  const dateRe = /(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]+)\s+(20\d{2})/gi;
  const fullText = title + ' ' + body.slice(0, 500);
  const match = dateRe.exec(fullText);
  if (match) {
    const day = parseInt(match[1]);
    const month = monthNames[match[2].toLowerCase()];
    const year = parseInt(match[3]);
    if (month && year >= 2010 && year <= 2030) {
      return new Date(year, month - 1, day);
    }
  }
  // Patterns like "26 April 2025", "30 November 2019"
  const dateRe2 = /(\d{1,2})\s+([A-Za-z]+)\s+(20\d{2})/gi;
  const match2 = dateRe2.exec(fullText);
  if (match2) {
    const day = parseInt(match2[1]);
    const month = monthNames[match2[2].toLowerCase()];
    const year = parseInt(match2[3]);
    if (month && year >= 2010 && year <= 2030) {
      return new Date(year, month - 1, day);
    }
  }
  return null;
}

/** Convert plain text body to simple HTML paragraphs */
function textToHtml(body: string): string {
  const paras = body
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0)
    .map((p) => `<p>${p.replace(/\n/g, '<br />')}</p>`);
  return paras.join('\n');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const jsonPath = path.join(process.cwd(), 'speeches_full.json');
  const raw = fs.readFileSync(jsonPath, 'utf-8');
  const speeches: Array<{ title: string; body: string }> = JSON.parse(raw);

  // Filter out placeholder entries
  const valid = speeches.filter(
    (s) =>
      s.title &&
      s.title.trim() !== '' &&
      s.title.toLowerCase() !== 'accordion title' &&
      s.body &&
      s.body.trim().length > 10
  );

  console.log(`Total speeches from JSON: ${speeches.length}`);
  console.log(`Valid speeches to import: ${valid.length}`);

  // Clear existing speeches
  const existing = await prisma.speech.count();
  if (existing > 0) {
    console.log(`Deleting ${existing} existing speeches...`);
    await prisma.speech.deleteMany({});
  }

  let imported = 0;
  const slugsSeen = new Set<string>();

  for (let i = 0; i < valid.length; i++) {
    const { title, body } = valid[i];
    let slug = toSlug(title, i);

    // Ensure uniqueness
    if (slugsSeen.has(slug)) {
      slug = `${slug}-${i}`;
    }
    slugsSeen.add(slug);

    const date = extractDate(title, body);
    const content = textToHtml(body);

    await prisma.speech.create({
      data: {
        title: title.trim(),
        slug,
        content,
        date,
        published: true,
      },
    });

    imported++;
    if (imported % 20 === 0) {
      console.log(`  Imported ${imported}/${valid.length}...`);
    }
  }

  console.log(`\nDone! Imported ${imported} speeches.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
