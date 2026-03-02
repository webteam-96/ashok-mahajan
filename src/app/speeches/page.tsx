import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import SpeechesListing from './_components/SpeechesListing';

export const metadata: Metadata = {
  title: 'Speeches – Rtn. Ashok Mahajan',
  description:
    'Read speeches and addresses delivered by Rtn. Ashok Mahajan at Rotary events and international forums.',
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

export default async function SpeechesPage() {
  const raw = await prisma.speech.findMany({
    where: { published: true },
    orderBy: { id: 'asc' },
    select: { id: true, slug: true, title: true, content: true, date: true, eventName: true },
  });

  const speeches = raw.map(({ content, date, ...s }) => {
    const plain = stripHtml(content);
    return {
      ...s,
      excerpt: plain.slice(0, 260),
      hasMore: plain.length > 260,
      date: date ? date.toISOString() : null,
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
            Speeches
          </h1>
          <p style={{ color: '#9dca00', fontSize: '0.875rem' }}>
            <Link href="/" style={{ color: '#9dca00', textDecoration: 'none' }}>Home</Link>
            {' '}&rsaquo; Speeches
          </p>
        </div>
      </div>

      {/* ── Listing ── */}
      <section style={{ background: '#f8f9fa', padding: '60px 0' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 16px' }}>
          <SpeechesListing speeches={speeches} />
        </div>
      </section>
    </>
  );
}
