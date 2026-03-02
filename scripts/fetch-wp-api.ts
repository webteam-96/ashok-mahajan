/**
 * Fetch all posts from live WordPress REST API → upsert into local DB
 *
 * Run with:  npx tsx scripts/fetch-wp-api.ts
 *
 * Categories:
 *   1  = ashok-mahajan  (blog)
 *   40 = covid-india-task-force
 */

import path from 'path';
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import 'dotenv/config';

const BASE_URL = 'https://www.ashokmahajan.in/wp-json/wp/v2';
const PER_PAGE = 100;

const dbUrl = process.env.DATABASE_URL ?? 'file:./dev.db';
const dbFile = dbUrl.replace(/^file:/, '');
const absolutePath = path.isAbsolute(dbFile) ? dbFile : path.resolve(process.cwd(), dbFile);
const adapter = new PrismaLibSql({ url: `file:${absolutePath}` });
const prisma = new PrismaClient({ adapter });

// ─── types ────────────────────────────────────────────────────────────────────

interface WpPost {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  featured_media: number;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url?: string;
      media_details?: { sizes?: { medium_large?: { source_url: string }; large?: { source_url: string } } };
    }>;
  };
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&#8220;|&#8221;|&ldquo;|&rdquo;/g, '"')
    .replace(/&#8216;|&#8217;|&lsquo;|&rsquo;/g, "'")
    .replace(/&#8211;|&ndash;/g, '–')
    .replace(/&#8212;|&mdash;/g, '—')
    .replace(/&#8230;|&hellip;/g, '…')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');
}

function cleanContent(html: string): string {
  return decodeHtmlEntities(
    html
      .replace(/\[\/?\w[^\]]*\]/g, '')            // strip shortcodes
      .replace(/<!--[\s\S]*?-->/g, '')             // strip HTML comments
      .replace(/https?:\/\/(?:www\.)?ashokmahajan\.in\/wp-content\/uploads\//g, '/uploads/')
      .trim()
  );
}

function makeExcerpt(html: string, max = 300): string {
  const plain = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return plain.length > max ? plain.slice(0, max) + '…' : plain;
}

function extractFeaturedImage(post: WpPost): string | null {
  if (!post._embedded?.['wp:featuredmedia']?.length) return null;
  const media = post._embedded['wp:featuredmedia'][0];
  const sizes = media.media_details?.sizes;
  const url =
    sizes?.large?.source_url ??
    sizes?.medium_large?.source_url ??
    media.source_url;
  return url ?? null;
  // Keep full https URL — next.config.ts allows ashokmahajan.in as remote image host
}

// ─── fetch all pages for a category ──────────────────────────────────────────

async function fetchCategory(categoryId: number, categorySlug: string): Promise<WpPost[]> {
  const all: WpPost[] = [];
  let page = 1;
  let totalPages = 1;

  console.log(`\n📥 Fetching category "${categorySlug}" (id=${categoryId})...`);

  while (page <= totalPages) {
    const url =
      `${BASE_URL}/posts` +
      `?categories=${categoryId}` +
      `&per_page=${PER_PAGE}` +
      `&page=${page}` +
      `&_embed=wp:featuredmedia` +
      `&_fields=id,slug,date,title,content,excerpt,featured_media,_links,_embedded`;

    const res = await fetch(url);

    if (!res.ok) {
      console.error(`   ❌ HTTP ${res.status} on page ${page}`);
      break;
    }

    // Read total pages from headers on first request
    if (page === 1) {
      const tp = res.headers.get('x-wp-totalpages');
      const total = res.headers.get('x-wp-total');
      totalPages = tp ? parseInt(tp) : 1;
      console.log(`   Total posts: ${total ?? '?'}, pages: ${totalPages}`);
    }

    const posts: WpPost[] = await res.json();
    all.push(...posts);
    process.stdout.write(`   Page ${page}/${totalPages} — ${all.length} fetched so far\r`);
    page++;

    // Small delay to be polite
    if (page <= totalPages) await new Promise(r => setTimeout(r, 300));
  }

  console.log(`   ✅ Fetched ${all.length} posts for "${categorySlug}"`);
  return all;
}

// ─── upsert posts into DB ─────────────────────────────────────────────────────

async function upsertPosts(posts: WpPost[], category: string) {
  let imported = 0;
  let updated = 0;
  let skipped = 0;

  for (const post of posts) {
    const title = decodeHtmlEntities(post.title.rendered).trim();
    if (!title || title === '0') { skipped++; continue; }

    const content = cleanContent(post.content.rendered);
    const rawExcerpt = cleanContent(post.excerpt.rendered);
    const excerpt = rawExcerpt
      ? rawExcerpt.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
      : makeExcerpt(post.content.rendered);

    const featuredImage = extractFeaturedImage(post);

    let publishedDate: Date;
    try {
      publishedDate = new Date(post.date);
      if (isNaN(publishedDate.getTime())) publishedDate = new Date();
    } catch { publishedDate = new Date(); }

    try {
      const existing = await prisma.blogPost.findUnique({ where: { wpId: post.id } });

      if (existing) {
        await prisma.blogPost.update({
          where: { wpId: post.id },
          data: { title, content, excerpt, category, publishedDate, featuredImage, slug: post.slug },
        });
        updated++;
      } else {
        // New post — check if slug conflicts
        const slugExists = await prisma.blogPost.findUnique({ where: { slug: post.slug } });
        const finalSlug = slugExists ? `${post.slug}-${post.id}` : post.slug;

        await prisma.blogPost.create({
          data: {
            wpId: post.id,
            title,
            slug: finalSlug,
            content,
            excerpt,
            featuredImage,
            category,
            publishedDate,
            author: 'Ashok Mahajan',
            published: true,
          },
        });
        imported++;
      }
    } catch (e) {
      console.error(`\n   ❌ Failed: "${title}" — ${(e as Error).message}`);
      skipped++;
    }
  }

  return { imported, updated, skipped };
}

// ─── main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🚀 WordPress API → Database sync');
  console.log('   Source: https://www.ashokmahajan.in\n');

  // Fetch both categories in parallel
  const [blogPosts, covidPosts] = await Promise.all([
    fetchCategory(1, 'ashok-mahajan'),
    fetchCategory(40, 'covid-india-task-force'),
  ]);

  console.log('\n🔄 Upserting into database...');

  const blogResult = await upsertPosts(blogPosts, 'blog');
  console.log(`\n📝 Blog: +${blogResult.imported} new, ${blogResult.updated} updated, ${blogResult.skipped} skipped`);

  const covidResult = await upsertPosts(covidPosts, 'covid-india-task-force');
  console.log(`🏥 COVID: +${covidResult.imported} new, ${covidResult.updated} updated, ${covidResult.skipped} skipped`);

  // Final totals
  const [totalBlog, totalCovid] = await Promise.all([
    prisma.blogPost.count({ where: { category: 'blog' } }),
    prisma.blogPost.count({ where: { category: 'covid-india-task-force' } }),
  ]);

  console.log(`\n✅ Database totals:`);
  console.log(`   Blog posts:             ${totalBlog}`);
  console.log(`   Covid Task Force posts: ${totalCovid}`);
  console.log(`   Total:                  ${totalBlog + totalCovid}`);
}

main()
  .catch(e => { console.error('\n❌', e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
