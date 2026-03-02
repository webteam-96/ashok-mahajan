import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import YouTubeEmbed from './_components/YouTubeEmbed';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Videos',
  description: 'Video gallery of Rtn. Ashok Mahajan, Past R.I. Director.',
};

const PER_PAGE = 18;

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return match?.[1] ?? null;
}

function Mp4Player({ url }: { url: string }) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        paddingTop: '56.25%',
        background: '#000',
        borderRadius: '8px 8px 0 0',
        overflow: 'hidden',
      }}
    >
      <video
        controls
        preload="metadata"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        <source src={url} />
      </video>
    </div>
  );
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

export default async function VideosPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params?.page) || 1);
  const skip = (page - 1) * PER_PAGE;

  const [videos, total] = await Promise.all([
    prisma.video.findMany({
      where: { published: true },
      orderBy: { id: 'asc' },
      skip,
      take: PER_PAGE,
    }),
    prisma.video.count({ where: { published: true } }),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);

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

          <div className="videos-grid" style={{ marginBottom: '48px' }}>
            {videos.map((video) => {
              const youtubeId = video.youtubeUrl ? getYouTubeId(video.youtubeUrl) : null;
              return (
                <div
                  key={video.id}
                  style={{
                    background: '#fff',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 1px 4px rgba(0,15,43,0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {youtubeId ? (
                    <YouTubeEmbed videoId={youtubeId} title={video.title} />
                  ) : video.videoFile ? (
                    <Mp4Player url={video.videoFile} />
                  ) : null}
                  {/* Title below video */}
                  <div style={{ padding: '12px 14px 14px' }}>
                    <p style={{
                      margin: 0,
                      fontFamily: 'Sarala, sans-serif',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      color: '#000f2b',
                      lineHeight: 1.35,
                    }}>
                      {video.title}
                    </p>
                    {video.date && (
                      <p style={{
                        margin: '4px 0 0',
                        fontFamily: 'PT Sans, sans-serif',
                        fontSize: '0.78rem',
                        color: '#9dca00',
                      }}>
                        {new Date(video.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav
              aria-label="Videos pagination"
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}
            >
              {page > 1 && (
                <a href={`/videos?page=${page - 1}`} style={{ padding: '8px 14px', border: '1px solid #d1d5db', borderRadius: '6px', color: '#3a3a3a', textDecoration: 'none', fontSize: '0.875rem', background: '#fff' }}>
                  &larr; Prev
                </a>
              )}
              {pageNumbers(page, totalPages).map((p, idx) =>
                p === '...' ? (
                  <span key={`e${idx}`} style={{ padding: '8px 4px', color: '#9ca3af', fontSize: '0.875rem' }}>…</span>
                ) : (
                  <a
                    key={p}
                    href={`/videos?page=${p}`}
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
                <a href={`/videos?page=${page + 1}`} style={{ padding: '8px 14px', border: '1px solid #d1d5db', borderRadius: '6px', color: '#3a3a3a', textDecoration: 'none', fontSize: '0.875rem', background: '#fff' }}>
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
