'use client';

import Paginator from '@/components/Paginator';
import YouTubeEmbed from './YouTubeEmbed';

type VideoItem = {
  id: number;
  title: string;
  youtubeUrl: string | null;
  videoFile: string | null;
  date: string | null;
};

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

export default function VideosListing({ videos }: { videos: VideoItem[] }) {
  return (
    <Paginator
      items={videos}
      perPage={18}
      renderItems={(pageVideos) => (
        <div className="videos-grid" style={{ marginBottom: '48px' }}>
          {pageVideos.map((video) => {
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
                <div style={{ padding: '12px 14px 14px' }}>
                  <p
                    style={{
                      margin: 0,
                      fontFamily: 'Sarala, sans-serif',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      color: '#000f2b',
                      lineHeight: 1.35,
                    }}
                  >
                    {video.title}
                  </p>
                  {video.date && (
                    <p
                      style={{
                        margin: '4px 0 0',
                        fontFamily: 'PT Sans, sans-serif',
                        fontSize: '0.78rem',
                        color: '#9dca00',
                      }}
                    >
                      {new Date(video.date).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    />
  );
}
