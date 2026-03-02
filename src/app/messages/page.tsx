import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import MessagesListing from './_components/MessagesListing';

export const metadata: Metadata = {
  title: 'Messages – Rtn. Ashok Mahajan',
  description:
    'Inspirational messages and reflections from Rtn. Ashok Mahajan, Past R.I. Director and Trustee of The Rotary Foundation.',
};

export default async function MessagesPage() {
  const raw = await prisma.galleryImage.findMany({
    where: { published: true, album: 'messages' },
    orderBy: { order: 'asc' },
    select: { id: true, title: true, caption: true },
  });

  const messages = raw.map((m) => {
    const hasOcr = !!m.caption && m.caption.trim() !== (m.title ?? '').trim() && m.caption.trim().length > 10;
    const raw_text = hasOcr ? m.caption!.replace(/\s+/g, ' ').trim() : '';
    return {
      id: m.id,
      title: m.title,
      excerpt: raw_text.slice(0, 260),
      hasMore: raw_text.length > 260,
    };
  });

  return (
    <>
      {/* ── Banner ── */}
      <div className="page-banner" style={{ background: '#000f2b' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 16px' }}>
          <h1
            style={{
              color: 'white',
              fontFamily: 'var(--font-sarala)',
              fontWeight: 700,
              marginBottom: '8px',
            }}
          >
            Messages
          </h1>
          <p style={{ color: '#9dca00', fontSize: '0.875rem' }}>
            <Link href="/" style={{ color: '#9dca00', textDecoration: 'none' }}>Home</Link>
            {' '}&rsaquo; Messages
          </p>
        </div>
      </div>

      {/* ── Listing ── */}
      <section style={{ background: '#f8f9fa', padding: '60px 0' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 16px' }}>
          <MessagesListing messages={messages} />
        </div>
      </section>
    </>
  );
}
