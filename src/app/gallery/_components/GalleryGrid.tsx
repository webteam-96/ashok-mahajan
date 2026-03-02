'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';

export interface GalleryImageItem {
  id: number;
  title: string;
  image: string;
  caption: string | null;
  album: string | null;
}

/* ============================================================
   GALLERY GRID — Client Component
   Handles the responsive image grid + lightbox with
   prev/next navigation and keyboard (ESC) to close.
   ============================================================ */
export default function GalleryGrid({ images }: { images: GalleryImageItem[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const isOpen = lightboxIndex !== null;
  const currentImage = isOpen ? images[lightboxIndex!] : null;

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const showPrev = useCallback(() => {
    setLightboxIndex((prev) =>
      prev === null ? null : (prev - 1 + images.length) % images.length
    );
  }, [images.length]);

  const showNext = useCallback(() => {
    setLightboxIndex((prev) =>
      prev === null ? null : (prev + 1) % images.length
    );
  }, [images.length]);

  /* Keyboard navigation */
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, closeLightbox, showPrev, showNext]);

  /* Prevent body scroll when lightbox is open */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {/* Responsive Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '16px',
        }}
      >
        {images.map((img, index) => (
          <div
            key={img.id}
            onClick={() => setLightboxIndex(index)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setLightboxIndex(index); }}
            aria-label={`View image: ${img.title}`}
            style={{
              position: 'relative',
              aspectRatio: '1 / 1',
              overflow: 'hidden',
              borderRadius: '8px',
              cursor: 'pointer',
              background: '#e5e7eb',
            }}
          >
            <Image
              src={img.image}
              alt={img.title}
              fill
              style={{ objectFit: 'cover', transition: 'transform 0.3s' }}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.08)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)';
              }}
            />
            {/* Hover Overlay */}
            <div
              className="gallery-overlay"
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0, 15, 43, 0.55)',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '16px',
                opacity: 0,
                transition: 'opacity 0.3s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.opacity = '0';
              }}
            >
              <p
                style={{
                  color: '#fff',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  lineHeight: 1.3,
                }}
              >
                {img.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {isOpen && currentImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={currentImage.title}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.92)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={closeLightbox}
        >
          {/* Inner container — stops click propagation */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              aria-label="Close lightbox (ESC)"
              style={{
                position: 'absolute',
                top: '-44px',
                right: 0,
                background: '#9dca00',
                border: 'none',
                borderRadius: '999px',
                width: '36px',
                height: '36px',
                cursor: 'pointer',
                color: '#fff',
                fontSize: '1.2rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1,
              }}
            >
              &times;
            </button>

            {/* Image */}
            <div
              style={{
                position: 'relative',
                maxWidth: '85vw',
                maxHeight: '80vh',
                width: '800px',
                height: '600px',
              }}
            >
              <Image
                src={currentImage.image}
                alt={currentImage.title}
                fill
                style={{ objectFit: 'contain', borderRadius: '8px' }}
                sizes="(max-width: 768px) 90vw, 800px"
                priority
              />
            </div>

            {/* Caption */}
            {(currentImage.caption || currentImage.title) && (
              <p
                style={{
                  color: '#fff',
                  fontSize: '0.875rem',
                  marginTop: '16px',
                  textAlign: 'center',
                  maxWidth: '600px',
                  lineHeight: 1.5,
                }}
              >
                {currentImage.caption || currentImage.title}
              </p>
            )}

            {/* Counter */}
            <p style={{ color: '#9ca3af', fontSize: '0.75rem', marginTop: '8px' }}>
              {lightboxIndex! + 1} / {images.length}
            </p>
          </div>

          {/* Prev Button */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); showPrev(); }}
              aria-label="Previous image"
              style={{
                position: 'fixed',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                borderRadius: '999px',
                width: '48px',
                height: '48px',
                cursor: 'pointer',
                color: '#fff',
                fontSize: '1.4rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(4px)',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#9dca00'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.15)'; }}
            >
              &#8249;
            </button>
          )}

          {/* Next Button */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); showNext(); }}
              aria-label="Next image"
              style={{
                position: 'fixed',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                borderRadius: '999px',
                width: '48px',
                height: '48px',
                cursor: 'pointer',
                color: '#fff',
                fontSize: '1.4rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(4px)',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#9dca00'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.15)'; }}
            >
              &#8250;
            </button>
          )}
        </div>
      )}
    </>
  );
}
