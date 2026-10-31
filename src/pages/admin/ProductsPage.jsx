import React, { useState } from 'react';
import { Edit, PackagePlus, Trash2 } from 'lucide-react';
import { Button } from '../../components/common/Button.jsx';
import { DataTable } from '../../components/common/DataTable.jsx';
import { InputField } from '../../components/common/InputField.jsx';
import { Modal } from '../../components/common/Modal.jsx';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';
import { useCollection } from '../../hooks/useCollection.js';
import { mockProducts } from '../../data/mockData.js';

const EMPTY_PRODUCT = { name: '', description: '', category: '', price: '', status: 'active' };

function ProductModal({ item, onClose, onSave }) {
  const [form, setForm] = useState(item || EMPTY_PRODUCT);
  const set = (key) => (event) => setForm((value) => ({ ...value, [key]: event.target.value }));

  return (
    <Modal isOpen onClose={onClose} title={item ? 'Edit product' : 'Add product'} footer={
      <><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={() => onSave({ ...form, price: Number(form.price) })}>Save product</Button></>
    }>
      <div className="form-stack">
        <InputField id="product-name" label="Product name" value={form.name} onChange={set('name')} required />
        <InputField id="product-category" label="Category" value={form.category} onChange={set('category')} placeholder="SaaS" />
        <InputField id="product-price" label="Base price (USD)" type="number" min="0" step="0.01" value={form.price} onChange={set('price')} required />
        <div className="input-group"><label className="input-label" htmlFor="product-description">Description</label><textarea id="product-description" className="input" rows="3" value={form.description} onChange={set('description')} /></div>
        <div className="input-group"><label className="input-label" htmlFor="product-status">Status</label><select id="product-status" className="select input" value={form.status} onChange={set('status')}><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
      </div>
    </Modal>
  );
}

export default function ProductsPage() {
  const { items, loading, error, create, update, remove } = useCollection('products', mockProducts);
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState(null);

  const save = async (form) => {
    if (editing) await update(editing.id, form);
    else await create(form);
    setEditing(null);
    setAdding(false);
  };

  const columns = [
    { key: 'name', label: 'Product', sortable: true, render: (value, row) => <div><strong>{value}</strong><div className="table-secondary">{row.description}</div></div> },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'price', label: 'Base price', sortable: true, render: (value) => `$${Number(value).toFixed(2)}` },
    { key: 'status', label: 'Status', render: (value) => <StatusBadge status={value} /> },
    { key: 'id', label: 'Actions', render: (_, row) => <div className="table-actions"><button className="btn btn-ghost btn-icon btn-sm" title="Edit product" onClick={() => setEditing(row)}><Edit size={15} /></button><button className="btn btn-ghost btn-icon btn-sm danger-action" title="Delete product" onClick={() => setRemoving(row)}><Trash2 size={15} /></button></div> },
  ];

  return <div className="animate-fade-in">
    <div className="page-header"><div className="page-header-left"><h1 className="page-title">Products</h1><p className="page-subtitle">{items.length} catalog products</p></div><Button leftIcon={<PackagePlus size={16} />} onClick={() => setAdding(true)}>Add product</Button></div>
    {error && <div className="inline-error" role="alert">{error}</div>}
    <DataTable columns={columns} data={items} loading={loading} emptyTitle="No products yet" emptyDesc="Add a product to build your subscription catalog." emptyIcon={PackagePlus} />
    {(adding || editing) && <ProductModal key={editing?.id || 'new-product'} item={editing} onClose={() => { setAdding(false); setEditing(null); }} onSave={save} />}
    <Modal isOpen={!!removing} onClose={() => setRemoving(null)} title="Delete product" size="sm" footer={<><Button variant="secondary" onClick={() => setRemoving(null)}>Keep product</Button><Button variant="danger" onClick={async () => { await remove(removing.id); setRemoving(null); }}>Delete</Button></>}><p>Delete <strong>{removing?.name}</strong> from the catalog?</p></Modal>
  </div>;
}