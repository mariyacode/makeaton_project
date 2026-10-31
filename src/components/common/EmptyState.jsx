// ============================================================
// EmptyState Component
// ============================================================
import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from './Button.jsx';

export function EmptyState({
  icon,
  title = 'Nothing here yet',
  description = 'Get started by creating your first record.',
  action,
  actionLabel,
  onAction,
}) {
  const Icon = icon || Inbox;
  return (
    <div className="empty-state animate-fade-in">
      <div className="empty-state-icon">
        <Icon size={28} />
      </div>
      <p className="empty-state-title">{title}</p>
      <p className="empty-state-desc">{description}</p>
      {onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel || 'Get Started'}
        </Button>
      )}
    </div>
  );
}
