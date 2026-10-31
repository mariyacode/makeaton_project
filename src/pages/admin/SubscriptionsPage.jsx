// ============================================================
// Subscriptions Page  (Admin + Staff)
// ============================================================
import React, { useState, useMemo } from 'react';
import { CreditCard, Search, Filter, Eye, XCircle, RefreshCw } from 'lucide-react';
import { DataTable }       from '../../components/common/DataTable.jsx';
import { StatusBadge }     from '../../components/common/StatusBadge.jsx';
import { Modal }           from '../../components/common/Modal.jsx';
import { Button }          from '../../components/common/Button.jsx';
import { EmptyState }      from '../../components/common/EmptyState.jsx';
import { mockSubscriptions, mockPlans } from '../../data/mockData.js';

function ViewSubModal({ open, onClose, sub }) {
  if (!sub) return null;
  const Row = ({ label, value, children }) => (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.625rem 0', borderBottom:'1px solid var(--border)' }}>
      <span style={{ fontSize:'0.8125rem', color:'var(--text-secondary)', fontWeight:500 }}>{label}</span>
      <span style={{ fontSize:'0.8125rem', color:'var(--text-main)', fontWeight:500, textAlign:'right' }}>{children || value || '—'}</span>
    </div>
  );
  return (
    <Modal isOpen={open} onClose={onClose} title="Subscription Details" footer={<Button variant="secondary" onClick={onClose}>Close</Button>}>
      <div style={{ display:'flex', alignItems:'center', gap:'1rem', padding:'0.5rem 0 1.25rem', borderBottom:'1px solid var(--border)', marginBottom:'0.5rem' }}>
        <div className="avatar" style={{ background:'var(--primary-light)', color:'var(--primary)', width:44, height:44, fontSize:'0.875rem' }}>
          {sub.customerName.split(' ').map(n=>n[0]).join('')}
        </div>
        <div>
          <div style={{ fontWeight:700, fontSize:'1.05rem' }}>{sub.customerName}</div>
          <div style={{ fontSize:'0.875rem', color:'var(--text-secondary)', fontFamily:'monospace' }}>{sub.id.toUpperCase()}</div>
        </div>
        <div style={{ marginLeft:'auto' }}><StatusBadge status={sub.status} /></div>
      </div>
      <Row label="Plan"          value={sub.planName} />
      <Row label="Billing Cycle" value={sub.billingCycle === 'monthly' ? 'Monthly' : 'Annual'} />
      <Row label="Amount"        value={`$${sub.amount.toFixed(2)} / ${sub.billingCycle}`} />
      <Row label="Start Date"    value={sub.startDate} />
      <Row label="Next Billing"  value={sub.nextBillingDate || 'N/A'} />
    </Modal>
  );
}

function CancelModal({ open, onClose, sub, onConfirm }) {
  return (
    <Modal isOpen={open} onClose={onClose} title="Cancel Subscription" size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Keep Subscription</Button>
          <Button variant="danger"    onClick={() => { onConfirm(); onClose(); }}>Cancel Subscription</Button>
        </>
      }
    >
      <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
        <p style={{ color:'var(--text-secondary)', lineHeight:1.6 }}>
          Are you sure you want to cancel the <strong style={{ color:'var(--text-main)' }}>{sub?.planName}</strong> subscription
          for <strong style={{ color:'var(--text-main)' }}>{sub?.customerName}</strong>?
        </p>
        <div style={{ background:'var(--error-light)', borderRadius:'var(--radius)', padding:'0.875rem', fontSize:'0.875rem', color:'var(--error)' }}>
          ⚠️ The customer will lose access at the end of the current billing period.
        </div>
      </div>
    </Modal>
  );
}

export default function SubscriptionsPage() {
  const [subs, setSubs]         = useState(mockSubscriptions);
  const [search, setSearch]     = useState('');
  const [statusFilter, setStatus] = useState('all');
  const [planFilter, setPlan]   = useState('all');
  const [viewItem, setViewItem] = useState(null);
  const [cancelItem, setCancel] = useState(null);

  const filtered = useMemo(() => {
    let data = subs;
    if (statusFilter !== 'all') data = data.filter(s => s.status === statusFilter);
    if (planFilter   !== 'all') data = data.filter(s => s.planId === planFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(s => s.customerName.toLowerCase().includes(q) || s.planName.toLowerCase().includes(q));
    }
    return data;
  }, [subs, search, statusFilter, planFilter]);

  const handleCancel = () => {
    setSubs(prev => prev.map(s => s.id === cancelItem.id ? { ...s, status:'cancelled', nextBillingDate:null } : s));
    setCancel(null);
  };

  const handleReactivate = (sub) => {
    const plan = mockPlans.find(p => p.id === sub.planId);
    setSubs(prev => prev.map(s => s.id === sub.id ? { ...s, status:'active', nextBillingDate: '2026-12-01' } : s));
  };

  const columns = [
    {
      key:'customerName', label:'Customer', sortable:true,
      render:(v,row) => (
        <div style={{ display:'flex', alignItems:'center', gap:'0.625rem' }}>
          <div className="avatar avatar-sm" style={{ background:'var(--primary-light)', color:'var(--primary)', fontSize:'0.7rem' }}>
            {v.split(' ').map(n=>n[0]).join('')}
          </div>
          <span style={{ fontWeight:500 }}>{v}</span>
        </div>
      ),
    },
    {
      key:'planName', label:'Plan', sortable:true,
      render:(v,row) => (
        <div>
          <div style={{ fontWeight:600, fontSize:'0.875rem' }}>{v}</div>
          <div style={{ fontSize:'0.75rem', color:'var(--text-secondary)', textTransform:'capitalize' }}>{row.billingCycle}</div>
        </div>
      ),
    },
    {
      key:'amount', label:'Amount', sortable:true,
      render: v => <strong>${v.toFixed(2)}/mo</strong>,
    },
    { key:'startDate',       label:'Start Date',    sortable:true, render:v=><span style={{ fontSize:'0.875rem', color:'var(--text-secondary)' }}>{v}</span> },
    { key:'nextBillingDate', label:'Next Billing',  render:v=><span style={{ fontSize:'0.875rem', color:'var(--text-secondary)' }}>{v||'—'}</span> },
    { key:'status',          label:'Status',        render:v=><StatusBadge status={v} /> },
    {
      key:'id', label:'Actions',
      render:(_,row) => (
        <div style={{ display:'flex', gap:'0.375rem' }}>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setViewItem(row)} title="View details"><Eye size={15}/></button>
          {row.status === 'active' || row.status === 'trialing' ? (
            <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setCancel(row)} title="Cancel" style={{ color:'var(--error)' }}><XCircle size={15}/></button>
          ) : row.status === 'cancelled' ? (
            <button className="btn btn-ghost btn-icon btn-sm" onClick={() => handleReactivate(row)} title="Reactivate" style={{ color:'var(--success)' }}><RefreshCw size={15}/></button>
          ) : null}
        </div>
      ),
    },
  ];

  const counts = {
    active:    subs.filter(s=>s.status==='active').length,
    trialing:  subs.filter(s=>s.status==='trialing').length,
    cancelled: subs.filter(s=>s.status==='cancelled').length,
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Subscriptions</h1>
          <p className="page-subtitle">
            {counts.active} active · {counts.trialing} trialing · {counts.cancelled} cancelled
          </p>
        </div>
      </div>

      {/* Summary pills */}
      <div style={{ display:'flex', gap:'0.75rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
        {[
          { label:'Active',    count:counts.active,    color:'var(--success)',  bg:'var(--success-light)',  key:'active'    },
          { label:'Trialing',  count:counts.trialing,  color:'var(--primary)',  bg:'var(--primary-light)',  key:'trialing'  },
          { label:'Cancelled', count:counts.cancelled, color:'var(--error)',    bg:'var(--error-light)',    key:'cancelled' },
        ].map(s => (
          <button
            key={s.key}
            onClick={() => setStatus(statusFilter === s.key ? 'all' : s.key)}
            style={{
              padding:'0.5rem 1rem', borderRadius:'var(--radius-full)',
              border:`1.5px solid ${statusFilter===s.key ? s.color : 'var(--border)'}`,
              background: statusFilter===s.key ? s.bg : 'var(--bg-card)',
              color: statusFilter===s.key ? s.color : 'var(--text-secondary)',
              fontWeight:600, fontSize:'0.875rem', cursor:'pointer', transition:'all 0.2s',
              display:'flex', alignItems:'center', gap:'0.5rem',
            }}
          >
            <span style={{ fontWeight:800 }}>{s.count}</span> {s.label}
          </button>
        ))}
      </div>

      <div className="toolbar">
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon"/>
          <input id="sub-search" type="search" placeholder="Search customer or plan…" className="search-input" value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <select className="select" value={planFilter} onChange={e=>setPlan(e.target.value)} id="sub-plan-filter">
          <option value="all">All Plans</option>
          {mockPlans.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <div className="toolbar-right">
          <span style={{ fontSize:'0.8125rem', color:'var(--text-secondary)' }}>{filtered.length} result{filtered.length!==1?'s':''}</span>
        </div>
      </div>

      <DataTable columns={columns} data={filtered} emptyTitle="No subscriptions found" emptyDesc="Try adjusting your filters." emptyIcon={CreditCard} />

      <ViewSubModal   open={!!viewItem}  onClose={() => setViewItem(null)} sub={viewItem} />
      <CancelModal    open={!!cancelItem} onClose={() => setCancel(null)}  sub={cancelItem} onConfirm={handleCancel} />
    </div>
  );
}
