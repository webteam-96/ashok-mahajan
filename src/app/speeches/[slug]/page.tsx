import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export async function generateStaticParams() {
  const speeches = await prisma.speech.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return speeches.map((s) => ({ slug: s.slug }));
}

// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Dynamic metadata
// ---------------------------------------------------------------------------
type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const speech = await prisma.speech.findUnique({ where: { slug } });

  if (!speech) {
    return { title: 'Speech Not Found' };
  }

  const description = speech.content
    .replace(/<[^>]+>/g, '')
    .slice(0, 160);

  return {
    title: speech.title,
    description,
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatDate(date: Date | null | undefined): string {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

const CONTAINER = { maxWidth: '1240px', margin: '0 auto', padding: '0 16px' } as const;

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default async function SpeechDetailPage({ params }: Props) {
  const { slug } = await params;

  const speech = await prisma.speech.findUnique({ where: { slug } });

  if (!speech || !speech.published) {
    notFound();
  }

  const formattedDate = formatDate(speech.date);

  return (
    <>
      {/* PAGE BANNER */}
      <div className="page-banner" style={{ background: '#000f2b' }}>
        <div style={CONTAINER}>
          <h1
            style={{
              color: 'white',
              fontFamily: 'Sarala, sans-serif',
              fontWeight: 700,
              marginBottom: '8px',
              margin: '0 0 8px',
              lineHeight: 1.2,
            }}
          >
            {speech.title}
          </h1>
          <p style={{ color: '#9dca00', fontSize: '0.9rem', margin: 0 }}>
            <Link href="/" style={{ color: '#9dca00', textDecoration: 'none' }}>
              Home
            </Link>{' '}
            &gt;{' '}
            <Link href="/speeches" style={{ color: '#9dca00', textDecoration: 'none' }}>
              Speeches
            </Link>{' '}
            &gt; {speech.title}
          </p>
        </div>
      </div>

      {/* FULL CONTENT */}
      <section style={{ background: '#ffffff', padding: '72px 0' }}>
        <div style={{ ...CONTAINER, maxWidth: '860px' }}>
          {/* Meta row */}
          {(formattedDate || speech.eventName) && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '32px',
                paddingBottom: '20px',
                borderBottom: '2px solid #f0f0f0',
              }}
            >
              {formattedDate && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontFamily: 'PT Sans, sans-serif',
                    fontSize: '0.9rem',
                    color: '#3a3a3a',
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      display: 'inline-block',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#9dca00',
                    }}
                  />
                  {formattedDate}
                </span>
              )}
              {speech.eventName && (
                <span
                  style={{
                    fontFamily: 'PT Sans, sans-serif',
                    fontSize: '0.92rem',
                    color: '#555',
                    fontStyle: 'italic',
                    background: '#f5f5f5',
                    padding: '4px 12px',
                    borderRadius: '4px',
                  }}
                >
                  {speech.eventName}
                </span>
              )}
            </div>
          )}

          {/* Speech body */}
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: speech.content }}
            style={{
              fontFamily: 'PT Sans, sans-serif',
              fontSize: '1.05rem',
              color: '#3a3a3a',
              lineHeight: 1.85,
            }}
          />

          {/* Back link */}
          <div
            style={{
              marginTop: '56px',
              paddingTop: '28px',
              borderTop: '1px solid #ebebeb',
            }}
          >
            <Link
              href="/speeches"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'Sarala, sans-serif',
                fontWeight: 700,
                fontSize: '0.95rem',
                color: '#9dca00',
                textDecoration: 'none',
                borderBottom: '1px solid #9dca00',
                paddingBottom: '2px',
              }}
            >
              &larr; Back to Speeches
            </Link>
          </div>
        </div>
      </section>

      {/* Global prose styles for .blog-content */}
      <style>{`
        .blog-content h1,
        .blog-content h2,
        .blog-content h3,
        .blog-content h4,
        .blog-content h5,
        .blog-content h6 {
          font-family: Sarala, sans-serif;
          color: #000f2b;
          margin-top: 2em;
          margin-bottom: 0.6em;
          line-height: 1.25;
        }
        .blog-content h2 { font-size: 1.5rem; }
        .blog-content h3 { font-size: 1.25rem; }
        .blog-content p { margin: 0 0 1.25em; }
        .blog-content ul,
        .blog-content ol {
          margin: 0 0 1.25em 1.5em;
          padding: 0;
        }
        .blog-content li { margin-bottom: 0.5em; }
        .blog-content a { color: #9dca00; text-decoration: underline; }
        .blog-content blockquote {
          border-left: 4px solid #9dca00;
          margin: 1.5em 0;
          padding: 0.75em 1.25em;
          background: #f8fdf0;
          color: #3a3a3a;
          font-style: italic;
        }
        .blog-content img {
          max-width: 100%;
          border-radius: 8px;
          margin: 1em 0;
        }
        .blog-content strong { color: #000f2b; }
        .blog-content hr {
          border: none;
          border-top: 1px solid #ebebeb;
          margin: 2em 0;
        }
      `}</style>
    </>
  );
}
