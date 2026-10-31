// ============================================================
// StatCard Component
// ============================================================
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * @param {string} label - card label
 * @param {string|number} value - main value
 * @param {React.ReactNode} icon - icon element
 * @param {string} iconBg - CSS color for icon background
 * @param {string} iconColor - CSS color for icon
 * @param {number} [trend] - positive = up, negative = down, 0 = neutral
 * @param {string} [trendLabel] - description next to trend
 * @param {string} [prefix] - prefix for value (e.g. '$')
 * @param {string} [suffix] - suffix for value
 */
export function StatCard({
  label,
  value,
  icon,
  iconBg = 'var(--primary-light)',
  iconColor = 'var(--primary)',
  trend,
  trendLabel = 'vs last month',
  prefix = '',
  suffix = '',
}) {
  const hasTrend = trend !== undefined && trend !== null;
  const trendDir = trend > 0 ? 'up' : trend < 0 ? 'down' : 'neutral';
  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;

  return (
    <div className="stat-card animate-fade-in">
      <div className="stat-card-header">
        <span className="stat-card-label">{label}</span>
        {icon && (
          <div
            className="stat-card-icon"
            style={{ background: iconBg, color: iconColor }}
          >
            {icon}
          </div>
        )}
      </div>
      <div className="stat-card-value">
        {prefix}
        {typeof value === 'number' && prefix === '$'
          ? value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          : value?.toLocaleString?.() ?? value}
        {suffix}
      </div>
      {hasTrend && (
        <div className={`stat-card-trend ${trendDir}`}>
          <TrendIcon size={14} />
          <span>
            {trend > 0 ? '+' : ''}{trend}% {trendLabel}
          </span>
        </div>
      )}
    </div>
  );
}
