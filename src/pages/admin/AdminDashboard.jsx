// ============================================================
// Admin Dashboard Page
// ============================================================
import React, { useState, useEffect } from 'react';
import {
  CreditCard, DollarSign, AlertTriangle, Clock,
  ArrowRight, Users, TrendingUp, CheckCircle,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { StatCard } from '../../components/dashboard/StatCard.jsx';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';
import { PageLoader } from '../../components/common/LoadingState.jsx';
import {
  mockDashboardStats,
  mockInvoices,
  mockSubscriptions,
  mockRevenueData,
  mockSubscriptionGrowth,
} from '../../data/mockData.js';

// Custom Tooltip for charts
function ChartTooltip({ active, payload, label, prefix = '' }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '0.625rem 0.875rem',
        boxShadow: 'var(--shadow-md)',
        fontSize: '0.8125rem',
      }}
    >
      <p style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: <strong>{prefix}{p.value?.toLocaleString()}</strong>
        </p>
      ))}
    </div>
  );
}

// Recent Invoices mini-table
function RecentInvoices({ invoices }) {
  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Invoice #</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Due Date</th>
          </tr>
        </thead>
        <tbody>
          {invoices.slice(0, 6).map((inv) => (
            <tr key={inv.id}>
              <td style={{ fontFamily: 'monospace', fontSize: '0.8125rem', color: 'var(--primary)' }}>
                #{inv.id.toUpperCase()}
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div
                    className="avatar avatar-sm"
                    style={{ background: 'var(--primary-light)', color: 'var(--primary)', fontSize: '0.6875rem' }}
                  >
                    {inv.customerName.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <span>{inv.customerName}</span>
                </div>
              </td>
              <td style={{ fontWeight: 600 }}>
                ${inv.amount.toFixed(2)}
              </td>
              <td><StatusBadge status={inv.status} /></td>
              <td style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>{inv.dueDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Recent Subscriptions mini-list
function RecentActivity({ subscriptions }) {
  const icons = {
    active:    { icon: CheckCircle, color: 'var(--success)', bg: 'var(--success-light)' },
    trialing:  { icon: Clock,       color: 'var(--primary)', bg: 'var(--primary-light)' },
    cancelled: { icon: AlertTriangle,color: 'var(--error)',  bg: 'var(--error-light)'   },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {subscriptions.slice(0, 5).map((sub) => {
        const { icon: Icon, color, bg } = icons[sub.status] || icons.active;
        return (
          <div
            key={sub.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.875rem',
              padding: '0.75rem',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              background: 'var(--bg-card)',
              transition: 'all 0.2s',
            }}
          >
            <div
              style={{
                width: 38, height: 38, borderRadius: 'var(--radius)',
                background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Icon size={18} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-main)', marginBottom: '0.125rem' }}>
                {sub.customerName}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {sub.planName} · ${sub.amount}/mo
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
              <StatusBadge status={sub.status} />
              {sub.nextBillingDate && (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Next: {sub.nextBillingDate}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const stats = mockDashboardStats.admin;

  // Simulate data loading
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back! Here's what's happening today.</p>
        </div>
        <button
          id="export-report-btn"
          className="btn btn-secondary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}
        >
          <TrendingUp size={15} /> Export Report
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-4" style={{ marginBottom: '1.75rem' }}>
        <StatCard
          label="Active Subscriptions"
          value={stats.activeSubscriptions.value}
          icon={<CreditCard size={22} />}
          iconBg="var(--primary-light)"
          iconColor="var(--primary)"
          trend={stats.activeSubscriptions.trend}
        />
        <StatCard
          label="Revenue (Oct)"
          value={stats.revenueReceived.value}
          prefix="$"
          icon={<DollarSign size={22} />}
          iconBg="#DCFCE7"
          iconColor="var(--success)"
          trend={stats.revenueReceived.trend}
        />
        <StatCard
          label="Outstanding Payments"
          value={stats.outstandingPayments.value}
          prefix="$"
          icon={<Clock size={22} />}
          iconBg="#FEF3C7"
          iconColor="var(--warning)"
          trend={stats.outstandingPayments.trend}
        />
        <StatCard
          label="Overdue Invoices"
          value={stats.overdueInvoices.value}
          icon={<AlertTriangle size={22} />}
          iconBg="var(--error-light)"
          iconColor="var(--error)"
          trend={stats.overdueInvoices.trend}
        />
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-2" style={{ marginBottom: '1.75rem' }}>
        {/* Revenue Chart */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Revenue Overview</span>
            <span className="badge badge-info">Last 6 months</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={mockRevenueData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip content={<ChartTooltip prefix="$" />} />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#2563EB"
                strokeWidth={2.5}
                fill="url(#revenueGrad)"
                dot={{ fill: '#2563EB', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Subscription Growth Chart */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Subscription Growth</span>
            <span className="badge badge-success">Trending up</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={mockSubscriptionGrowth} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: '0.8125rem' }} />
              <Bar dataKey="active" name="Active" fill="#2563EB" radius={[4, 4, 0, 0]} />
              <Bar dataKey="new"    name="New"    fill="#16A34A" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cancelled" name="Cancelled" fill="#DC2626" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Bottom Row: Invoices + Activity ── */}
      <div className="grid" style={{ gridTemplateColumns: '3fr 2fr', gap: '1.5rem' }}>
        {/* Recent Invoices */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Recent Invoices
            </h3>
            <button className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              View all <ArrowRight size={14} />
            </button>
          </div>
          <RecentInvoices invoices={mockInvoices} />
        </div>

        {/* Subscription Activity */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Subscription Activity
            </h3>
            <button className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              View all <ArrowRight size={14} />
            </button>
          </div>
          <RecentActivity subscriptions={mockSubscriptions} />
        </div>
      </div>
    </div>
  );
}
