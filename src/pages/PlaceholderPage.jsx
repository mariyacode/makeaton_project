// ============================================================
// Placeholder Page – used for pages not yet built
// ============================================================
import React from 'react';
import { Construction } from 'lucide-react';

export default function PlaceholderPage({ title = 'Coming Soon' }) {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">{title}</h1>
          <p className="page-subtitle">This section is under construction</p>
        </div>
      </div>

      <div
        className="card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '5rem 2rem',
          textAlign: 'center',
          gap: '1.25rem',
          background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)',
          border: '2px dashed var(--primary-mid)',
        }}
      >
        <div
          style={{
            width: 72, height: 72, borderRadius: 'var(--radius-lg)',
            background: 'var(--primary-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--primary)',
          }}
        >
          <Construction size={36} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            {title} – In Progress
          </h3>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', maxWidth: '400px' }}>
            This page is being built. The full SubSync system will include all modules as
            described in the project specification.
          </p>
        </div>
        <div className="badge badge-info" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}>
          🚧 Phase 1 – Foundation Complete
        </div>
      </div>
    </div>
  );
}
