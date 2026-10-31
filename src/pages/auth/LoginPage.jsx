// ============================================================
// Login Page
// ============================================================
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, RefreshCcw, BarChart2, Shield, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { InputField } from '../../components/common/InputField.jsx';
import '../../styles/auth.css';

const FEATURES = [
  {
    icon: BarChart2,
    title: 'Powerful Analytics',
    desc: 'Track revenue, subscriptions, and growth in real-time.',
  },
  {
    icon: Zap,
    title: 'Automated Billing',
    desc: 'Invoices and recurring payments handled automatically.',
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    desc: 'Enterprise-grade security to protect your business data.',
  },
];

const DEMO_CREDENTIALS = [
  { role: 'Admin',    email: 'admin@subsync.io',    password: 'admin123' },
  { role: 'Staff',    email: 'staff@subsync.io',    password: 'staff123' },
  { role: 'Customer', email: 'customer@subsync.io', password: 'customer123' },
];

function validate(email, password) {
  const errors = {};
  if (!email.trim()) errors.email = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email address.';
  if (!password) errors.password = 'Password is required.';
  else if (password.length < 6) errors.password = 'Password must be at least 6 characters.';
  return errors;
}

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [errors, setErrors]     = useState({});
  const [apiError, setApiError] = useState('');

  const fillCredentials = (cred) => {
    setEmail(cred.email);
    setPassword(cred.password);
    setErrors({});
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(email, password);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setApiError('');

    try {
      const user = await login(email, password);
      // Role-based redirect
      const path = user.role === 'admin'
        ? '/admin/dashboard'
        : user.role === 'staff'
        ? '/staff/dashboard'
        : '/customer/dashboard';
      navigate(path, { replace: true });
    } catch (err) {
      setApiError(err.message);
    }
  };

  return (
    <div className="auth-page">
      {/* ── Left Panel ── */}
      <div className="auth-left" aria-hidden="true">
        <div className="auth-brand">
          <div className="auth-brand-logo">S</div>
          <span className="auth-brand-name">SubSync</span>
        </div>

        <h1 className="auth-hero-title">
          Subscriptions,<br />
          <span>Simplified.</span>
        </h1>
        <p className="auth-hero-desc">
          Manage customers, plans, invoices, and payments — all from one elegant dashboard built for modern businesses.
        </p>

        <div className="auth-features">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="auth-feature-item">
                <div className="auth-feature-icon">
                  <Icon size={18} />
                </div>
                <div className="auth-feature-text">
                  <div className="auth-feature-title">{f.title}</div>
                  <div className="auth-feature-desc">{f.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="auth-right">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <h2 className="auth-form-title">Welcome back 👋</h2>
            <p className="auth-form-subtitle">Sign in to your SubSync account</p>
          </div>

          {/* Demo Credentials Panel */}
          <div className="demo-panel">
            <p className="demo-panel-title">🚀 Quick Demo Login</p>
            <div className="demo-credentials">
              {DEMO_CREDENTIALS.map((c) => (
                <div
                  key={c.role}
                  className="demo-cred-row"
                  onClick={() => fillCredentials(c)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && fillCredentials(c)}
                  aria-label={`Login as ${c.role}`}
                >
                  <span className="demo-cred-role">{c.role}</span>
                  <span className="demo-cred-info">{c.email} / {c.password}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Error Banner */}
          {apiError && (
            <div className="auth-error-banner" role="alert">
              <Shield size={16} />
              {apiError}
            </div>
          )}

          {/* Login Form */}
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <InputField
              id="login-email"
              label="Email Address"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail size={16} />}
              error={errors.email}
              autoComplete="email"
              required
            />

            <InputField
              id="login-password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock size={16} />}
              error={errors.password}
              autoComplete="current-password"
              required
            />

            <div className="auth-form-footer">
              <label className="checkbox-group">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span className="checkbox-label">Remember me</span>
              </label>
              <button type="button" className="auth-link">Forgot password?</button>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCcw size={16} className="animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign In →'
              )}
            </button>
          </form>

          <p className="auth-register-link">
            New to SubSync?{' '}
            <Link to="/register" className="auth-link">
              Create a free account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
