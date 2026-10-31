// ============================================================
// StatusBadge Component
// ============================================================
import React from 'react';

const STATUS_MAP = {
  // Subscription statuses
  active:    { label: 'Active',    variant: 'success' },
  inactive:  { label: 'Inactive',  variant: 'neutral' },
  cancelled: { label: 'Cancelled', variant: 'error'   },
  trialing:  { label: 'Trial',     variant: 'info'    },
  paused:    { label: 'Paused',    variant: 'warning' },
  pending:   { label: 'Pending',   variant: 'warning' },
  // Invoice / Payment statuses
  paid:      { label: 'Paid',      variant: 'success' },
  unpaid:    { label: 'Unpaid',    variant: 'warning' },
  overdue:   { label: 'Overdue',   variant: 'error'   },
  // Staff / User
  success:   { label: 'Success',   variant: 'success' },
  failed:    { label: 'Failed',    variant: 'error'   },
  refunded:  { label: 'Refunded',  variant: 'info'    },
};

/**
 * @param {string} status - status key from STATUS_MAP
 * @param {string} [label] - override the label
 * @param {boolean} [dot] - show dot indicator
 */
export function StatusBadge({ status, label, dot = true }) {
  const config = STATUS_MAP[status?.toLowerCase()] || { label: status, variant: 'neutral' };
  const displayLabel = label || config.label;

  return (
    <span className={`badge badge-${config.variant}`}>
      {dot && <span className="badge-dot" />}
      {displayLabel}
    </span>
  );
}
