import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import ImagesPaginator from '@/components/ImagesPaginator';

export const metadata: Metadata = {
  title: 'Awards & Recognition',
  description: 'Awards and recognition received by Rtn. Ashok Mahajan, Past R.I. Director.',
};

export default async function AwardsPage() {
  const awards = await prisma.award.findMany({
    where: { published: true },
    orderBy: [{ order: 'asc' }, { id: 'asc' }],
    select: { image: true },
  });

  const images = awards.map((a) => a.image);

  return (
    <>
      {/* Banner */}
      <div className="page-banner" style={{ background: '#000f2b' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 16px' }}>
          <h1 style={{ color: 'white', fontFamily: 'var(--font-sarala)', fontWeight: 700, marginBottom: '8px' }}>
            Awards &amp; Recognition
          </h1>
          <p style={{ color: '#9dca00', fontSize: '0.875rem' }}>
            <a href="/" style={{ color: '#9dca00', textDecoration: 'none' }}>Home</a>
            {' '}&rsaquo; Awards &amp; Recognition
          </p>
        </div>
      </div>

      {/* Gallery */}
      <section style={{ background: '#f8f9fa', padding: '60px 0' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 16px' }}>
          <ImagesPaginator images={images} perPage={24} basePath="" />
        </div>
      </section>
    </>
  );
}
