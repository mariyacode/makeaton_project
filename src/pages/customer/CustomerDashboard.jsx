// ============================================================
// Customer Dashboard Page
// ============================================================
import React, { useState, useEffect } from 'react';
import { CreditCard, FileText, DollarSign, Calendar, ArrowRight, Star } from 'lucide-react';
import { StatCard } from '../../components/dashboard/StatCard.jsx';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';
import { PageLoader } from '../../components/common/LoadingState.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { mockSubscriptions, mockInvoices } from '../../data/mockData.js';
import { useNavigate } from 'react-router-dom';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Find this customer's data (using customer@subsync.io as demo)
  const mySubscriptions = mockSubscriptions.filter((s) => s.customerId === 'c1');
  const myInvoices = mockInvoices.filter((i) => i.customerId === 'c1');
  const activeSub = mySubscriptions.find((s) => s.status === 'active');
  const pendingInvoices = myInvoices.filter((i) => i.status === 'pending');
  const totalPaid = myInvoices.filter((i) => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">My Dashboard</h1>
          <p className="page-subtitle">
            Welcome back, {user?.name?.split(' ')[0]}! Manage your subscriptions here.
          </p>
        </div>
        <button
          id="browse-plans-btn"
          className="btn btn-primary btn-sm"
          onClick={() => navigate('/customer/plans')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}
        >
          <Star size={15} /> Browse Plans
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4" style={{ marginBottom: '1.75rem' }}>
        <StatCard
          label="Active Subscriptions"
          value={mySubscriptions.filter((s) => s.status === 'active').length}
          icon={<CreditCard size={22} />}
          iconBg="var(--primary-light)"
          iconColor="var(--primary)"
        />
        <StatCard
          label="Total Invoices"
          value={myInvoices.length}
          icon={<FileText size={22} />}
          iconBg="#FEF3C7"
          iconColor="var(--warning)"
        />
        <StatCard
          label="Pending Invoices"
          value={pendingInvoices.length}
          icon={<Calendar size={22} />}
          iconBg="var(--error-light)"
          iconColor="var(--error)"
        />
        <StatCard
          label="Total Paid"
          value={totalPaid}
          prefix="$"
          icon={<DollarSign size={22} />}
          iconBg="#DCFCE7"
          iconColor="var(--success)"
        />
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Active Subscription Card */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Current Subscription</span>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/customer/subscriptions')} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              Manage <ArrowRight size={14} />
            </button>
          </div>
          {activeSub ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div
                style={{
                  background: 'linear-gradient(135deg, #1e40af 0%, #2563EB 100%)',
                  borderRadius: 'var(--radius)',
                  padding: '1.25rem',
                  color: '#fff',
                }}
              >
                <div style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '0.25rem' }}>Current Plan</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{activeSub.planName}</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '0.5rem' }}>
                  ${activeSub.amount}<span style={{ fontSize: '0.875rem', opacity: 0.8 }}>/month</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.125rem' }}>Next Billing</div>
                  <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{activeSub.nextBillingDate}</div>
                </div>
                <StatusBadge status={activeSub.status} />
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
              No active subscription.{' '}
              <button className="auth-link" onClick={() => navigate('/customer/plans')}>
                Browse plans
              </button>
            </div>
          )}
        </div>

        {/* Recent Invoices */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Recent Invoices</span>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/customer/invoices')} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              View all <ArrowRight size={14} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {myInvoices.slice(0, 4).map((inv) => (
              <div
                key={inv.id}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, fontFamily: 'monospace', color: 'var(--primary)' }}>
                    #{inv.id.toUpperCase()}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{inv.issuedAt}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>${inv.amount.toFixed(2)}</span>
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
