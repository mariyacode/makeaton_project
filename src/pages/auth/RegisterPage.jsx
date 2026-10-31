// ============================================================
// Registration Page
// ============================================================
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { InputField } from '../../components/common/InputField.jsx';
import '../../styles/auth.css';

function validate({ fullName, email, password, confirmPassword }) {
  const errors = {};
  if (!fullName.trim()) errors.fullName = 'Full name is required.';
  else if (fullName.trim().length < 2) errors.fullName = 'Name must be at least 2 characters.';

  if (!email.trim()) errors.email = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email address.';

  if (!password) errors.password = 'Password is required.';
  else if (password.length < 8) errors.password = 'Password must be at least 8 characters.';
  else if (!/[A-Z]/.test(password)) errors.password = 'Include at least one uppercase letter.';
  else if (!/[0-9]/.test(password)) errors.password = 'Include at least one number.';

  if (!confirmPassword) errors.confirmPassword = 'Please confirm your password.';
  else if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match.';

  return errors;
}

function PasswordStrength({ password }) {
  const checks = [
    { label: '8+ characters', ok: password.length >= 8 },
    { label: 'Uppercase letter', ok: /[A-Z]/.test(password) },
    { label: 'Number', ok: /[0-9]/.test(password) },
    { label: 'Special character', ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const strength = score <= 1 ? 'weak' : score === 2 ? 'fair' : score === 3 ? 'good' : 'strong';
  const colors = { weak: '#DC2626', fair: '#F59E0B', good: '#2563EB', strong: '#16A34A' };

  if (!password) return null;

  return (
    <div style={{ marginTop: '0.375rem' }}>
      <div style={{ display: 'flex', gap: '4px', marginBottom: '0.375rem' }}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              flex: 1, height: '4px', borderRadius: '2px',
              background: i <= score ? colors[strength] : 'var(--border)',
              transition: 'background 0.2s',
            }}
          />
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
        {checks.map((c) => (
          <span
            key={c.label}
            style={{
              fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '3px',
              color: c.ok ? 'var(--success)' : 'var(--text-muted)',
            }}
          >
            {c.ok ? <CheckCircle size={11} /> : <AlertCircle size={11} />}
            {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setApiError('');

    try {
      await register(form);
      navigate('/customer/dashboard', { replace: true });
    } catch (err) {
      setApiError(err.message);
    }
  };

  return (
    <div className="auth-page">
      {/* Left panel */}
      <div className="auth-left" aria-hidden="true">
        <div className="auth-brand">
          <div className="auth-brand-logo">S</div>
          <span className="auth-brand-name">SubSync</span>
        </div>

        <h1 className="auth-hero-title">
          Start your<br />
          <span>free journey</span><br />
          today.
        </h1>
        <p className="auth-hero-desc">
          Join thousands of businesses using SubSync to manage subscriptions, automate billing, and grow revenue effortlessly.
        </p>

        <div className="auth-features">
          {[
            { emoji: '⚡', title: 'Up in minutes', desc: 'Simple onboarding — no technical setup required.' },
            { emoji: '💳', title: 'Flexible Plans', desc: 'Choose monthly or annual billing that fits your needs.' },
            { emoji: '📊', title: 'Real-time Insights', desc: 'Know your subscription status at a glance.' },
          ].map((f) => (
            <div key={f.title} className="auth-feature-item">
              <div className="auth-feature-icon" style={{ fontSize: '1.25rem' }}>{f.emoji}</div>
              <div className="auth-feature-text">
                <div className="auth-feature-title">{f.title}</div>
                <div className="auth-feature-desc">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-right">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <h2 className="auth-form-title">Create your account</h2>
            <p className="auth-form-subtitle">Get started with SubSync today — it's free</p>
          </div>

          {apiError && (
            <div className="auth-error-banner" role="alert" style={{ marginBottom: '1rem' }}>
              <AlertCircle size={16} />
              {apiError}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <InputField
              id="reg-fullname"
              label="Full Name"
              type="text"
              placeholder="John Doe"
              value={form.fullName}
              onChange={set('fullName')}
              leftIcon={<User size={16} />}
              error={errors.fullName}
              autoComplete="name"
              required
            />

            <InputField
              id="reg-email"
              label="Email Address"
              type="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={set('email')}
              leftIcon={<Mail size={16} />}
              error={errors.email}
              autoComplete="email"
              required
            />

            <div>
              <InputField
                id="reg-password"
                label="Password"
                type="password"
                placeholder="Create a strong password"
                value={form.password}
                onChange={set('password')}
                leftIcon={<Lock size={16} />}
                error={errors.password}
                autoComplete="new-password"
                required
              />
              <PasswordStrength password={form.password} />
            </div>

            <InputField
              id="reg-confirm-password"
              label="Confirm Password"
              type="password"
              placeholder="Repeat your password"
              value={form.confirmPassword}
              onChange={set('confirmPassword')}
              leftIcon={<Lock size={16} />}
              error={errors.confirmPassword}
              autoComplete="new-password"
              required
            />

            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '-0.25rem' }}>
              By creating an account, you agree to our{' '}
              <button type="button" className="auth-link" style={{ fontSize: '0.8125rem' }}>Terms of Service</button>
              {' '}and{' '}
              <button type="button" className="auth-link" style={{ fontSize: '0.8125rem' }}>Privacy Policy</button>.
            </p>

            <button
              id="register-submit-btn"
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? 'Creating account…' : 'Create Account →'}
            </button>
          </form>

          <p className="auth-register-link">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
