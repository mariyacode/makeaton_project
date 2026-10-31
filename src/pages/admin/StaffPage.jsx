import React, { useState } from 'react';
import { Edit, UserPlus, UserRoundX } from 'lucide-react';
import { Button } from '../../components/common/Button.jsx';
import { DataTable } from '../../components/common/DataTable.jsx';
import { InputField } from '../../components/common/InputField.jsx';
import { Modal } from '../../components/common/Modal.jsx';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';
import { useCollection } from '../../hooks/useCollection.js';
import { mockStaff } from '../../data/mockData.js';

const EMPTY_STAFF = { name: '', email: '', department: '', role: 'staff', status: 'active' };

function StaffModal({ item, onClose, onSave }) {
  const [form, setForm] = useState(item || EMPTY_STAFF);
  const set = (key) => (event) => setForm((value) => ({ ...value, [key]: event.target.value }));
  return <Modal isOpen onClose={onClose} title={item ? 'Edit staff member' : 'Add staff member'} footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={() => onSave(form)}>Save member</Button></>}>
    <div className="form-stack">
      <InputField id="staff-name" label="Full name" value={form.name} onChange={set('name')} required />
      <InputField id="staff-email" label="Work email" type="email" value={form.email} onChange={set('email')} required />
      <InputField id="staff-department" label="Department" value={form.department} onChange={set('department')} />
      <div className="input-group"><label className="input-label" htmlFor="staff-status">Status</label><select id="staff-status" className="select input" value={form.status} onChange={set('status')}><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
    </div>
  </Modal>;
}

export default function StaffPage() {
  const { items, loading, error, create, update, remove } = useCollection('staff', mockStaff);
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState(null);

  const save = async (form) => {
    if (editing) await update(editing.id, form);
    else await create({ ...form, joinedAt: new Date().toISOString().slice(0, 10) });
    setEditing(null);
    setAdding(false);
  };
  const columns = [
    { key: 'name', label: 'Staff member', sortable: true, render: (value, row) => <div><strong>{value}</strong><div className="table-secondary">{row.email}</div></div> },
    { key: 'department', label: 'Department', sortable: true },
    { key: 'role', label: 'Role', render: (value) => <span className="role-label">{value}</span> },
    { key: 'joinedAt', label: 'Joined', sortable: true },
    { key: 'status', label: 'Status', render: (value) => <StatusBadge status={value} /> },
    { key: 'id', label: 'Actions', render: (_, row) => <div className="table-actions"><button className="btn btn-ghost btn-icon btn-sm" title="Edit staff member" onClick={() => setEditing(row)}><Edit size={15} /></button><button className="btn btn-ghost btn-icon btn-sm danger-action" title="Remove staff member" onClick={() => setRemoving(row)}><UserRoundX size={15} /></button></div> },
  ];

  return <div className="animate-fade-in">
    <div className="page-header"><div className="page-header-left"><h1 className="page-title">Staff management</h1><p className="page-subtitle">{items.filter((member) => member.status === 'active').length} active team members</p></div><Button leftIcon={<UserPlus size={16} />} onClick={() => setAdding(true)}>Add staff</Button></div>
    {error && <div className="inline-error" role="alert">{error}</div>}
    <DataTable columns={columns} data={items} loading={loading} emptyTitle="No staff members" emptyDesc="Add a team member to get started." emptyIcon={UserPlus} />
    {(adding || editing) && <StaffModal key={editing?.id || 'new-staff'} item={editing} onClose={() => { setAdding(false); setEditing(null); }} onSave={save} />}
    <Modal isOpen={!!removing} onClose={() => setRemoving(null)} title="Remove staff member" size="sm" footer={<><Button variant="secondary" onClick={() => setRemoving(null)}>Cancel</Button><Button variant="danger" onClick={async () => { await remove(removing.id); setRemoving(null); }}>Remove</Button></>}><p>Remove <strong>{removing?.name}</strong> from the staff list?</p></Modal>
  </div>;
}