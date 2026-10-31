// ============================================================
// Payments Page  (Admin + Staff)
// ============================================================
import React, { useState, useMemo } from 'react';
import { DollarSign, Search, Eye, Download } from 'lucide-react';
import { DataTable }   from '../../components/common/DataTable.jsx';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';
import { Modal }       from '../../components/common/Modal.jsx';
import { Button }      from '../../components/common/Button.jsx';
import { mockPayments } from '../../data/mockData.js';
import { useCollection } from '../../hooks/useCollection.js';

const METHOD_ICONS = {
  'Credit Card':   '💳',
  'Bank Transfer': '🏦',
  'PayPal':        '🅿️',
  'Crypto':        '🪙',
};

function PaymentDetailModal({ open, onClose, payment }) {
  if (!payment) return null;
  const Row = ({ label, value }) => (
    <div style={{ display:'flex', justifyContent:'space-between', padding:'0.625rem 0', borderBottom:'1px solid var(--border)' }}>
      <span style={{ fontSize:'0.8125rem', color:'var(--text-secondary)' }}>{label}</span>
      <span style={{ fontSize:'0.8125rem', color:'var(--text-main)', fontWeight:500 }}>{value || '—'}</span>
    </div>
  );
  return (
    <Modal isOpen={open} onClose={onClose} title="Payment Details" footer={<Button variant="secondary" onClick={onClose}>Close</Button>}>
      <div style={{ display:'flex', flexDirection:'column', gap:'0' }}>
        <Row label="Transaction ID" value={payment.reference} />
        <Row label="Invoice"        value={`#${payment.invoiceId.toUpperCase()}`} />
        <Row label="Customer"       value={payment.customerName} />
        <Row label="Amount"         value={`$${payment.amount.toFixed(2)} ${payment.currency}`} />
        <Row label="Method"         value={`${METHOD_ICONS[payment.method] || ''} ${payment.method}`} />
        <Row label="Status"         value={<StatusBadge status={payment.status} />} />
        <Row label="Processed"      value={payment.processedAt} />
      </div>
    </Modal>
  );
}

export default function PaymentsPage() {
  const { items: payments, loading, error } = useCollection('payments', mockPayments);
  const [search, setSearch]   = useState('');
  const [methodFilter, setMethod] = useState('all');
  const [viewItem, setViewItem]   = useState(null);

  const filtered = useMemo(() => {
    let data = payments;
    if (methodFilter !== 'all') data = data.filter(p => p.method === methodFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(p =>
        p.customerName.toLowerCase().includes(q) ||
        p.reference.toLowerCase().includes(q)
      );
    }
    return data;
  }, [payments, search, methodFilter]);

  const totalRevenue = payments.filter(p=>p.status==='success').reduce((s,p)=>s+p.amount, 0);

  const columns = [
    {
      key:'reference', label:'Transaction ID', sortable:true,
      render:v=><span style={{ fontFamily:'monospace', fontSize:'0.8125rem', color:'var(--primary)', fontWeight:600 }}>{v}</span>,
    },
    {
      key:'customerName', label:'Customer', sortable:true,
      render:(v)=>(
        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
          <div className="avatar avatar-sm" style={{ background:'var(--primary-light)', color:'var(--primary)', fontSize:'0.7rem' }}>
            {v.split(' ').map(n=>n[0]).join('')}
          </div>
          {v}
        </div>
      ),
    },
    {
      key:'invoiceId', label:'Invoice',
      render:v=><span style={{ fontFamily:'monospace', fontSize:'0.8125rem', color:'var(--text-secondary)' }}>#{v.toUpperCase()}</span>,
    },
    {
      key:'amount', label:'Amount', sortable:true,
      render:v=><strong style={{ color:'var(--success)', fontSize:'0.9375rem' }}>${v.toFixed(2)}</strong>,
    },
    {
      key:'method', label:'Method',
      render:v=>(
        <span style={{ display:'flex', alignItems:'center', gap:'0.375rem', fontSize:'0.875rem', color:'var(--text-secondary)' }}>
          {METHOD_ICONS[v] || '💰'} {v}
        </span>
      ),
    },
    { key:'status', label:'Status', render:v=><StatusBadge status={v} /> },
    { key:'processedAt', label:'Date', sortable:true, render:v=><span style={{ fontSize:'0.875rem', color:'var(--text-secondary)' }}>{v}</span> },
    {
      key:'id', label:'Actions',
      render:(_,row)=>(
        <div style={{ display:'flex', gap:'0.375rem' }}>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={()=>setViewItem(row)} title="View"><Eye size={15}/></button>
          <button className="btn btn-ghost btn-icon btn-sm" title="Download receipt"><Download size={15}/></button>
        </div>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Payments</h1>
          <p className="page-subtitle">{payments.length} transactions recorded</p>
        </div>
      </div>

      {/* Revenue Summary */}
      <div className="grid grid-cols-3" style={{ marginBottom:'1.5rem' }}>
        <div className="card" style={{ borderLeft:'4px solid var(--success)' }}>
          <div style={{ fontSize:'0.8125rem', fontWeight:500, color:'var(--text-secondary)', marginBottom:'0.5rem' }}>Total Revenue</div>
          <div style={{ fontSize:'1.75rem', fontWeight:800, color:'var(--text-main)' }}>${totalRevenue.toFixed(2)}</div>
          <div style={{ fontSize:'0.8125rem', color:'var(--text-secondary)', marginTop:'0.375rem' }}>{payments.filter(p=>p.status==='success').length} successful payments</div>
        </div>
        <div className="card" style={{ borderLeft:'4px solid var(--primary)' }}>
          <div style={{ fontSize:'0.8125rem', fontWeight:500, color:'var(--text-secondary)', marginBottom:'0.5rem' }}>This Month</div>
          <div style={{ fontSize:'1.75rem', fontWeight:800, color:'var(--text-main)' }}>${payments.filter((payment) => payment.status === 'success' && payment.processedAt?.slice(0, 7) === new Date().toISOString().slice(0, 7)).reduce((sum, payment) => sum + Number(payment.amount), 0).toFixed(2)}</div>
          <div style={{ fontSize:'0.8125rem', color:'var(--text-secondary)', marginTop:'0.375rem' }}>Successful payments this month</div>
        </div>
        <div className="card" style={{ borderLeft:'4px solid var(--warning)' }}>
          <div style={{ fontSize:'0.8125rem', fontWeight:500, color:'var(--text-secondary)', marginBottom:'0.5rem' }}>Avg Transaction</div>
          <div style={{ fontSize:'1.75rem', fontWeight:800, color:'var(--text-main)' }}>${(totalRevenue / Math.max(1, payments.filter(p=>p.status==='success').length)).toFixed(2)}</div>
          <div style={{ fontSize:'0.8125rem', color:'var(--text-secondary)', marginTop:'0.375rem' }}>per transaction</div>
        </div>
      </div>

      <div className="toolbar">
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon"/>
          <input id="payment-search" type="search" placeholder="Search payments…" className="search-input" value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <select className="select" value={methodFilter} onChange={e=>setMethod(e.target.value)} id="payment-method-filter">
          <option value="all">All Methods</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="PayPal">PayPal</option>
        </select>
        <div className="toolbar-right">
          <span style={{ fontSize:'0.8125rem', color:'var(--text-secondary)' }}>{filtered.length} result{filtered.length!==1?'s':''}</span>
        </div>
      </div>

      {error && <div className="inline-error" role="alert">{error}</div>}
      <DataTable columns={columns} data={filtered} loading={loading} emptyTitle="No payments found" emptyDesc="No payment records match your search." emptyIcon={DollarSign} />

      <PaymentDetailModal open={!!viewItem} onClose={()=>setViewItem(null)} payment={viewItem} />
    </div>
  );
}
