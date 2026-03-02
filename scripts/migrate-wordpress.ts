/**
 * WordPress → Prisma Migration Script (streaming line-by-line parser)
 * Handles 159MB SQL files without regex over the full file.
 *
 * Run with:  npx tsx scripts/migrate-wordpress.ts
 */

import fs from 'fs';
import readline from 'readline';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import 'dotenv/config';

const dbUrl = process.env.DATABASE_URL ?? 'file:./dev.db';
const dbFile = dbUrl.replace(/^file:/, '');
const absolutePath = path.isAbsolute(dbFile) ? dbFile : path.resolve(process.cwd(), dbFile);
const adapter = new PrismaLibSql({ url: `file:${absolutePath}` });
const prisma = new PrismaClient({ adapter });

// ─── helpers ──────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function cleanHtml(html: string): string {
  return html
    .replace(/\[\/?\w[^\]]*\]/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/https?:\/\/(?:www\.)?ashokmahajan\.in\/wp-content\/uploads\//g, '/uploads/')
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&#8216;|&#8217;/g, "'")
    .trim();
}

function makeExcerpt(html: string, max = 300): string {
  const plain = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return plain.length > max ? plain.slice(0, max) + '…' : plain;
}

// ─── MySQL VALUES row parser ───────────────────────────────────────────────────

function parseRow(row: string): string[] {
  const cols: string[] = [];
  let inStr = false;
  let current = '';
  let i = 0;

  while (i < row.length) {
    const ch = row[i];

    if (inStr) {
      if (ch === '\\' && i + 1 < row.length) {
        const next = row[i + 1];
        if (next === 'n') { current += '\n'; i += 2; continue; }
        if (next === 'r') { current += '\r'; i += 2; continue; }
        if (next === 't') { current += '\t'; i += 2; continue; }
        current += next; i += 2; continue; // handles \', \\, and any other escape
      }
      if (ch === "'" && i + 1 < row.length && row[i + 1] === "'") {
        current += "'"; i += 2; continue; // SQL doubled-quote escape
      }
      if (ch === "'") {
        inStr = false; i++; continue; // end of string — don't push yet, let comma handle it
      }
      current += ch; i++; continue;
    } else {
      if (ch === "'") {
        inStr = true; i++; continue;
      }
      if (ch === ',') {
        cols.push(current.trim());
        current = '';
        i++; continue;
      }
      if (row.slice(i, i + 4) === 'NULL') {
        cols.push(''); // push empty for NULL, and consume the following comma
        i += 4;
        if (i < row.length && row[i] === ',') i++;
        continue;
      }
      current += ch; i++; continue;
    }
  }

  cols.push(current.trim()); // push last column
  return cols;
}

/** Split a VALUES block into individual row strings, handling nested parens */
function splitRows(block: string): string[] {
  const rows: string[] = [];
  let depth = 0;
  let inStr = false;
  let start = -1;

  for (let i = 0; i < block.length; i++) {
    const ch = block[i];
    if (ch === '\\' && inStr) { i++; continue; }
    if (ch === "'" && !inStr) { inStr = true; continue; }
    if (ch === "'" && inStr) { inStr = false; continue; }
    if (!inStr) {
      if (ch === '(') { depth++; if (depth === 1) start = i + 1; }
      else if (ch === ')') { depth--; if (depth === 0 && start !== -1) { rows.push(block.slice(start, i)); start = -1; } }
    }
  }
  return rows;
}

// ─── streaming parser ──────────────────────────────────────────────────────────

interface ParsedData {
  posts: Array<{
    ID: number; title: string; content: string; excerpt: string;
    slug: string; date: string; status: string; type: string;
  }>;
  termRelationships: Array<{ objectId: number; termTaxId: number }>;
  termTaxonomies: Array<{ ttId: number; termId: number; taxonomy: string }>;
  terms: Array<{ termId: number; name: string; slug: string }>;
}

async function streamParseSql(filePath: string): Promise<ParsedData> {
  return new Promise((resolve, reject) => {
    const data: ParsedData = { posts: [], termRelationships: [], termTaxonomies: [], terms: [] };

    const rl = readline.createInterface({
      input: fs.createReadStream(filePath, { encoding: 'utf8' }),
      crlfDelay: Infinity,
    });

    let currentTable = '';
    let colNames: string[] = [];
    let buffer = '';
    let inInsert = false;

    rl.on('line', (rawLine) => {
      const line = rawLine.trimEnd();

      // Detect table context from CREATE TABLE
      const ctMatch = line.match(/^CREATE TABLE `Uig_(\w+)`/);
      if (ctMatch) { currentTable = ctMatch[1]; colNames = []; return; }

      // Detect INSERT header
      const insMatch = line.match(/^INSERT INTO `Uig_(\w+)` \(([^)]+)\) VALUES$/i) ||
                       line.match(/^INSERT INTO `Uig_(\w+)` \(([^)]+)\) VALUES\s*$/i);
      if (insMatch) {
        currentTable = insMatch[1];
        colNames = insMatch[2].split(',').map(c => c.trim().replace(/`/g, ''));
        inInsert = true;
        buffer = '';
        return;
      }

      // Also handle single-line INSERT ... VALUES (...)
      const singleLine = line.match(/^INSERT INTO `Uig_(\w+)` \(([^)]+)\) VALUES\s+(\(.+\));?$/);
      if (singleLine) {
        currentTable = singleLine[1];
        colNames = singleLine[2].split(',').map(c => c.trim().replace(/`/g, ''));
        const rows = splitRows(singleLine[3]);
        processRows(data, currentTable, colNames, rows);
        return;
      }

      if (inInsert) {
        buffer += line;
        if (line.endsWith(';')) {
          // End of INSERT block
          const rows = splitRows(buffer);
          processRows(data, currentTable, colNames, rows);
          inInsert = false;
          buffer = '';
        }
      }
    });

    rl.on('close', () => resolve(data));
    rl.on('error', reject);
  });
}

function processRows(
  data: ParsedData,
  table: string,
  cols: string[],
  rows: string[]
) {
  for (const row of rows) {
    const c = parseRow(row);
    if (table === 'posts') {
      const idIdx = cols.indexOf('ID');
      const titleIdx = cols.indexOf('post_title');
      const contentIdx = cols.indexOf('post_content');
      const excerptIdx = cols.indexOf('post_excerpt');
      const nameIdx = cols.indexOf('post_name');
      const dateIdx = cols.indexOf('post_date');
      const statusIdx = cols.indexOf('post_status');
      const typeIdx = cols.indexOf('post_type');

      if (c.length <= Math.max(idIdx, titleIdx, statusIdx, typeIdx)) continue;
      if (c[statusIdx] !== 'publish') continue;
      if (c[typeIdx] !== 'post' && c[typeIdx] !== 'page') continue;
      if (!c[titleIdx]?.trim() || c[titleIdx] === '0') continue;

      data.posts.push({
        ID: parseInt(c[idIdx]) || 0,
        title: c[titleIdx],
        content: c[contentIdx] || '',
        excerpt: c[excerptIdx] || '',
        slug: c[nameIdx] || slugify(c[titleIdx]),
        date: c[dateIdx] || new Date().toISOString(),
        status: c[statusIdx],
        type: c[typeIdx],
      });
    } else if (table === 'term_relationships') {
      if (c.length >= 2) {
        data.termRelationships.push({ objectId: parseInt(c[0]) || 0, termTaxId: parseInt(c[1]) || 0 });
      }
    } else if (table === 'term_taxonomy') {
      const ttIdx = cols.indexOf('term_taxonomy_id');
      const tIdx = cols.indexOf('term_id');
      const taxIdx = cols.indexOf('taxonomy');
      if (c.length > Math.max(ttIdx, tIdx, taxIdx) && ttIdx >= 0) {
        data.termTaxonomies.push({ ttId: parseInt(c[ttIdx]) || 0, termId: parseInt(c[tIdx]) || 0, taxonomy: c[taxIdx] || '' });
      } else if (c.length >= 3) {
        data.termTaxonomies.push({ ttId: parseInt(c[0]) || 0, termId: parseInt(c[1]) || 0, taxonomy: c[2] || '' });
      }
    } else if (table === 'terms') {
      if (c.length >= 3) {
        data.terms.push({ termId: parseInt(c[0]) || 0, name: c[1], slug: c[2] });
      }
    }
  }
}

// ─── main ─────────────────────────────────────────────────────────────────────

async function migrate() {
  const sqlPath = path.resolve('E:/websites/ashok/kaizeni3_test.sql');

  if (!fs.existsSync(sqlPath)) {
    console.error(`❌ SQL file not found: ${sqlPath}`);
    process.exit(1);
  }

  const sizeMB = (fs.statSync(sqlPath).size / 1024 / 1024).toFixed(1);
  console.log(`📦 SQL file: ${sizeMB} MB`);
  console.log('⏳ Streaming parse (may take 1-2 minutes)...');

  const data = await streamParseSql(sqlPath);
  console.log(`✅ Parsed: ${data.posts.length} posts, ${data.terms.length} terms, ${data.termRelationships.length} relationships`);

  // Build category maps
  const termById = new Map(data.terms.map(t => [t.termId, t]));
  const ttById = new Map(data.termTaxonomies.map(tt => [tt.ttId, tt]));

  const postCategories = new Map<number, string[]>();
  for (const rel of data.termRelationships) {
    const tt = ttById.get(rel.termTaxId);
    if (!tt || tt.taxonomy !== 'category') continue;
    const term = termById.get(tt.termId);
    if (!term) continue;
    const arr = postCategories.get(rel.objectId) || [];
    arr.push(term.slug);
    postCategories.set(rel.objectId, arr);
  }

  // Count by category
  let blogCount = 0, covidCount = 0;
  for (const post of data.posts) {
    if (post.type !== 'post') continue;
    const cats = postCategories.get(post.ID) || [];
    if (cats.includes('covid-india-task-force')) covidCount++;
    else blogCount++;
  }
  console.log(`\n📊 Posts: ${blogCount} blog, ${covidCount} covid`);

  // Import posts
  console.log('\n🔄 Importing posts into database...');
  const seenSlugs = new Set<string>();
  let imported = 0;
  let skipped = 0;
  const BATCH = 50;
  const allPosts = data.posts.filter(p => p.type === 'post');

  for (let i = 0; i < allPosts.length; i += BATCH) {
    const batch = allPosts.slice(i, i + BATCH);

    for (const post of batch) {
      if (!post.title?.trim()) { skipped++; continue; }

      const cats = postCategories.get(post.ID) || [];
      const category = cats.includes('covid-india-task-force') ? 'covid-india-task-force' : 'blog';

      let slug = post.slug || slugify(post.title);
      if (!slug) { skipped++; continue; }
      let attempt = 0;
      const baseSlug = slug;
      while (seenSlugs.has(slug)) { slug = `${baseSlug}-${++attempt}`; }
      seenSlugs.add(slug);

      const content = cleanHtml(post.content || '');
      const excerpt = post.excerpt?.trim()
        ? cleanHtml(post.excerpt)
        : makeExcerpt(post.content || '');

      let publishedDate: Date;
      try {
        publishedDate = new Date(post.date);
        if (isNaN(publishedDate.getTime())) publishedDate = new Date();
      } catch { publishedDate = new Date(); }

      try {
        await prisma.blogPost.upsert({
          where: { wpId: post.ID },
          update: { title: post.title, content, excerpt, category, publishedDate },
          create: {
            wpId: post.ID, title: post.title, slug, content, excerpt,
            category, publishedDate, author: 'Ashok Mahajan', published: true,
          },
        });
        imported++;
      } catch {
        // Slug conflict — try with ID suffix
        try {
          await prisma.blogPost.create({
            data: {
              wpId: post.ID, title: post.title, slug: `${baseSlug}-${post.ID}`,
              content, excerpt, category, publishedDate,
              author: 'Ashok Mahajan', published: true,
            },
          });
          imported++;
        } catch { skipped++; }
      }
    }

    const pct = Math.round(((i + batch.length) / allPosts.length) * 100);
    process.stdout.write(`\r   ${pct}% — ${imported} imported, ${skipped} skipped`);
  }

  // Final counts
  const [totalBlog, totalCovid] = await Promise.all([
    prisma.blogPost.count({ where: { category: 'blog' } }),
    prisma.blogPost.count({ where: { category: 'covid-india-task-force' } }),
  ]);

  console.log(`\n\n✅ Done!`);
  console.log(`   Blog posts:              ${totalBlog}`);
  console.log(`   Covid Task Force posts:  ${totalCovid}`);
  console.log(`\n🚀 Start dev server: npm run dev`);
  console.log(`   Visit: http://localhost:3000`);
  console.log(`   Admin: http://localhost:3000/admin`);
}

migrate()
  .catch(e => { console.error('\n❌', e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
