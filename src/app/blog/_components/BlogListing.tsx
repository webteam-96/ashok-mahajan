'use client';

import Link from 'next/link';
import Image from 'next/image';
import Paginator from '@/components/Paginator';

type BlogItem = {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  featuredImage: string | null;
  publishedDate: string;
  category: string;
};

export default function BlogListing({ posts }: { posts: BlogItem[] }) {
  return (
    <Paginator
      items={posts}
      perPage={12}
      renderItems={(pagePosts) =>
        pagePosts.length === 0 ? (
          <p style={{ color: '#3a3a3a', textAlign: 'center', padding: '60px 0' }}>No posts found.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '48px' }}>
            {pagePosts.map((post) => {
              const date = new Date(post.publishedDate).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'long', year: 'numeric',
              });
              const excerptText = post.excerpt
                ? post.excerpt.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
                : '';

              return (
                <article
                  key={post.id}
                  className="listing-card"
                  style={{
                    background: '#fff',
                    borderRadius: '10px',
                    boxShadow: '0 1px 4px rgba(0,15,43,0.07)',
                    borderLeft: '4px solid #9dca00',
                  }}
                >
                  {post.featuredImage && (
                    <div className="listing-card-img" style={{ position: 'relative' }}>
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="220px"
                      />
                    </div>
                  )}

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
                        href={`/blog/${post.slug}`}
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
                      <p style={{ color: '#4b5563', fontSize: '0.9375rem', lineHeight: 1.7, margin: 0, flex: 1 }}>
                        {excerptText.length > 260 ? excerptText.slice(0, 260) + '…' : excerptText}
                      </p>
                    )}
                    <div>
                      <Link
                        href={`/blog/${post.slug}`}
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
        )
      }
    />
  );
}
