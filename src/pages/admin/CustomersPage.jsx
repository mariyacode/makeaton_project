// ============================================================
// Customers Page  (Admin + Staff)
// ============================================================
import React, { useState, useMemo } from 'react';
import { UserPlus, Search, Filter, Mail, Phone, Building2, Trash2, Eye, Edit } from 'lucide-react';
import { DataTable }   from '../../components/common/DataTable.jsx';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';
import { Modal }       from '../../components/common/Modal.jsx';
import { Button }      from '../../components/common/Button.jsx';
import { InputField }  from '../../components/common/InputField.jsx';
import { EmptyState }  from '../../components/common/EmptyState.jsx';
import { mockCustomers } from '../../data/mockData.js';
import { useCollection } from '../../hooks/useCollection.js';

/* ── Avatar helper ── */
function CustomerAvatar({ name }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const colors = ['#2563EB','#7C3AED','#059669','#DC2626','#F59E0B','#0891B2'];
  const color  = colors[name.charCodeAt(0) % colors.length];
  return (
    <div className="avatar" style={{ background: color, fontSize:'0.75rem', flexShrink:0 }}>
      {initials}
    </div>
  );
}

/* ── Add / Edit Customer Modal ── */
function CustomerModal({ open, onClose, initial = null, onSave }) {
  const blank = { name:'', email:'', phone:'', company:'', status:'active' };
  const [form, setForm] = useState(initial || blank);
  const [errors, setErrors] = useState({});

  // Reset when modal opens
  React.useEffect(() => {
    setForm(initial || blank);
    setErrors({});
  }, [open, initial]);

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name  = 'Name is required.';
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email.';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave(form);
    onClose();
  };

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title={initial ? 'Edit Customer' : 'Add New Customer'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary"   onClick={handleSave}>{initial ? 'Save Changes' : 'Add Customer'}</Button>
        </>
      }
    >
      <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
        <InputField id="c-name"    label="Full Name"    value={form.name}    onChange={set('name')}    error={errors.name}    leftIcon={<UserPlus size={15}/>} placeholder="Jane Doe" />
        <InputField id="c-email"   label="Email"        value={form.email}   onChange={set('email')}   error={errors.email}   leftIcon={<Mail size={15}/>}    placeholder="jane@company.com" />
        <InputField id="c-phone"   label="Phone"        value={form.phone}   onChange={set('phone')}   leftIcon={<Phone size={15}/>}   placeholder="+1 555-0100" />
        <InputField id="c-company" label="Company"      value={form.company} onChange={set('company')} leftIcon={<Building2 size={15}/>} placeholder="Acme Corp" />
        <div className="input-group">
          <label className="input-label">Status</label>
          <select className="select input" value={form.status} onChange={set('status')} style={{ width:'100%' }}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
    </Modal>
  );
}

/* ── Delete Confirm Modal ── */
function DeleteModal({ open, onClose, customer, onConfirm }) {
  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Delete Customer"
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="danger"    onClick={() => { onConfirm(); onClose(); }}>Delete</Button>
        </>
      }
    >
      <p style={{ color:'var(--text-secondary)', lineHeight:1.6 }}>
        Are you sure you want to delete <strong style={{ color:'var(--text-main)' }}>{customer?.name}</strong>?
        This action cannot be undone.
      </p>
    </Modal>
  );
}

/* ── View Customer Modal ── */
function ViewModal({ open, onClose, customer }) {
  if (!customer) return null;
  const Row = ({ label, value }) => (
    <div style={{ display:'flex', justifyContent:'space-between', padding:'0.625rem 0', borderBottom:'1px solid var(--border)' }}>
      <span style={{ fontSize:'0.8125rem', color:'var(--text-secondary)', fontWeight:500 }}>{label}</span>
      <span style={{ fontSize:'0.8125rem', color:'var(--text-main)', fontWeight:500 }}>{value || '—'}</span>
    </div>
  );
  return (
    <Modal isOpen={open} onClose={onClose} title="Customer Details" footer={<Button variant="secondary" onClick={onClose}>Close</Button>}>
      <div style={{ display:'flex', alignItems:'center', gap:'1rem', padding:'0.5rem 0 1.25rem', borderBottom:'1px solid var(--border)', marginBottom:'0.5rem' }}>
        <CustomerAvatar name={customer.name} />
        <div>
          <div style={{ fontWeight:700, fontSize:'1.05rem', color:'var(--text-main)' }}>{customer.name}</div>
          <div style={{ fontSize:'0.875rem', color:'var(--text-secondary)' }}>{customer.email}</div>
        </div>
        <div style={{ marginLeft:'auto' }}><StatusBadge status={customer.status} /></div>
      </div>
      <Row label="Phone"      value={customer.phone} />
      <Row label="Company"    value={customer.company} />
      <Row label="Joined"     value={customer.joinedAt} />
      <Row label="Total Spent" value={customer.totalSpent ? `$${customer.totalSpent.toFixed(2)}` : '—'} />
    </Modal>
  );
}

/* ══════════════════════════════
   Main Page Component
   ══════════════════════════════ */
export default function CustomersPage() {
  const { items: customers, loading, error, create, update, remove } = useCollection('customers', mockCustomers);
  const [search,    setSearch]    = useState('');
  const [statusFilter, setStatus] = useState('all');
  const [addOpen,   setAddOpen]   = useState(false);
  const [editItem,  setEditItem]  = useState(null);
  const [viewItem,  setViewItem]  = useState(null);
  const [deleteItem,setDeleteItem]= useState(null);

  /* ── Filtered data ── */
  const filtered = useMemo(() => {
    let data = customers;
    if (statusFilter !== 'all') data = data.filter(c => c.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.company || '').toLowerCase().includes(q)
      );
    }
    return data;
  }, [customers, search, statusFilter]);

  /* ── Handlers ── */
  const handleAdd = async (form) => {
    await create({ ...form, joinedAt: new Date().toISOString().split('T')[0], totalSpent: 0 });
  };
  const handleEdit = async (form) => {
    await update(editItem.id, form);
    setEditItem(null);
  };
  const handleDelete = async () => {
    await remove(deleteItem.id);
    setDeleteItem(null);
  };

  /* ── Table columns ── */
  const columns = [
    {
      key:   'name',
      label: 'Customer',
      sortable: true,
      render: (_, row) => (
        <div className="customer-cell">
          <CustomerAvatar name={row.name} />
          <div className="customer-cell-info">
            <span className="customer-cell-name">{row.name}</span>
            <span className="customer-cell-email">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      key:   'company',
      label: 'Company',
      sortable: true,
      render: v => <span style={{ color:'var(--text-secondary)', fontSize:'0.875rem' }}>{v || '—'}</span>,
    },
    {
      key:   'phone',
      label: 'Phone',
      render: v => <span style={{ color:'var(--text-secondary)', fontSize:'0.875rem' }}>{v || '—'}</span>,
    },
    {
      key:   'totalSpent',
      label: 'Total Spent',
      sortable: true,
      render: v => <strong>${(v || 0).toFixed(2)}</strong>,
    },
    {
      key:   'joinedAt',
      label: 'Joined',
      sortable: true,
      render: v => <span style={{ color:'var(--text-secondary)', fontSize:'0.875rem' }}>{v}</span>,
    },
    {
      key:   'status',
      label: 'Status',
      render: v => <StatusBadge status={v} />,
    },
    {
      key:   'id',
      label: 'Actions',
      render: (_, row) => (
        <div style={{ display:'flex', gap:'0.375rem' }}>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setViewItem(row)}   title="View">   <Eye    size={15}/></button>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setEditItem(row)}   title="Edit">   <Edit   size={15}/></button>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setDeleteItem(row)} title="Delete" style={{ color:'var(--error)' }}><Trash2 size={15}/></button>
        </div>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Customers</h1>
          <p className="page-subtitle">{customers.length} total customers · {customers.filter(c=>c.status==='active').length} active</p>
        </div>
        <Button id="add-customer-btn" variant="primary" leftIcon={<UserPlus size={16}/>} onClick={() => setAddOpen(true)}>
          Add Customer
        </Button>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            id="customer-search"
            type="search"
            placeholder="Search customers…"
            className="search-input"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
          <Filter size={15} style={{ color:'var(--text-muted)' }}/>
          <select className="select" value={statusFilter} onChange={e => setStatus(e.target.value)} id="customer-status-filter">
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="toolbar-right">
          <span style={{ fontSize:'0.8125rem', color:'var(--text-secondary)' }}>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {error && <div className="alert alert-error" role="alert">{error}</div>}

      {/* Table */}
      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        emptyTitle="No customers found"
        emptyDesc="Try adjusting your search or filters, or add a new customer."
        emptyIcon={UserPlus}
      />

      {/* Modals */}
      <CustomerModal open={addOpen}        onClose={() => setAddOpen(false)} onSave={handleAdd} />
      <CustomerModal open={!!editItem}     onClose={() => setEditItem(null)} initial={editItem} onSave={handleEdit} />
      <ViewModal     open={!!viewItem}     onClose={() => setViewItem(null)} customer={viewItem} />
      <DeleteModal   open={!!deleteItem}   onClose={() => setDeleteItem(null)} customer={deleteItem} onConfirm={handleDelete} />
    </div>
  );
}
