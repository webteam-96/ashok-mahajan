import { prisma } from '@/lib/prisma';
import BlogListing from './_components/BlogListing';

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
          Blog
        </h1>
        <p style={{ color: '#9dca00', fontSize: '0.875rem' }}>
          <a href="/" style={{ color: '#9dca00', textDecoration: 'none' }}>Home</a>
          {' '}&rsaquo; Blog
        </p>
      </div>
    </div>
  );
}

export default async function BlogPage() {
  const raw = await prisma.blogPost.findMany({
    where: { published: true, category: 'blog' },
    orderBy: { publishedDate: 'desc' },
    select: { id: true, slug: true, title: true, excerpt: true, featuredImage: true, publishedDate: true, category: true },
  });

  const posts = raw.map((p) => ({
    ...p,
    publishedDate: p.publishedDate.toISOString(),
  }));

  return (
    <>
      <PageBanner />
      <section style={{ background: '#f8f9fa', padding: '60px 0' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 16px' }}>
          <BlogListing posts={posts} />
        </div>
      </section>
    </>
  );
}
