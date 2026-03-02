'use client';

import { useState } from 'react';
import Image from 'next/image';

interface YouTubeEmbedProps {
  videoId: string;
  title: string;
}

export default function YouTubeEmbed({ videoId, title }: YouTubeEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  if (!isLoaded) {
    return (
      <div
        onClick={() => setIsLoaded(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsLoaded(true); }}
        aria-label={`Play video: ${title}`}
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: '56.25%',
          cursor: 'pointer',
          background: '#000',
          borderRadius: '8px 8px 0 0',
          overflow: 'hidden',
        }}
      >
        <Image
          src={thumbnailUrl}
          alt={title}
          fill
          style={{ objectFit: 'cover', opacity: 0.85 }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Play button overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              background: '#ff0000',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        paddingTop: '56.25%',
        borderRadius: '8px 8px 0 0',
        overflow: 'hidden',
      }}
    >
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 'none',
        }}
      />
    </div>
  );
}
