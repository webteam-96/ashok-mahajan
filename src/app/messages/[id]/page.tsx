import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const msg = await prisma.galleryImage.findUnique({ where: { id: Number(id) } });
  if (!msg) return { title: 'Message Not Found' };
  return {
    title: `${msg.title} – Messages – Rtn. Ashok Mahajan`,
    description: msg.caption
      ? msg.caption.replace(/\s+/g, ' ').trim().slice(0, 160)
      : msg.title,
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function MessageDetailPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const msg = await prisma.galleryImage.findUnique({
    where: { id: Number(id), published: true, album: 'messages' },
  });

  if (!msg) notFound();

  // Format the full OCR text into paragraphs (split on double newlines)
  const fullText = msg.caption && msg.caption.trim() !== (msg.title ?? '').trim()
    ? msg.caption.trim()
    : null;

  const paragraphs = fullText
    ? fullText.split(/\n{2,}/).map((p) => p.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()).filter(Boolean)
    : [];

  return (
    <>
      {/* ── Banner ── */}
      <div className="page-banner" style={{ background: '#000f2b' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 16px' }}>
          <h1
            style={{
              color: '#fff',
              fontFamily: 'var(--font-sarala), Sarala, sans-serif',
              fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
              fontWeight: 700,
              margin: '0 0 12px',
              lineHeight: 1.2,
            }}
          >
            {msg.title}
          </h1>
          <p style={{ color: '#9dca00', fontSize: '0.875rem', margin: 0 }}>
            <Link href="/" style={{ color: '#9dca00', textDecoration: 'none' }}>Home</Link>
            {' '}&rsaquo;{' '}
            <Link href="/messages" style={{ color: '#9dca00', textDecoration: 'none' }}>Messages</Link>
            {' '}&rsaquo; {msg.title}
          </p>
        </div>
      </div>

      {/* ── Content ── */}
      <section style={{ background: '#fff', padding: '72px 0' }}>
        <div style={{ maxWidth: 780, margin: '0 auto', padding: '0 16px' }}>

          {/* Green accent bar */}
          <div
            style={{
              width: '48px',
              height: '4px',
              background: '#9dca00',
              borderRadius: '2px',
              marginBottom: '36px',
            }}
          />

          {/* Full text */}
          {paragraphs.length > 0 ? (
            <div
              style={{
                fontFamily: 'var(--font-pt-sans), PT Sans, sans-serif',
                fontSize: '1.05rem',
                color: '#3a3a3a',
                lineHeight: 1.9,
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}
            >
              {paragraphs.map((para, i) => (
                <p key={i} style={{ margin: 0 }}>
                  {para}
                </p>
              ))}
            </div>
          ) : (
            <p
              style={{
                fontFamily: 'var(--font-pt-sans), PT Sans, sans-serif',
                fontSize: '1.05rem',
                color: '#888',
                fontStyle: 'italic',
              }}
            >
              Full text not available for this message.
            </p>
          )}

          {/* Back link */}
          <div style={{ marginTop: '56px', paddingTop: '32px', borderTop: '1px solid #ebebeb' }}>
            <Link
              href="/messages"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#000f2b',
                fontFamily: 'var(--font-sarala), Sarala, sans-serif',
                fontWeight: 700,
                fontSize: '0.9rem',
                textDecoration: 'none',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back to Messages
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
