// ============================================================
// Subscription Plans Page  (Admin – manage plans)
// ============================================================
import React, { useState } from 'react';
import { Plus, Star, Edit, Trash2, Check, ToggleLeft, ToggleRight } from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';
import { Modal }       from '../../components/common/Modal.jsx';
import { Button }      from '../../components/common/Button.jsx';
import { InputField }  from '../../components/common/InputField.jsx';
import { mockPlans, mockProducts } from '../../data/mockData.js';
import { useCollection } from '../../hooks/useCollection.js';

const CYCLE_LABELS = { monthly:'Monthly', annual:'Annual', weekly:'Weekly' };

function PlanCard({ plan, onEdit, onDelete, onToggle }) {
  const accent = plan.color || 'var(--primary)';
  return (
    <div
      className="card"
      style={{
        borderTop: `4px solid ${accent}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        position: 'relative',
        opacity: plan.status === 'inactive' ? 0.7 : 1,
        transition: 'all 0.2s',
      }}
    >
      {plan.popular && (
        <div
          style={{
            position: 'absolute', top: '1rem', right: '1rem',
            background: accent, color: '#fff',
            fontSize: '0.6875rem', fontWeight: 700,
            padding: '0.2rem 0.625rem', borderRadius: 'var(--radius-full)',
            display: 'flex', alignItems: 'center', gap: '0.25rem',
          }}
        >
          <Star size={11} fill="currentColor" /> Popular
        </div>
      )}

      <div>
        <div style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
          {plan.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
          <span style={{ fontSize: '2rem', fontWeight: 800, color: accent }}>${plan.price}</span>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>/ {CYCLE_LABELS[plan.billingCycle]}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span className="badge badge-neutral">{CYCLE_LABELS[plan.billingCycle]}</span>
        {plan.trialDays > 0 && (
          <span className="badge badge-info">{plan.trialDays}-day trial</span>
        )}
        <StatusBadge status={plan.status} />
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
          Features
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          {plan.features.map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem' }}>
              <Check size={14} style={{ color: 'var(--success)', flexShrink: 0 }} />
              {f}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
        <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => onEdit(plan)}>
          <Edit size={14} /> Edit
        </button>
        <button
          className="btn btn-ghost btn-icon btn-sm"
          onClick={() => onToggle(plan)}
          title={plan.status === 'active' ? 'Deactivate' : 'Activate'}
          style={{ color: plan.status === 'active' ? 'var(--success)' : 'var(--text-muted)' }}
        >
          {plan.status === 'active' ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
        </button>
        <button
          className="btn btn-ghost btn-icon btn-sm"
          onClick={() => onDelete(plan)}
          style={{ color: 'var(--error)' }}
          title="Delete plan"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

function PlanModal({ open, onClose, initial, onSave, products }) {
  const blank = { name: '', productId: '', price: '', currency: 'USD', billingCycle: 'monthly', trialDays: 0, features: '', status: 'active', popular: false, color: '#2563EB' };
  const [form, setForm] = useState(blank);

  React.useEffect(() => {
    if (initial) {
      setForm({ ...initial, features: initial.features.join('\n'), price: String(initial.price) });
    } else {
      setForm(blank);
    }
  }, [open, initial]);

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSave = () => {
    const featuresArr = form.features.split('\n').map(f => f.trim()).filter(Boolean);
    onSave({ ...form, price: parseFloat(form.price) || 0, trialDays: parseInt(form.trialDays) || 0, features: featuresArr });
    onClose();
  };

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title={initial ? 'Edit Plan' : 'Create New Plan'}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary"   onClick={handleSave}>{initial ? 'Save Changes' : 'Create Plan'}</Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <InputField id="plan-name"  label="Plan Name"   value={form.name}  onChange={set('name')}  placeholder="Starter" />
          <InputField id="plan-price" label="Price (USD)" value={form.price} onChange={set('price')} type="number" placeholder="9.99" />
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="plan-product">Product</label>
          <select id="plan-product" className="select input" value={form.productId} onChange={set('productId')}>
            <option value="">Select a product</option>
            {products.filter((product) => product.status === 'active').map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="input-group">
            <label className="input-label">Billing Cycle</label>
            <select className="select input" value={form.billingCycle} onChange={set('billingCycle')}>
              <option value="monthly">Monthly</option>
              <option value="annual">Annual</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
          <InputField id="plan-trial" label="Trial Days" value={form.trialDays} onChange={set('trialDays')} type="number" placeholder="0" />
        </div>
        <div className="input-group">
          <label className="input-label">Features (one per line)</label>
          <textarea
            className="input"
            rows={5}
            value={form.features}
            onChange={set('features')}
            placeholder={"5 Users\n10GB Storage\nEmail Support"}
            style={{ resize: 'vertical', fontFamily: 'inherit' }}
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="input-group">
            <label className="input-label">Status</label>
            <select className="select input" value={form.status} onChange={set('status')}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="input-group">
            <label className="input-label">Accent Color</label>
            <input type="color" value={form.color} onChange={set('color')} className="input" style={{ height: '40px', padding: '0.25rem' }} />
          </div>
        </div>
        <label className="checkbox-group">
          <input type="checkbox" className="checkbox" checked={form.popular} onChange={e => setForm(p => ({ ...p, popular: e.target.checked }))} />
          <span className="checkbox-label">Mark as Popular plan</span>
        </label>
      </div>
    </Modal>
  );
}

export default function PlansPage() {
  const { items: plans, loading, error, create, update, remove } = useCollection('plans', mockPlans);
  const products = useCollection('products', mockProducts);
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem]= useState(null);
  const [deleteItem, setDelete]= useState(null);

  const handleSave = async (form) => {
    if (editItem) {
      await update(editItem.id, form);
      setEditItem(null);
    } else {
      await create(form);
    }
  };

  const handleToggle = async (plan) => {
    await update(plan.id, { status: plan.status === 'active' ? 'inactive' : 'active' });
  };

  const handleDelete = async () => {
    await remove(deleteItem.id);
    setDelete(null);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Subscription Plans</h1>
          <p className="page-subtitle">{plans.filter(p=>p.status==='active').length} active plans</p>
        </div>
        <Button id="add-plan-btn" variant="primary" leftIcon={<Plus size={16}/>} onClick={() => setAddOpen(true)}>
          Create Plan
        </Button>
      </div>

      {error && <div className="alert alert-error" role="alert">{error}</div>}

      <div className="grid grid-cols-3" style={{ marginBottom: '1.5rem' }}>
        {loading ? <div className="card">Loading plans...</div> : plans.map(plan => (
          <PlanCard
            key={plan.id}
            plan={plan}
            onEdit={setEditItem}
            onDelete={setDelete}
            onToggle={handleToggle}
          />
        ))}
      </div>

      <PlanModal open={addOpen || !!editItem} onClose={() => { setAddOpen(false); setEditItem(null); }} initial={editItem} onSave={handleSave} products={products.items} />

      <Modal
        isOpen={!!deleteItem}
        onClose={() => setDelete(null)}
        title="Delete Plan"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDelete(null)}>Cancel</Button>
            <Button variant="danger"    onClick={handleDelete}>Delete</Button>
          </>
        }
      >
        <p style={{ color: 'var(--text-secondary)' }}>
          Delete plan <strong style={{ color: 'var(--text-main)' }}>{deleteItem?.name}</strong>?
          Existing subscriptions will not be affected.
        </p>
      </Modal>
    </div>
  );
}
