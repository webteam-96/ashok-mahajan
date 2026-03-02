import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import VideosListing from './_components/VideosListing';

export const metadata: Metadata = {
  title: 'Videos',
  description: 'Video gallery of Rtn. Ashok Mahajan, Past R.I. Director.',
};

export default async function VideosPage() {
  const raw = await prisma.video.findMany({
    where: { published: true },
    orderBy: { id: 'asc' },
    select: { id: true, title: true, youtubeUrl: true, videoFile: true, date: true },
  });

  const videos = raw.map((v) => ({
    ...v,
    date: v.date ? v.date.toISOString() : null,
  }));

  return (
    <>
      {/* Banner */}
      <div className="page-banner" style={{ background: '#000f2b' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 16px' }}>
          <h1 style={{ color: 'white', fontFamily: 'var(--font-sarala)', fontWeight: 700, marginBottom: '8px' }}>
            Videos
          </h1>
          <p style={{ color: '#9dca00', fontSize: '0.875rem' }}>
            <a href="/" style={{ color: '#9dca00', textDecoration: 'none' }}>Home</a>
            {' '}&rsaquo; Videos
          </p>
        </div>
      </div>

      {/* Video grid */}
      <section style={{ background: '#f8f9fa', padding: '60px 0' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 16px' }}>
          <VideosListing videos={videos} />
        </div>
      </section>
    </>
  );
}
