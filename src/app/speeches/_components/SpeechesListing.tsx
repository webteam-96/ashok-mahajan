'use client';

import Link from 'next/link';
import Paginator from '@/components/Paginator';

type SpeechItem = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  hasMore: boolean;
  date: string | null;
  eventName: string | null;
};

function formatDate(iso: string | null): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

export default function SpeechesListing({ speeches }: { speeches: SpeechItem[] }) {
  return (
    <Paginator
      items={speeches}
      perPage={12}
      renderItems={(pageSpeeches) =>
        pageSpeeches.length === 0 ? (
          <p style={{ color: '#3a3a3a', textAlign: 'center', padding: '60px 0' }}>No speeches found.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '48px' }}>
            {pageSpeeches.map((speech) => (
              <article
                key={speech.id}
                style={{
                  background: '#fff',
                  borderRadius: '10px',
                  boxShadow: '0 1px 4px rgba(0,15,43,0.07)',
                  borderLeft: '4px solid #9dca00',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    padding: '24px 28px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  {(speech.date || speech.eventName) && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
                      {speech.date && (
                        <p style={{ color: '#9dca00', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
                          {formatDate(speech.date)}
                        </p>
                      )}
                      {speech.date && speech.eventName && (
                        <span style={{ color: '#d1d5db', fontSize: '0.75rem' }}>&bull;</span>
                      )}
                      {speech.eventName && (
                        <p style={{ color: '#6b7280', fontSize: '0.875rem', fontStyle: 'italic', margin: 0 }}>
                          {speech.eventName}
                        </p>
                      )}
                    </div>
                  )}
                  <h2 style={{ margin: 0, lineHeight: 1.3 }}>
                    <Link
                      href={`/speeches/${speech.slug}`}
                      style={{
                        color: '#000f2b',
                        textDecoration: 'none',
                        fontFamily: 'var(--font-sarala)',
                        fontSize: '1.25rem',
                        fontWeight: 700,
                      }}
                    >
                      {speech.title}
                    </Link>
                  </h2>
                  {speech.excerpt && (
                    <p style={{ color: '#4b5563', fontSize: '0.9375rem', lineHeight: 1.7, margin: 0 }}>
                      {speech.excerpt}{speech.hasMore ? '\u2026' : ''}
                    </p>
                  )}
                  <div>
                    <Link
                      href={`/speeches/${speech.slug}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#9dca00',
                        fontFamily: 'var(--font-sarala)',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        textDecoration: 'none',
                        borderBottom: '1px solid #9dca00',
                        paddingBottom: '1px',
                      }}
                    >
                      Read More &rarr;
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )
      }
    />
  );
}
