'use client';

import Link from 'next/link';
import Paginator from '@/components/Paginator';

type MessageItem = {
  id: number;
  title: string | null;
  excerpt: string;
  hasMore: boolean;
};

export default function MessagesListing({ messages }: { messages: MessageItem[] }) {
  return (
    <Paginator
      items={messages}
      perPage={12}
      renderItems={(pageMessages) =>
        pageMessages.length === 0 ? (
          <p style={{ color: '#3a3a3a', textAlign: 'center', padding: '60px 0' }}>No messages found.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '48px' }}>
            {pageMessages.map((msg) => (
              <article
                key={msg.id}
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
                  <h2 style={{ margin: 0, lineHeight: 1.3 }}>
                    <Link
                      href={`/messages/${msg.id}`}
                      style={{
                        color: '#000f2b',
                        textDecoration: 'none',
                        fontFamily: 'var(--font-sarala)',
                        fontSize: '1.25rem',
                        fontWeight: 700,
                      }}
                    >
                      {msg.title}
                    </Link>
                  </h2>
                  {msg.excerpt && (
                    <p style={{ color: '#4b5563', fontSize: '0.9375rem', lineHeight: 1.7, margin: 0 }}>
                      {msg.excerpt}{msg.hasMore ? '\u2026' : ''}
                    </p>
                  )}
                  <div>
                    <Link
                      href={`/messages/${msg.id}`}
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
