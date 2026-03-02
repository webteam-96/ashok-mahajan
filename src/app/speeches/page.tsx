import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Speeches – Rtn. Ashok Mahajan',
  description:
    'Read speeches and addresses delivered by Rtn. Ashok Mahajan at Rotary events and international forums.',
};

const POSTS_PER_PAGE = 12;

function formatDate(date: Date | null | undefined): string {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
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

export default async function SpeechesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params?.page) || 1);
  const skip = (page - 1) * POSTS_PER_PAGE;

  const [speeches, total] = await Promise.all([
    prisma.speech.findMany({
      where: { published: true },
      orderBy: { id: 'asc' },
      skip,
      take: POSTS_PER_PAGE,
    }),
    prisma.speech.count({ where: { published: true } }),
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
            Speeches
          </h1>
          <p style={{ color: '#9dca00', fontSize: '0.875rem' }}>
            <Link href="/" style={{ color: '#9dca00', textDecoration: 'none' }}>Home</Link>
            {' '}&rsaquo; Speeches
          </p>
        </div>
      </div>

      {/* ── Listing ── */}
      <section style={{ background: '#f8f9fa', padding: '60px 0' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 16px' }}>

          {speeches.length === 0 ? (
            <p style={{ color: '#3a3a3a', textAlign: 'center', padding: '60px 0' }}>
              No speeches found.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '48px' }}>
              {speeches.map((speech) => {
                const excerptText = stripHtml(speech.content).slice(0, 260);
                const hasMore = stripHtml(speech.content).length > 260;

                return (
                  <article
                    key={speech.id}
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
                      {/* Date + event */}
                      {(speech.date || speech.eventName) && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
                          {speech.date && (
                            <p style={{ color: '#9dca00', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
                              {formatDate(speech.date)}
                            </p>
                          )}
                          {speech.date && speech.eventName && (
                            <span style={{ color: '#d1d5db', fontSize: '0.75rem' }}>&bull;</span>
                          )}
                          {speech.eventName && (
                            <p style={{ color: '#6b7280', fontSize: '0.875rem', fontStyle: 'italic', margin: 0 }}>
                              {speech.eventName}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Title */}
                      <h2 style={{ margin: 0, lineHeight: 1.3 }}>
                        <Link
                          href={`/speeches/${speech.slug}`}
                          style={{
                            color: '#000f2b',
                            textDecoration: 'none',
                            fontFamily: 'var(--font-sarala)',
                            fontSize: '1.25rem',
                            fontWeight: 700,
                          }}
                        >
                          {speech.title}
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
                          href={`/speeches/${speech.slug}`}
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
              aria-label="Speeches pagination"
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}
            >
              {page > 1 && (
                <Link
                  href={`/speeches?page=${page - 1}`}
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
                    href={`/speeches?page=${p}`}
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
                  href={`/speeches?page=${page + 1}`}
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
