import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

export async function generateStaticParams() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true, category: 'covid-india-task-force' },
    select: { slug: true },
  });
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findFirst({
    where: { slug, category: 'covid-india-task-force', published: true },
  });
  if (!post) return { title: 'Post Not Found' };
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || undefined,
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt || undefined,
      images: post.featuredImage ? [{ url: post.featuredImage }] : [],
    },
  };
}

export default async function CovidPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await prisma.blogPost.findFirst({
    where: { slug, category: 'covid-india-task-force', published: true },
  });

  if (!post) notFound();

  const postUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ashokmahajan.com'}/covid-india-task-force/${post.slug}`;
  const encodedUrl = encodeURIComponent(postUrl);
  const encodedTitle = encodeURIComponent(post.title);

  return (
    <>
      {/* Banner */}
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
            {post.title}
          </h1>
          <p style={{ color: '#9dca00', fontSize: '0.875rem' }}>
            <a href="/" style={{ color: '#9dca00', textDecoration: 'none' }}>Home</a>
            {' '}&rsaquo;{' '}
            <Link href="/covid-india-task-force" style={{ color: '#9dca00', textDecoration: 'none' }}>
              Covid India Task Force
            </Link>
            {' '}&rsaquo; Article
          </p>
        </div>
      </div>

      <section style={{ background: '#fff', padding: '60px 0' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 16px' }}>

          {/* Featured Image */}
          {post.featuredImage && (
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '420px',
                borderRadius: '8px',
                overflow: 'hidden',
                marginBottom: '32px',
              }}
            >
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
          )}

          {/* Meta */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '32px',
              flexWrap: 'wrap',
            }}
          >
            <time
              dateTime={new Date(post.publishedDate).toISOString()}
              style={{ color: '#9ca3af', fontSize: '0.875rem' }}
            >
              {new Date(post.publishedDate).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </time>
            <span
              style={{
                background: '#9dca00',
                color: '#000f2b',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '4px 12px',
                borderRadius: '999px',
              }}
            >
              Covid India Task Force
            </span>
          </div>

          {/* Article Content */}
          <article
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Share */}
          <div
            style={{
              borderTop: '1px solid #e5e7eb',
              marginTop: '48px',
              paddingTop: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <span style={{ color: '#3a3a3a', fontWeight: 600, fontSize: '0.875rem' }}>Share:</span>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: '#1877f2',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '4px',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              Facebook
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: '#1da1f2',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '4px',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              Twitter / X
            </a>
          </div>

          {/* Back link */}
          <div style={{ marginTop: '32px' }}>
            <Link
              href="/covid-india-task-force"
              style={{
                color: '#9dca00',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.875rem',
              }}
            >
              &larr; Back to Covid India Task Force
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
