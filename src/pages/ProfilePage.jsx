import React, { useEffect, useState } from 'react';
import { CalendarDays, Check, Mail, ShieldCheck, UserRound } from 'lucide-react';
import { Button } from '../components/common/Button.jsx';
import { InputField } from '../components/common/InputField.jsx';
import { StatusBadge } from '../components/common/StatusBadge.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function initialsFor(name = '') {
  return name.split(/\s+/).filter(Boolean).map((part) => part[0]).join('').toUpperCase().slice(0, 2);
}

export default function ProfilePage() {
  const { user, updateProfile, loading } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm({ name: user?.name || '', email: user?.email || '' });
  }, [user]);

  const change = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
    setSaved(false);
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setSaved(false);
    if (!form.name.trim()) return setError('Enter your name.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return setError('Enter a valid email address.');

    try {
      await updateProfile({ name: form.name.trim(), email: form.email.trim() });
      setSaved(true);
    } catch (requestError) {
      setError(requestError.message || 'Profile changes could not be saved.');
    }
  };

  return <div className="animate-fade-in profile-page">
    <div className="page-header">
      <div className="page-header-left"><h1 className="page-title">Your profile</h1><p className="page-subtitle">Personal details and account information</p></div>
    </div>

    <div className="profile-layout">
      <section className="card profile-identity" aria-label="Account summary">
        <div className="profile-avatar">{initialsFor(user?.name)}</div>
        <h2>{user?.name || 'Account holder'}</h2>
        <p>{user?.email}</p>
        <StatusBadge status={user?.status || 'active'} />
        <div className="profile-meta">
          <div><ShieldCheck size={17} /><span>Account role</span><strong>{user?.role || 'member'}</strong></div>
          <div><CalendarDays size={17} /><span>Member since</span><strong>{user?.joinedAt || '—'}</strong></div>
        </div>
      </section>

      <section className="card profile-editor">
        <div className="profile-section-heading"><div><h2>Personal information</h2><p>Update the details associated with your account.</p></div><UserRound size={20} /></div>
        {error && <div className="inline-error" role="alert">{error}</div>}
        {saved && <div className="inline-success" role="status">Profile updated successfully.</div>}
        <form className="profile-form" onSubmit={submit}>
          <InputField id="profile-name" label="Full name" value={form.name} onChange={change('name')} leftIcon={<UserRound size={16} />} autoComplete="name" required />
          <InputField id="profile-email" label="Email address" type="email" value={form.email} onChange={change('email')} leftIcon={<Mail size={16} />} autoComplete="email" required />
          <div className="profile-form-footer"><span className="table-secondary">Your role is managed by your organization.</span><Button type="submit" loading={loading} leftIcon={saved ? <Check size={16} /> : null}>Save changes</Button></div>
        </form>
      </section>
    </div>
  </div>;
}