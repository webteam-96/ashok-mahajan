'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';

export type Publication = {
  image: string;   // filename in /publications/
  pdfUrl?: string; // external PDF link if present
};

export default function PublicationsGallery({ items }: { items: Publication[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const isOpen = lightboxIndex !== null;
  const close = useCallback(() => setLightboxIndex(null), []);
  const prev = useCallback(() =>
    setLightboxIndex((i) => (i === null ? null : (i - 1 + items.length) % items.length)),
    [items.length]);
  const next = useCallback(() =>
    setLightboxIndex((i) => (i === null ? null : (i + 1) % items.length)),
    [items.length]);

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

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const currentItem = lightboxIndex !== null ? items[lightboxIndex] : null;

  return (
    <>
      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '24px',
        }}
      >
        {items.map((item, index) => (
          <div
            key={item.image}
            style={{
              background: '#fff',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 1px 4px rgba(0,15,43,0.08)',
              cursor: 'pointer',
              transition: 'box-shadow 0.25s, transform 0.25s',
              position: 'relative',
            }}
            onClick={() => setLightboxIndex(index)}
            role="button"
            tabIndex={0}
            aria-label={`View publication ${index + 1}`}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setLightboxIndex(index); }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,15,43,0.15)';
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px rgba(0,15,43,0.08)';
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
            }}
          >
            {/* Cover image */}
            <div style={{ position: 'relative', width: '100%', paddingTop: '133%' }}>
              <Image
                src={item.image}
                alt={`Publication ${index + 1}`}
                fill
                style={{ objectFit: 'contain', background: '#f3f4f6', padding: '8px' }}
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>

            {/* PDF badge */}
            {item.pdfUrl && (
              <div
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: '#9dca00',
                  color: '#000f2b',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '4px',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                PDF
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {isOpen && currentItem && (
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
            <div style={{ position: 'relative', width: '60vw', maxWidth: '600px', height: '80vh' }}>
              <Image
                src={currentItem.image}
                alt={`Publication ${lightboxIndex! + 1}`}
                fill
                style={{ objectFit: 'contain' }}
                sizes="70vw"
                priority
              />
            </div>

            {/* PDF link + counter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginTop: '16px' }}>
              <p style={{ color: '#9ca3af', fontSize: '0.8rem', margin: 0 }}>
                {lightboxIndex! + 1} / {items.length}
              </p>
              {currentItem.pdfUrl && (
                <a
                  href={currentItem.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#9dca00',
                    color: '#000f2b',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    padding: '8px 18px',
                    borderRadius: '4px',
                    textDecoration: 'none',
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download PDF
                </a>
              )}
            </div>
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
