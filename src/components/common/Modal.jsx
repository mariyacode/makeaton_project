// ============================================================
// Modal Component
// ============================================================
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

/**
 * @param {boolean} isOpen
 * @param {function} onClose
 * @param {string} title
 * @param {React.ReactNode} children
 * @param {React.ReactNode} footer
 * @param {'sm'|'md'|'lg'} size
 */
export function Modal({ isOpen, onClose, title, children, footer, size = 'md' }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidths = { sm: '380px', md: '520px', lg: '720px' };

  return (
    <div
      className="modal-overlay"
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal" style={{ maxWidth: maxWidths[size] }}>
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">{title}</h2>
          <button
            className="btn btn-ghost btn-icon"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
