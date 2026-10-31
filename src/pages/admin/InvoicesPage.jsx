// ============================================================
// Invoices Page  (Admin + Staff)
// ============================================================
import React, { useState, useMemo } from 'react';
import { FileText, Search, Eye, Download, Send, CheckCircle, Plus } from 'lucide-react';
import { DataTable }   from '../../components/common/DataTable.jsx';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';
import { Modal }       from '../../components/common/Modal.jsx';
import { Button }      from '../../components/common/Button.jsx';
import { mockInvoices, mockSubscriptions } from '../../data/mockData.js';
import { useCollection } from '../../hooks/useCollection.js';

function InvoiceDetailModal({ open, onClose, invoice, onMarkPaid }) {
  if (!invoice) return null;
  const isPaid = invoice.status === 'paid';

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title={`Invoice #${invoice.id.toUpperCase()}`}
      size="md"
      footer={
        <div style={{ display:'flex', gap:'0.75rem' }}>
          <Button variant="secondary" onClick={onClose}>Close</Button>
          {!isPaid && (
            <Button variant="primary" leftIcon={<CheckCircle size={15}/>} onClick={() => onMarkPaid(invoice)}>
              Mark as Paid
            </Button>
          )}
        </div>
      }
    >
      {/* Invoice Header */}
      <div style={{ background:'var(--bg-subtle)', borderRadius:'var(--radius)', padding:'1.25rem', marginBottom:'1.25rem' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1rem' }}>
          <div>
            <div style={{ fontSize:'1.125rem', fontWeight:700, color:'var(--text-main)', marginBottom:'0.25rem' }}>SubSync</div>
            <div style={{ fontSize:'0.8125rem', color:'var(--text-secondary)' }}>Sync. Subscribe. Simplify.</div>
          </div>
          <StatusBadge status={invoice.status} />
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem', fontSize:'0.8125rem' }}>
          <div><span style={{ color:'var(--text-secondary)' }}>Invoice #:</span> <strong style={{ fontFamily:'monospace' }}>{invoice.id.toUpperCase()}</strong></div>
          <div><span style={{ color:'var(--text-secondary)' }}>Issued:</span> <strong>{invoice.issuedAt}</strong></div>
          <div><span style={{ color:'var(--text-secondary)' }}>Due:</span> <strong style={{ color: invoice.status==='overdue' ? 'var(--error)' : 'inherit' }}>{invoice.dueDate}</strong></div>
          {invoice.paidAt && <div><span style={{ color:'var(--text-secondary)' }}>Paid:</span> <strong style={{ color:'var(--success)' }}>{invoice.paidAt}</strong></div>}
        </div>
      </div>

      {/* Bill to */}
      <div style={{ marginBottom:'1.25rem' }}>
        <div style={{ fontSize:'0.75rem', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em', color:'var(--text-muted)', marginBottom:'0.5rem' }}>Bill To</div>
        <div style={{ fontWeight:600, color:'var(--text-main)' }}>{invoice.customerName}</div>
      </div>

      {/* Line items */}
      <div style={{ borderRadius:'var(--radius)', border:'1px solid var(--border)', overflow:'hidden', marginBottom:'1rem' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.875rem' }}>
          <thead>
            <tr style={{ background:'var(--bg-subtle)' }}>
              <th style={{ padding:'0.625rem 1rem', textAlign:'left', fontWeight:600, color:'var(--text-secondary)', fontSize:'0.75rem', textTransform:'uppercase' }}>Description</th>
              <th style={{ padding:'0.625rem 1rem', textAlign:'right', fontWeight:600, color:'var(--text-secondary)', fontSize:'0.75rem', textTransform:'uppercase' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding:'0.875rem 1rem', color:'var(--text-main)' }}>
                {invoice.planName} Subscription<br/>
                <span style={{ fontSize:'0.8125rem', color:'var(--text-secondary)' }}>Billing period: {invoice.issuedAt} – {invoice.dueDate}</span>
              </td>
              <td style={{ padding:'0.875rem 1rem', textAlign:'right', fontWeight:600 }}>${invoice.amount.toFixed(2)}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr style={{ borderTop:'2px solid var(--border)' }}>
              <td style={{ padding:'0.875rem 1rem', fontWeight:700, fontSize:'1rem' }}>Total Due</td>
              <td style={{ padding:'0.875rem 1rem', textAlign:'right', fontWeight:700, fontSize:'1.125rem', color:'var(--primary)' }}>${invoice.amount.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </Modal>
  );
}

export default function InvoicesPage() {
  const { items: invoices, loading, error, create, update } = useCollection('invoices', mockInvoices);
  const subscriptions = useCollection('subscriptions', mockSubscriptions);
  const [search, setSearch]       = useState('');
  const [statusFilter, setStatus] = useState('all');
  const [viewItem, setViewItem]   = useState(null);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [subscriptionId, setSubscriptionId] = useState('');

  const filtered = useMemo(() => {
    let data = invoices;
    if (statusFilter !== 'all') data = data.filter(i => i.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(i => i.customerName.toLowerCase().includes(q) || i.id.toLowerCase().includes(q));
    }
    return data;
  }, [invoices, search, statusFilter]);

  const handleMarkPaid = async (invoice) => {
    await update(invoice.id, { status:'paid', paidAt: new Date().toISOString().split('T')[0] });
    setViewItem(null);
  };

  const handleGenerate = async () => {
    const subscription = subscriptions.items.find((item) => item.id === subscriptionId);
    if (!subscription) return;
    const issuedAt = new Date().toISOString().slice(0, 10);
    const dueDate = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);
    await create({
      subscriptionId: subscription.id,
      customerId: subscription.customerId,
      customerName: subscription.customerName,
      amount: Number(subscription.amount),
      currency: subscription.currency || 'USD',
      status: 'pending',
      issuedAt,
      dueDate,
      paidAt: null,
      planName: subscription.planName,
    });
    setGenerateOpen(false);
    setSubscriptionId('');
  };

  const totals = {
    paid:    invoices.filter(i=>i.status==='paid').reduce((s,i)=>s+i.amount, 0),
    pending: invoices.filter(i=>i.status==='pending').reduce((s,i)=>s+i.amount, 0),
    overdue: invoices.filter(i=>i.status==='overdue').reduce((s,i)=>s+i.amount, 0),
  };

  const columns = [
    {
      key:'id', label:'Invoice #', sortable:true,
      render:v=><span style={{ fontFamily:'monospace', fontSize:'0.8125rem', color:'var(--primary)', fontWeight:600 }}>{v.toUpperCase()}</span>,
    },
    {
      key:'customerName', label:'Customer', sortable:true,
      render:(v,row)=>(
        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
          <div className="avatar avatar-sm" style={{ background:'var(--primary-light)', color:'var(--primary)', fontSize:'0.7rem' }}>
            {v.split(' ').map(n=>n[0]).join('')}
          </div>
          {v}
        </div>
      ),
    },
    { key:'planName', label:'Plan', render:v=><span style={{ fontSize:'0.875rem', color:'var(--text-secondary)' }}>{v}</span> },
    {
      key:'amount', label:'Amount', sortable:true,
      render:v=><strong>${v.toFixed(2)}</strong>,
    },
    { key:'issuedAt', label:'Issued',  sortable:true, render:v=><span style={{ fontSize:'0.875rem', color:'var(--text-secondary)' }}>{v}</span> },
    {
      key:'dueDate', label:'Due Date', sortable:true,
      render:(v,row)=>(
        <span style={{ fontSize:'0.875rem', color:row.status==='overdue'?'var(--error)':'var(--text-secondary)', fontWeight:row.status==='overdue'?600:400 }}>{v}</span>
      ),
    },
    { key:'status', label:'Status', render:v=><StatusBadge status={v} /> },
    {
      key:'_actions', label:'Actions',
      render:(_,row)=>(
        <div style={{ display:'flex', gap:'0.375rem' }}>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={()=>setViewItem(row)} title="View"><Eye size={15}/></button>
          <button className="btn btn-ghost btn-icon btn-sm" title="Download PDF"><Download size={15}/></button>
          {row.status !== 'paid' && (
            <button className="btn btn-ghost btn-icon btn-sm" title="Send reminder"><Send size={15}/></button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Invoices</h1>
          <p className="page-subtitle">{invoices.length} total invoices</p>
        </div>
        <Button leftIcon={<Plus size={16} />} onClick={() => setGenerateOpen(true)}>Generate invoice</Button>
      </div>

      {error && <div className="alert alert-error" role="alert">{error}</div>}

      {/* Summary cards */}
      <div className="grid grid-cols-3" style={{ marginBottom:'1.5rem' }}>
        {[
          { label:'Total Paid',     amount:totals.paid,    color:'var(--success)', bg:'var(--success-light)', count:invoices.filter(i=>i.status==='paid').length },
          { label:'Pending',        amount:totals.pending, color:'var(--warning)', bg:'#FEF3C7',              count:invoices.filter(i=>i.status==='pending').length },
          { label:'Overdue',        amount:totals.overdue, color:'var(--error)',   bg:'var(--error-light)',   count:invoices.filter(i=>i.status==='overdue').length },
        ].map(s => (
          <div key={s.label} className="card" style={{ borderLeft:`4px solid ${s.color}` }}>
            <div style={{ fontSize:'0.8125rem', fontWeight:500, color:'var(--text-secondary)', marginBottom:'0.5rem' }}>{s.label}</div>
            <div style={{ fontSize:'1.625rem', fontWeight:800, color:'var(--text-main)', lineHeight:1 }}>${s.amount.toFixed(2)}</div>
            <div style={{ fontSize:'0.8125rem', color:'var(--text-secondary)', marginTop:'0.375rem' }}>{s.count} invoice{s.count!==1?'s':''}</div>
          </div>
        ))}
      </div>

      <div className="toolbar">
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon"/>
          <input id="invoice-search" type="search" placeholder="Search invoices…" className="search-input" value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <select className="select" value={statusFilter} onChange={e=>setStatus(e.target.value)} id="invoice-status-filter">
          <option value="all">All Statuses</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
        </select>
        <div className="toolbar-right">
          <span style={{ fontSize:'0.8125rem', color:'var(--text-secondary)' }}>{filtered.length} result{filtered.length!==1?'s':''}</span>
        </div>
      </div>

      <DataTable columns={columns} data={filtered} loading={loading} emptyTitle="No invoices found" emptyDesc="No invoices match your current filters." emptyIcon={FileText} />

      <InvoiceDetailModal open={!!viewItem} onClose={()=>setViewItem(null)} invoice={viewItem} onMarkPaid={handleMarkPaid} />
      <Modal isOpen={generateOpen} onClose={() => setGenerateOpen(false)} title="Generate invoice" footer={<><Button variant="secondary" onClick={() => setGenerateOpen(false)}>Cancel</Button><Button disabled={!subscriptionId} onClick={handleGenerate}>Create invoice</Button></>}>
        <div className="input-group"><label htmlFor="invoice-subscription" className="input-label">Subscription</label><select id="invoice-subscription" className="select input" value={subscriptionId} onChange={(event) => setSubscriptionId(event.target.value)}><option value="">Choose a subscription</option>{subscriptions.items.filter((item) => ['active', 'trialing'].includes(item.status)).map((item) => <option key={item.id} value={item.id}>{item.customerName} · {item.planName} · ${Number(item.amount).toFixed(2)}</option>)}</select></div>
        {subscriptions.error && <div className="inline-error" role="alert">{subscriptions.error}</div>}
      </Modal>
    </div>
  );
}
