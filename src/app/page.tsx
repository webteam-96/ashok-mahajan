import Image from 'next/image';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const AWARD_PHOTOS = [
  { src: '/uploads/2025/07/award-jupitar1.jpg',                          alt: 'Jupiter Hospital Award' },
  { src: '/uploads/2025/07/114958.jpg',                                  alt: 'Award Ceremony' },
  { src: '/uploads/2025/07/award-3.jpg',                                 alt: 'Award' },
  { src: '/uploads/2025/07/award-2.jpg',                                 alt: 'Award' },
  { src: '/uploads/2025/07/award-1.jpg',                                 alt: 'Award' },
  { src: '/uploads/2025/03/091a9036-0898-402c-beda-1ec2659d311b.jpg',   alt: 'Award Ceremony' },
];

export default function HomePage() {
  return (
    <>
      {/* ================================================================
          HERO BANNER
          Dark bg · Name left · Portrait photo right · wave bottom
      ================================================================ */}
      <section
        style={{
          background: '#000f2b',
          position: 'relative',
          overflow: 'hidden',
          paddingTop: '80px',
        }}
      >
        {/* Subtle green radial glow */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '-80px',
            left: '-80px',
            width: '480px',
            height: '480px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(157,202,0,0.10) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 16px' }}>
          <div
            className="hero-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              alignItems: 'flex-end',
              gap: '0',
            }}
          >
            {/* LEFT: Name + title */}
            <div className="hero-left" style={{ paddingBottom: '60px', paddingRight: '32px' }}>
              <h1
                style={{
                  fontFamily: 'var(--font-sarala), Sarala, sans-serif',
                  fontSize: 'clamp(2rem, 7vw, 4.2rem)',
                  fontWeight: 700,
                  color: '#ffffff',
                  margin: '0 0 16px',
                  lineHeight: 1.1,
                }}
              >
                Rtn. Ashok Mahajan
              </h1>

              <p
                style={{
                  fontFamily: 'var(--font-sarala), Sarala, sans-serif',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#9dca00',
                  textTransform: 'uppercase',
                  letterSpacing: '0.16em',
                  margin: '0 0 36px',
                }}
              >
                Past R.I. Director &nbsp;·&nbsp; Trustee, The Rotary Foundation
              </p>

              <Link
                href="/about"
                style={{
                  display: 'inline-block',
                  background: '#9dca00',
                  color: '#000f2b',
                  fontFamily: 'var(--font-sarala), Sarala, sans-serif',
                  fontWeight: 700,
                  fontSize: '1rem',
                  padding: '14px 36px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  letterSpacing: '0.02em',
                }}
              >
                Read More
              </Link>
            </div>

            {/* RIGHT: Portrait photo */}
            <div
              style={{
                alignSelf: 'flex-end',
                lineHeight: 0,
                flexShrink: 0,
              }}
            >
              <Image
                src="/uploads/2020/05/pp1.png"
                alt="Rtn. Ashok Mahajan"
                width={340}
                height={420}
                priority
                style={{
                  display: 'block',
                  width: 'clamp(220px, 28vw, 340px)',
                  height: 'auto',
                  objectFit: 'contain',
                  objectPosition: 'bottom',
                }}
              />
            </div>
          </div>
        </div>

        {/* Wave separator */}
        <div style={{ lineHeight: 0, marginBottom: '-2px' }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 80"
            preserveAspectRatio="none"
            style={{ display: 'block', width: '100%', height: '80px' }}
          >
            <path fill="#f5f7f0" d="M0,80 L720,0 L1440,80 Z" />
          </svg>
        </div>
      </section>

      {/* ================================================================
          ABOUT SECTION
          Video left · About text + button right
      ================================================================ */}
      <section style={{ background: '#f5f7f0', padding: '80px 0' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 16px' }}>
          <div
            className="about-cols"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '56px',
              alignItems: 'center',
            }}
          >
            {/* LEFT: YouTube video */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16/9',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,15,43,0.18)',
                background: '#000',
              }}
            >
              <iframe
                src="https://www.youtube.com/embed/NEwFTDyeHlI?rel=0&modestbranding=1"
                title="About Rtn. Ashok Mahajan"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
              />
            </div>

            {/* RIGHT: About text */}
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-sarala), Sarala, sans-serif',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#9dca00',
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  margin: '0 0 10px',
                }}
              >
                Get to Know
              </p>
              <h2
                style={{
                  fontFamily: 'var(--font-sarala), Sarala, sans-serif',
                  fontSize: 'clamp(1.7rem, 3vw, 2.4rem)',
                  fontWeight: 700,
                  color: '#000f2b',
                  margin: '0 0 20px',
                  lineHeight: 1.15,
                }}
              >
                About Ashok Mahajan
              </h2>
              <p
                style={{
                  fontFamily: 'var(--font-pt-sans), PT Sans, sans-serif',
                  fontSize: '1rem',
                  color: '#3a3a3a',
                  lineHeight: 1.85,
                  margin: '0 0 20px',
                }}
              >
                When you have a pure soul and a compassionate heart to serve others, it is
                reflected in your being. Rtn. Ashok Mulkraj Mahajan is one such exemplar.
                Born in the era of independence (23rd July, 1947), Mr. Mahajan always
                remembered the teaching of his parents about universal brotherhood. He
                passed his B.E. (Electrical) from Bombay University securing a merit
                position.
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-pt-sans), PT Sans, sans-serif',
                  fontSize: '1rem',
                  color: '#3a3a3a',
                  lineHeight: 1.85,
                  margin: '0 0 32px',
                }}
              >
                He has risen from an ordinary member to the coveted position of
                R.I. Director (2007-2009) and Trustee of The Rotary Foundation (2009-13)
                by commitment, compassion and consistency.
              </p>
              <Link
                href="/about"
                style={{
                  display: 'inline-block',
                  background: '#000f2b',
                  color: '#ffffff',
                  fontFamily: 'var(--font-sarala), Sarala, sans-serif',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  padding: '13px 32px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  letterSpacing: '0.02em',
                }}
              >
                Read More &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          AWARDS SECTION
          Centered heading · 6 award photos in a row
      ================================================================ */}
      <section style={{ background: '#ffffff', padding: '80px 0' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 16px' }}>
          {/* Heading */}
          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
            <p
              style={{
                fontFamily: 'var(--font-sarala), Sarala, sans-serif',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#9dca00',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                margin: '0 0 10px',
              }}
            >
              Honours &amp; Recognition
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-sarala), Sarala, sans-serif',
                fontSize: 'clamp(1.7rem, 3vw, 2.4rem)',
                fontWeight: 700,
                color: '#000f2b',
                margin: 0,
              }}
            >
              Awards
            </h2>
          </div>

          {/* Award photos grid */}
          <div
            className="award-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: '16px',
            }}
          >
            {AWARD_PHOTOS.map((photo, idx) => (
              <div
                key={idx}
                style={{
                  position: 'relative',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  aspectRatio: '3/4',
                  background: '#f0f0f0',
                  boxShadow: '0 4px 16px rgba(0,15,43,0.10)',
                }}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'top' }}
                  sizes="(max-width: 768px) 50vw, (max-width: 1240px) 16vw, 190px"
                />
              </div>
            ))}
          </div>

          {/* View all link */}
          <div style={{ textAlign: 'center', marginTop: '44px' }}>
            <Link
              href="/awards"
              style={{
                display: 'inline-block',
                background: '#9dca00',
                color: '#000f2b',
                fontFamily: 'var(--font-sarala), Sarala, sans-serif',
                fontWeight: 700,
                fontSize: '0.95rem',
                padding: '13px 32px',
                borderRadius: '6px',
                textDecoration: 'none',
                letterSpacing: '0.02em',
              }}
            >
              View All Awards
            </Link>
          </div>
        </div>
      </section>

      {/* Responsive */}
      <style>{`
        @media (max-width: 700px) {
          .hero-grid { grid-template-columns: 1fr !important; padding-top: 48px !important; }
          .hero-grid > div:last-child { display: none; }
          .hero-left { padding-bottom: 48px !important; padding-right: 0 !important; }
          .about-cols { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 900px) {
          .award-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .award-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </>
  );
}
