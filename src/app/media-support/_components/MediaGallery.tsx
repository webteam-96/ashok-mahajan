'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';

export default function MediaGallery({ images, basePath = '/media-support/' }: { images: string[]; basePath?: string }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const isOpen = lightboxIndex !== null;

  const close = useCallback(() => setLightboxIndex(null), []);
  const prev = useCallback(() =>
    setLightboxIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length)),
    [images.length]);
  const next = useCallback(() =>
    setLightboxIndex((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length]);

  /* Keyboard nav */
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, close, prev, next]);

  /* Lock body scroll */
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const src = lightboxIndex !== null ? `${basePath}${images[lightboxIndex]}` : '';

  return (
    <>
      <style>{`
        .media-gallery-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        @media (max-width: 768px) {
          .media-gallery-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .media-gallery-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Responsive grid */}
      <div className="media-gallery-grid">
        {images.map((filename, index) => (
          <div
            key={`${filename}-${index}`}
            role="button"
            tabIndex={0}
            aria-label={`View image ${index + 1}`}
            onClick={() => setLightboxIndex(index)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setLightboxIndex(index); }}
            style={{
              position: 'relative',
              aspectRatio: '4/3',
              borderRadius: '8px',
              overflow: 'hidden',
              background: '#e5e7eb',
              cursor: 'pointer',
              boxShadow: '0 1px 4px rgba(0,15,43,0.08)',
            }}
          >
            <Image
              src={`${basePath}${filename}`}
              alt={`Media coverage ${index + 1}`}
              fill
              style={{ objectFit: 'cover', transition: 'transform 0.3s' }}
              sizes="(max-width: 768px) 100vw, 33vw"
              onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.06)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }}
            />
            {/* Hover zoom icon */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,15,43,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0,
                transition: 'opacity 0.25s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.opacity = '1'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.opacity = '0'; }}
            >
              <span style={{ color: '#fff', fontSize: '2rem', lineHeight: 1 }}>&#9906;</span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={close}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.93)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Content — stop click propagation so clicking image doesn't close */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: '90vw',
            }}
          >
            {/* Close */}
            <button
              onClick={close}
              aria-label="Close (ESC)"
              style={{
                position: 'absolute',
                top: '-44px',
                right: 0,
                background: '#9dca00',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                cursor: 'pointer',
                color: '#000f2b',
                fontSize: '1.3rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              &times;
            </button>

            {/* Image */}
            <div style={{ position: 'relative', width: '85vw', maxWidth: '960px', height: '80vh' }}>
              <Image
                src={src}
                alt={`Media coverage ${lightboxIndex! + 1}`}
                fill
                style={{ objectFit: 'contain', borderRadius: '6px' }}
                sizes="90vw"
                priority
              />
            </div>

            {/* Counter */}
            <p style={{ color: '#9ca3af', fontSize: '0.8rem', marginTop: '12px' }}>
              {lightboxIndex! + 1} / {images.length}
            </p>
          </div>

          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Previous"
            style={{
              position: 'fixed',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.12)',
              border: 'none',
              borderRadius: '50%',
              width: '52px',
              height: '52px',
              cursor: 'pointer',
              color: '#fff',
              fontSize: '1.6rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(4px)',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#9dca00'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.12)'; }}
          >
            &#8249;
          </button>

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Next"
            style={{
              position: 'fixed',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.12)',
              border: 'none',
              borderRadius: '50%',
              width: '52px',
              height: '52px',
              cursor: 'pointer',
              color: '#fff',
              fontSize: '1.6rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(4px)',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#9dca00'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.12)'; }}
          >
            &#8250;
          </button>
        </div>
      )}
    </>
  );
}
