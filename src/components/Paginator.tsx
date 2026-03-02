'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';

interface PaginatorProps<T> {
  items: T[];
  perPage: number;
  renderItems: (pageItems: T[]) => ReactNode;
}

function pageNumbers(page: number, totalPages: number): (number | '...')[] {
  const nums: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) nums.push(i);
  } else {
    const start = Math.max(2, page - 2);
    const end = Math.min(totalPages - 1, page + 2);
    nums.push(1);
    if (start > 2) nums.push('...');
    for (let i = start; i <= end; i++) nums.push(i);
    if (end < totalPages - 1) nums.push('...');
    nums.push(totalPages);
  }
  return nums;
}

const btnBase: React.CSSProperties = {
  padding: '8px 14px',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  color: '#3a3a3a',
  background: '#fff',
  fontSize: '0.875rem',
  cursor: 'pointer',
  fontFamily: 'inherit',
  lineHeight: 1,
};

export default function Paginator<T,>({ items, perPage, renderItems }: PaginatorProps<T>) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(items.length / perPage);
  const pageItems = items.slice((page - 1) * perPage, page * perPage);

  const go = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {renderItems(pageItems)}
      {totalPages > 1 && (
        <nav
          aria-label="Pagination"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '6px',
            flexWrap: 'wrap',
            marginTop: '48px',
          }}
        >
          {page > 1 && (
            <button onClick={() => go(page - 1)} style={btnBase}>
              &larr; Prev
            </button>
          )}

          {pageNumbers(page, totalPages).map((p, idx) =>
            p === '...' ? (
              <span key={`e${idx}`} style={{ padding: '8px 4px', color: '#9ca3af', fontSize: '0.875rem' }}>
                &hellip;
              </span>
            ) : (
              <button
                key={p}
                onClick={() => go(p as number)}
                aria-current={p === page ? 'page' : undefined}
                style={{
                  ...btnBase,
                  border: p === page ? 'none' : '1px solid #d1d5db',
                  background: p === page ? '#9dca00' : '#fff',
                  color: p === page ? '#000f2b' : '#3a3a3a',
                  fontWeight: p === page ? 700 : 400,
                }}
              >
                {p}
              </button>
            )
          )}

          {page < totalPages && (
            <button onClick={() => go(page + 1)} style={btnBase}>
              Next &rarr;
            </button>
          )}
        </nav>
      )}
    </>
  );
}
