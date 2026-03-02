import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Messages – Rtn. Ashok Mahajan',
  description:
    'Inspirational messages and reflections from Rtn. Ashok Mahajan, Past R.I. Director and Trustee of The Rotary Foundation.',
};

const POSTS_PER_PAGE = 12;

/** True when caption contains real OCR text (not just the title repeated). */
function hasOcrText(title: string | null, caption: string | null): boolean {
  if (!caption) return false;
  return caption.trim() !== (title ?? '').trim() && caption.trim().length > 10;
}

function pageNumbers(page: number, totalPages: number): (number | '...')[] {
  const nums: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) nums.push(i);
  } else {
    const start = Math.max(2, page - 2);
    const end = Math.min(totalPages - 1, page + 2);
    nums.push(1);
    if (start > 2) nums.push('...');
    for (let i = start; i <= end; i++) nums.push(i);
    if (end < totalPages - 1) nums.push('...');
    nums.push(totalPages);
  }
  return nums;
}

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params?.page) || 1);
  const skip = (page - 1) * POSTS_PER_PAGE;

  const [messages, total] = await Promise.all([
    prisma.galleryImage.findMany({
      where: { published: true, album: 'messages' },
      orderBy: { order: 'asc' },
      skip,
      take: POSTS_PER_PAGE,
    }),
    prisma.galleryImage.count({ where: { published: true, album: 'messages' } }),
  ]);

  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  return (
    <>
      {/* ── Banner ── */}
      <div className="page-banner" style={{ background: '#000f2b' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 16px' }}>
          <h1
            style={{
              color: 'white',
              fontFamily: 'var(--font-sarala)',
              fontWeight: 700,
              marginBottom: '8px',
            }}
          >
            Messages
          </h1>
          <p style={{ color: '#9dca00', fontSize: '0.875rem' }}>
            <Link href="/" style={{ color: '#9dca00', textDecoration: 'none' }}>Home</Link>
            {' '}&rsaquo; Messages
          </p>
        </div>
      </div>

      {/* ── Listing ── */}
      <section style={{ background: '#f8f9fa', padding: '60px 0' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 16px' }}>

          {messages.length === 0 ? (
            <p style={{ color: '#3a3a3a', textAlign: 'center', padding: '60px 0' }}>
              No messages found.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '48px' }}>
              {messages.map((msg) => {
                const ocrText = hasOcrText(msg.title, msg.caption) ? msg.caption! : '';
                const excerptText = ocrText
                  ? ocrText.replace(/\s+/g, ' ').trim().slice(0, 260)
                  : '';
                const hasMore = ocrText.replace(/\s+/g, ' ').trim().length > 260;

                return (
                  <article
                    key={msg.id}
                    style={{
                      background: '#fff',
                      borderRadius: '10px',
                      boxShadow: '0 1px 4px rgba(0,15,43,0.07)',
                      borderLeft: '4px solid #9dca00',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        padding: '24px 28px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                      }}
                    >
                      {/* Title */}
                      <h2 style={{ margin: 0, lineHeight: 1.3 }}>
                        <Link
                          href={`/messages/${msg.id}`}
                          style={{
                            color: '#000f2b',
                            textDecoration: 'none',
                            fontFamily: 'var(--font-sarala)',
                            fontSize: '1.25rem',
                            fontWeight: 700,
                          }}
                        >
                          {msg.title}
                        </Link>
                      </h2>

                      {/* Excerpt */}
                      {excerptText && (
                        <p style={{ color: '#4b5563', fontSize: '0.9375rem', lineHeight: 1.7, margin: 0 }}>
                          {excerptText}{hasMore ? '\u2026' : ''}
                        </p>
                      )}

                      {/* Read More */}
                      <div>
                        <Link
                          href={`/messages/${msg.id}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            color: '#9dca00',
                            fontFamily: 'var(--font-sarala)',
                            fontWeight: 700,
                            fontSize: '0.875rem',
                            textDecoration: 'none',
                            borderBottom: '1px solid #9dca00',
                            paddingBottom: '1px',
                          }}
                        >
                          Read More &rarr;
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav
              aria-label="Messages pagination"
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}
            >
              {page > 1 && (
                <Link
                  href={`/messages?page=${page - 1}`}
                  style={{ padding: '8px 14px', border: '1px solid #d1d5db', borderRadius: '6px', color: '#3a3a3a', textDecoration: 'none', fontSize: '0.875rem', background: '#fff' }}
                >
                  &larr; Prev
                </Link>
              )}
              {pageNumbers(page, totalPages).map((p, idx) =>
                p === '...' ? (
                  <span key={`e${idx}`} style={{ padding: '8px 4px', color: '#9ca3af', fontSize: '0.875rem' }}>…</span>
                ) : (
                  <Link
                    key={p}
                    href={`/messages?page=${p}`}
                    aria-current={p === page ? 'page' : undefined}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '6px',
                      border: p === page ? 'none' : '1px solid #d1d5db',
                      background: p === page ? '#9dca00' : '#fff',
                      color: p === page ? '#000f2b' : '#3a3a3a',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      fontWeight: p === page ? 700 : 400,
                    }}
                  >
                    {p}
                  </Link>
                )
              )}
              {page < totalPages && (
                <Link
                  href={`/messages?page=${page + 1}`}
                  style={{ padding: '8px 14px', border: '1px solid #d1d5db', borderRadius: '6px', color: '#3a3a3a', textDecoration: 'none', fontSize: '0.875rem', background: '#fff' }}
                >
                  Next &rarr;
                </Link>
              )}
            </nav>
          )}

        </div>
      </section>
    </>
  );
}
