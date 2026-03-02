import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import PublicationsGallery from './_components/PublicationsGallery';


export const metadata: Metadata = {
  title: 'Publications',
  description: 'Publications by Rtn. Ashok Mahajan, Past R.I. Director.',
};

export default async function PublicationsPage() {
  const publications = await prisma.publication.findMany({
    where: { published: true },
    orderBy: { id: 'asc' },
  });

  const items = publications
    .filter((p) => p.coverImage)
    .map((p) => ({
      image: p.coverImage!,
      pdfUrl: p.pdfFile ?? undefined,
    }));

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
            Publications
          </h1>
          <p style={{ color: '#9dca00', fontSize: '0.875rem' }}>
            <a href="/" style={{ color: '#9dca00', textDecoration: 'none' }}>Home</a>
            {' '}&rsaquo; Publications
          </p>
        </div>
      </div>

      {/* Gallery */}
      <section style={{ background: '#f8f9fa', padding: '60px 0' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 16px' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '32px' }}>
            {items.length} publications
          </p>

          <PublicationsGallery items={items} />
        </div>
      </section>
    </>
  );
}
