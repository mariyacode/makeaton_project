// ============================================================
// Staff Dashboard Page
// ============================================================
import React, { useState, useEffect } from 'react';
import { Users, CreditCard, FileText, DollarSign, ArrowRight } from 'lucide-react';
import { StatCard } from '../../components/dashboard/StatCard.jsx';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';
import { PageLoader } from '../../components/common/LoadingState.jsx';
import { mockCustomers, mockSubscriptions, mockInvoices } from '../../data/mockData.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function StaffDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <PageLoader />;

  const pendingInvoices = mockInvoices.filter((i) => i.status === 'pending');
  const overdueInvoices = mockInvoices.filter((i) => i.status === 'overdue');

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Staff Dashboard</h1>
          <p className="page-subtitle">Hello, {user?.name?.split(' ')[0]}! Here's your daily overview.</p>
        </div>
      </div>

      <div className="grid grid-cols-4" style={{ marginBottom: '1.75rem' }}>
        <StatCard label="Total Customers" value={mockCustomers.length} icon={<Users size={22} />} iconBg="var(--primary-light)" iconColor="var(--primary)" />
        <StatCard label="Active Subscriptions" value={mockSubscriptions.filter(s => s.status === 'active').length} icon={<CreditCard size={22} />} iconBg="#DCFCE7" iconColor="var(--success)" />
        <StatCard label="Pending Invoices" value={pendingInvoices.length} icon={<FileText size={22} />} iconBg="#FEF3C7" iconColor="var(--warning)" />
        <StatCard label="Overdue Invoices" value={overdueInvoices.length} icon={<DollarSign size={22} />} iconBg="var(--error-light)" iconColor="var(--error)" />
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Recent Customers */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Recent Customers</h3>
            <button className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              View all <ArrowRight size={14} />
            </button>
          </div>
          <div className="table-wrapper">
            <table className="table">
              <thead><tr><th>Name</th><th>Email</th><th>Status</th></tr></thead>
              <tbody>
                {mockCustomers.slice(0, 5).map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div className="avatar avatar-sm" style={{ background: 'var(--primary-light)', color: 'var(--primary)', fontSize: '0.7rem' }}>
                          {c.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        {c.name}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{c.email}</td>
                    <td><StatusBadge status={c.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Invoices */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Attention Needed</h3>
            <button className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              View all <ArrowRight size={14} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {[...overdueInvoices, ...pendingInvoices].slice(0, 5).map((inv) => (
              <div key={inv.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-card)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{inv.customerName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>#{inv.id.toUpperCase()}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontWeight: 600 }}>${inv.amount.toFixed(2)}</span>
                  <StatusBadge status={inv.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
