import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const POSTS_PER_PAGE = 12;

function PageBanner() {
  return (
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
          Covid India Task Force
        </h1>
        <p style={{ color: '#9dca00', fontSize: '0.875rem' }}>
          <a href="/" style={{ color: '#9dca00', textDecoration: 'none' }}>Home</a>
          {' '}&rsaquo; Covid India Task Force
        </p>
      </div>
    </div>
  );
}

export default async function CovidIndiaTaskForcePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params?.page) || 1);
  const skip = (page - 1) * POSTS_PER_PAGE;

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where: { published: true, category: 'covid-india-task-force' },
      orderBy: { publishedDate: 'desc' },
      skip,
      take: POSTS_PER_PAGE,
    }),
    prisma.blogPost.count({ where: { published: true, category: 'covid-india-task-force' } }),
  ]);

  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  function pageNumbers(): (number | '...')[] {
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

  return (
    <>
      <PageBanner />

      <section style={{ background: '#f8f9fa', padding: '60px 0' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 16px' }}>
          {/* Count line */}
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '32px' }}>
            Showing {skip + 1}–{Math.min(skip + POSTS_PER_PAGE, total)} of {total} posts
          </p>

          {posts.length === 0 ? (
            <p style={{ color: '#3a3a3a', textAlign: 'center', padding: '60px 0' }}>
              No posts found.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '48px' }}>
              {posts.map((post) => {
                const date = new Date(post.publishedDate).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'long', year: 'numeric',
                });
                const excerptText = post.excerpt
                  ? post.excerpt.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
                  : '';

                return (
                  <article
                    key={post.id}
                    style={{
                      background: '#fff',
                      borderRadius: '10px',
                      boxShadow: '0 1px 4px rgba(0,15,43,0.07)',
                      borderLeft: '4px solid #9dca00',
                      display: 'flex',
                      gap: '0',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Featured image — only if present */}
                    {post.featuredImage && (
                      <div
                        style={{
                          position: 'relative',
                          flexShrink: 0,
                          width: '220px',
                          minHeight: '160px',
                          background: '#e5e7eb',
                        }}
                      >
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          fill
                          style={{ objectFit: 'cover' }}
                          sizes="220px"
                        />
                      </div>
                    )}

                    {/* Text content */}
                    <div
                      style={{
                        padding: '24px 28px',
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                      }}
                    >
                      <p style={{ color: '#9dca00', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
                        {date}
                      </p>

                      <h2 style={{ margin: 0, lineHeight: 1.3 }}>
                        <Link
                          href={`/covid-india-task-force/${post.slug}`}
                          style={{
                            color: '#000f2b',
                            textDecoration: 'none',
                            fontFamily: 'var(--font-sarala)',
                            fontSize: '1.25rem',
                            fontWeight: 700,
                          }}
                        >
                          {post.title}
                        </Link>
                      </h2>

                      {excerptText && (
                        <p
                          style={{
                            color: '#4b5563',
                            fontSize: '0.9375rem',
                            lineHeight: 1.7,
                            margin: 0,
                            flex: 1,
                          }}
                        >
                          {excerptText.length > 260 ? excerptText.slice(0, 260) + '…' : excerptText}
                        </p>
                      )}

                      <div>
                        <Link
                          href={`/covid-india-task-force/${post.slug}`}
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
              aria-label="Covid task force pagination"
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}
            >
              {page > 1 && (
                <Link
                  href={`/covid-india-task-force?page=${page - 1}`}
                  style={{
                    padding: '8px 14px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    color: '#3a3a3a',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    background: '#fff',
                  }}
                >
                  &larr; Prev
                </Link>
              )}

              {pageNumbers().map((p, idx) =>
                p === '...' ? (
                  <span key={`e${idx}`} style={{ padding: '8px 4px', color: '#9ca3af', fontSize: '0.875rem' }}>
                    …
                  </span>
                ) : (
                  <Link
                    key={p}
                    href={`/covid-india-task-force?page=${p}`}
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
                  href={`/covid-india-task-force?page=${page + 1}`}
                  style={{
                    padding: '8px 14px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    color: '#3a3a3a',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    background: '#fff',
                  }}
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
