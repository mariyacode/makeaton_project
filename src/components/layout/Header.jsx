// ============================================================
// Header Component
// ============================================================
import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Bell, Search, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

// Build readable page titles from the pathname
function getPageTitle(pathname) {
  const segments = pathname.split('/').filter(Boolean);
  const last = segments[segments.length - 1];
  if (!last) return 'Dashboard';
  return last
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
}

// Notification mock data
const NOTIFICATIONS = [
  { id: 1, title: 'Overdue Invoice', desc: 'Invoice #inv003 is 25 days overdue', time: '2h ago', read: false },
  { id: 2, title: 'New Subscription', desc: 'David Lee started a trial', time: '4h ago', read: false },
  { id: 3, title: 'Payment Received', desc: 'Emily Watson paid $199.99', time: '1d ago', read: true },
];

export function Header({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const pageTitle = getPageTitle(pathname);
  const unreadCount = NOTIFICATIONS.filter((n) => !n.read).length;

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleBasedPath = user?.role === 'admin' ? '/admin' : user?.role === 'staff' ? '/staff' : '/customer';

  return (
    <header className="header" role="banner">
      <div className="header-left">
        {/* Mobile menu toggle */}
        <button
          id="mobile-menu-btn"
          className="header-menu-btn"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>

        {/* Breadcrumb */}
        <nav className="header-breadcrumb" aria-label="Breadcrumb">
          <span className="breadcrumb-item">SubSync</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-item current">{pageTitle}</span>
        </nav>
      </div>

      <div className="header-right">
        {/* Notifications */}
        <div className="dropdown" ref={notifRef}>
          <button
            id="notifications-btn"
            className="header-icon-btn"
            onClick={() => setShowNotif((v) => !v)}
            aria-label={`Notifications (${unreadCount} unread)`}
            aria-haspopup="true"
            aria-expanded={showNotif}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="notification-badge" aria-hidden="true" />
            )}
          </button>

          {showNotif && (
            <div
              className="dropdown-menu"
              style={{ minWidth: '320px', right: 0 }}
              role="menu"
            >
              <div style={{ padding: '0.875rem 1rem 0.5rem', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <span
                    className="badge badge-info"
                    style={{ marginLeft: '0.5rem' }}
                  >
                    {unreadCount} new
                  </span>
                )}
              </div>
              {NOTIFICATIONS.map((n) => (
                <div
                  key={n.id}
                  className="dropdown-item"
                  role="menuitem"
                  style={{
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '0.125rem',
                    background: !n.read ? 'var(--primary-light)' : undefined,
                    borderLeft: !n.read ? '3px solid var(--primary)' : '3px solid transparent',
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-main)' }}>
                    {n.title}
                  </span>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{n.desc}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{n.time}</span>
                </div>
              ))}
              <div className="dropdown-item" style={{ justifyContent: 'center', color: 'var(--primary)', fontSize: '0.8125rem', fontWeight: 500 }}>
                View all notifications
              </div>
            </div>
          )}
        </div>

        {/* User profile dropdown */}
        <div className="dropdown" ref={profileRef}>
          <button
            id="user-profile-btn"
            className="header-user-btn"
            onClick={() => setShowProfile((v) => !v)}
            aria-haspopup="true"
            aria-expanded={showProfile}
            aria-label="User menu"
          >
            <div
              className="avatar avatar-sm"
              style={{ background: 'var(--primary)', fontSize: '0.75rem' }}
            >
              {user?.initials || user?.name?.[0] || '?'}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div className="header-user-name">{user?.name?.split(' ')[0] || 'User'}</div>
              <div className="header-user-role" style={{ textTransform: 'capitalize' }}>{user?.role}</div>
            </div>
            <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
          </button>

          {showProfile && (
            <div className="dropdown-menu" role="menu">
              <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>{user?.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{user?.email}</div>
              </div>
              <div
                className="dropdown-item"
                role="menuitem"
                onClick={() => { navigate(`${roleBasedPath}/profile`); setShowProfile(false); }}
              >
                <User size={15} /> Profile
              </div>
              <div
                className="dropdown-item"
                role="menuitem"
                onClick={() => { navigate(`${roleBasedPath}/settings`); setShowProfile(false); }}
              >
                <Settings size={15} /> Settings
              </div>
              <div className="dropdown-divider" />
              <div
                className="dropdown-item danger"
                role="menuitem"
                onClick={handleLogout}
              >
                <LogOut size={15} /> Sign Out
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
