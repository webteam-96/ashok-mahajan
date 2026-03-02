import Image from 'next/image';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Covid Lifeline',
  description: 'Covid Lifeline initiative by Rtn. Ashok Mahajan.',
};

export default function CovidLifelinePage() {
  return (
    <>
      {/* Banner */}
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
            Covid Lifeline
          </h1>
          <p style={{ color: '#9dca00', fontSize: '0.875rem' }}>
            <a href="/" style={{ color: '#9dca00', textDecoration: 'none' }}>Home</a>
            {' '}&rsaquo; Covid Lifeline
          </p>
        </div>
      </div>

      {/* Photo */}
      <section style={{ background: '#fff', padding: '60px 0' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 16px', display: 'flex', justifyContent: 'center' }}>
          <Image
            src="/covid-lifeline.jpg"
            alt="Covid Lifeline"
            width={280}
            height={280}
            style={{ borderRadius: '8px', boxShadow: '0 4px 24px rgba(0,15,43,0.12)', width: '280px', height: 'auto' }}
            priority
          />
        </div>
      </section>
    </>
  );
}
