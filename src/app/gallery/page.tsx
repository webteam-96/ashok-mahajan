import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import MediaGallery from '../media-support/_components/MediaGallery';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Inspirational quotes and photo gallery of Rtn. Ashok Mahajan, Past R.I. Director.',
};

const PER_PAGE = 48;

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;

  const total = await prisma.galleryImage.count({
    where: { album: 'gallery', published: true },
  });

  const totalPages = Math.ceil(total / PER_PAGE);
  const page = Math.max(1, Math.min(Number(params?.page) || 1, totalPages || 1));
  const start = (page - 1) * PER_PAGE;

  const rows = await prisma.galleryImage.findMany({
    where: { album: 'gallery', published: true },
    orderBy: [{ order: 'asc' }, { id: 'desc' }],
    skip: start,
    take: PER_PAGE,
    select: { image: true },
  });

  const pageImages = rows.map((r) => r.image);

  function pageNumbers(): (number | '...')[] {
    const nums: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) nums.push(i);
    } else {
      const s = Math.max(2, page - 2);
      const e = Math.min(totalPages - 1, page + 2);
      nums.push(1);
      if (s > 2) nums.push('...');
      for (let i = s; i <= e; i++) nums.push(i);
      if (e < totalPages - 1) nums.push('...');
      nums.push(totalPages);
    }
    return nums;
  }

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
            Gallery
          </h1>
          <p style={{ color: '#9dca00', fontSize: '0.875rem' }}>
            <a href="/" style={{ color: '#9dca00', textDecoration: 'none' }}>Home</a>
            {' '}&rsaquo; Gallery
          </p>
        </div>
      </div>

      {/* Gallery */}
      <section style={{ background: '#f8f9fa', padding: '60px 0' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 16px' }}>
          <MediaGallery images={pageImages} basePath="" />

          {/* Pagination */}
          {totalPages > 1 && (
            <nav
              aria-label="Gallery pagination"
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '48px' }}
            >
              {page > 1 && (
                <a
                  href={`/gallery?page=${page - 1}`}
                  style={{
                    padding: '8px 14px', border: '1px solid #d1d5db', borderRadius: '6px',
                    color: '#3a3a3a', textDecoration: 'none', fontSize: '0.875rem', background: '#fff',
                  }}
                >
                  &larr; Prev
                </a>
              )}

              {pageNumbers().map((p, idx) =>
                p === '...' ? (
                  <span key={`e${idx}`} style={{ padding: '8px 4px', color: '#9ca3af', fontSize: '0.875rem' }}>
                    &hellip;
                  </span>
                ) : (
                  <a
                    key={p}
                    href={`/gallery?page=${p}`}
                    aria-current={p === page ? 'page' : undefined}
                    style={{
                      padding: '8px 14px', borderRadius: '6px',
                      border: p === page ? 'none' : '1px solid #d1d5db',
                      background: p === page ? '#9dca00' : '#fff',
                      color: p === page ? '#000f2b' : '#3a3a3a',
                      textDecoration: 'none', fontSize: '0.875rem',
                      fontWeight: p === page ? 700 : 400,
                    }}
                  >
                    {p}
                  </a>
                )
              )}

              {page < totalPages && (
                <a
                  href={`/gallery?page=${page + 1}`}
                  style={{
                    padding: '8px 14px', border: '1px solid #d1d5db', borderRadius: '6px',
                    color: '#3a3a3a', textDecoration: 'none', fontSize: '0.875rem', background: '#fff',
                  }}
                >
                  Next &rarr;
                </a>
              )}
            </nav>
          )}
        </div>
      </section>
    </>
  );
}
