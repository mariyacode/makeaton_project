// ============================================================
// LoadingState Component
// ============================================================
import React from 'react';

export function LoadingState({ rows = 3, cols = 4 }) {
  return (
    <div style={{ padding: '1rem' }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: '1rem',
            padding: '0.875rem 1.25rem',
            borderBottom: i < rows - 1 ? '1px solid var(--border-light)' : 'none',
          }}
        >
          {Array.from({ length: cols }).map((__, j) => (
            <div
              key={j}
              className="skeleton"
              style={{
                height: '16px',
                borderRadius: 'var(--radius-sm)',
                opacity: j === 0 ? 1 : 0.6,
                width: j === cols - 1 ? '60%' : '100%',
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="loading-spinner" style={{ minHeight: '60vh' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <div className="spinner" />
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Loading…</p>
      </div>
    </div>
  );
}
