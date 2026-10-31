// ============================================================
// DataTable Component
// ============================================================
import React, { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { EmptyState } from './EmptyState.jsx';
import { LoadingState } from './LoadingState.jsx';

/**
 * @param {Array<{key, label, render?, sortable?}>} columns
 * @param {Array<object>} data
 * @param {boolean} loading
 * @param {string} emptyTitle
 * @param {string} emptyDesc
 */
export function DataTable({
  columns,
  data = [],
  loading = false,
  emptyTitle = 'No data found',
  emptyDesc = 'There are no records to display.',
  emptyIcon,
}) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const av = a[sortKey], bv = b[sortKey];
    if (av == null) return 1;
    if (bv == null) return -1;
    const cmp = typeof av === 'string' ? av.localeCompare(bv) : av - bv;
    return sortDir === 'asc' ? cmp : -cmp;
  });

  if (loading) return <LoadingState rows={5} />;

  return (
    <div className="table-wrapper">
      <table className="table" role="table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={col.sortable ? () => handleSort(col.key) : undefined}
                style={col.sortable ? { cursor: 'pointer', userSelect: 'none' } : undefined}
                aria-sort={
                  col.sortable && sortKey === col.key
                    ? sortDir === 'asc' ? 'ascending' : 'descending'
                    : undefined
                }
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  {col.label}
                  {col.sortable && (
                    <span style={{ color: 'var(--text-muted)' }}>
                      {sortKey === col.key ? (
                        sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      ) : (
                        <ChevronsUpDown size={14} />
                      )}
                    </span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                <EmptyState title={emptyTitle} description={emptyDesc} icon={emptyIcon} />
              </td>
            </tr>
          ) : (
            sorted.map((row, i) => (
              <tr key={row.id || i}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
