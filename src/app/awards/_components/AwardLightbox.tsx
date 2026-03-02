'use client';

import Image from 'next/image';
import { useState } from 'react';

export interface AwardItem {
  id: number;
  title?: string | null;
  image: string;
  year: number | null;
  description: string | null;
}

export default function AwardLightbox({ awards }: { awards: AwardItem[] }) {
  const [selected, setSelected] = useState<AwardItem | null>(null);

  return (
    <>
      {/* Masonry Grid */}
      <div
        style={{
          columns: '3 240px',
          columnGap: '24px',
        }}
      >
        {awards.map((award) => (
          <div
            key={award.id}
            onClick={() => setSelected(award)}
            style={{
              breakInside: 'avoid',
              marginBottom: '24px',
              cursor: 'pointer',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
              background: '#fff',
              border: '1px solid #e5e7eb',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.10)';
            }}
          >
            <div style={{ position: 'relative', width: '100%', paddingTop: '75%' }}>
              <Image
                src={award.image}
                alt={award.title ?? ''}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
              {award.year && (
                <span
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: '#9dca00',
                    color: '#fff',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '999px',
                  }}
                >
                  {award.year}
                </span>
              )}
            </div>
            <div style={{ padding: '12px 16px' }}>
              <p
                style={{
                  color: '#000f2b',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  lineHeight: 1.4,
                }}
              >
                {award.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
          role="dialog"
          aria-modal="true"
          aria-label={selected.title ?? 'Award'}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: '12px',
              overflow: 'hidden',
              maxWidth: '700px',
              width: '100%',
              position: 'relative',
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelected(null)}
              aria-label="Close lightbox"
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: '#9dca00',
                border: 'none',
                borderRadius: '999px',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                color: '#fff',
                fontSize: '1.1rem',
                fontWeight: 700,
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              &times;
            </button>

            <div style={{ position: 'relative', width: '100%', paddingTop: '60%' }}>
              <Image
                src={selected.image}
                alt={selected.title ?? ''}
                fill
                style={{ objectFit: 'contain' }}
                sizes="700px"
              />
            </div>

            <div style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <h2
                  style={{
                    color: '#000f2b',
                    fontFamily: 'var(--font-sarala)',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    flex: 1,
                  }}
                >
                  {selected.title}
                </h2>
                {selected.year && (
                  <span
                    style={{
                      background: '#9dca00',
                      color: '#fff',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '4px 12px',
                      borderRadius: '999px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {selected.year}
                  </span>
                )}
              </div>
              {selected.description && (
                <p style={{ color: '#3a3a3a', fontSize: '0.875rem', lineHeight: 1.6 }}>
                  {selected.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
