// ============================================================
// Sidebar Component
// ============================================================
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Package, CreditCard, FileText,
  BarChart2, Settings, ChevronLeft, ChevronRight,
  ShoppingBag, Tag, LogOut, UserCheck, ClipboardList,
  DollarSign, Receipt, TrendingUp, Star,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

// ──── Navigation configuration per role ────
const NAV_CONFIG = {
  admin: [
    {
      section: 'Overview',
      items: [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
      ],
    },
    {
      section: 'Management',
      items: [
        { label: 'Customers',    icon: Users,         path: '/admin/customers' },
        { label: 'Products',     icon: Package,        path: '/admin/products' },
        { label: 'Plans',        icon: Star,           path: '/admin/plans' },
        { label: 'Subscriptions',icon: CreditCard,     path: '/admin/subscriptions' },
        { label: 'Quotations',   icon: ClipboardList,  path: '/admin/quotations' },
      ],
    },
    {
      section: 'Finance',
      items: [
        { label: 'Invoices',     icon: FileText,       path: '/admin/invoices' },
        { label: 'Payments',     icon: DollarSign,     path: '/admin/payments' },
        { label: 'Discounts',    icon: Tag,            path: '/admin/discounts' },
      ],
    },
    {
      section: 'Business',
      items: [
        { label: 'Analytics',    icon: BarChart2,      path: '/admin/analytics' },
        { label: 'Staff',        icon: UserCheck,      path: '/admin/staff' },
        { label: 'Settings',     icon: Settings,       path: '/admin/settings' },
      ],
    },
  ],

  staff: [
    {
      section: 'Overview',
      items: [
        { label: 'Dashboard',    icon: LayoutDashboard, path: '/staff/dashboard' },
      ],
    },
    {
      section: 'Operations',
      items: [
        { label: 'Customers',    icon: Users,           path: '/staff/customers' },
        { label: 'Subscriptions',icon: CreditCard,      path: '/staff/subscriptions' },
        { label: 'Quotations',   icon: ClipboardList,   path: '/staff/quotations' },
        { label: 'Invoices',     icon: FileText,        path: '/staff/invoices' },
        { label: 'Payments',     icon: DollarSign,      path: '/staff/payments' },
      ],
    },
  ],

  customer: [
    {
      section: 'My Account',
      items: [
        { label: 'Dashboard',    icon: LayoutDashboard, path: '/customer/dashboard' },
        { label: 'Browse Plans', icon: ShoppingBag,     path: '/customer/plans' },
      ],
    },
    {
      section: 'Subscriptions',
      items: [
        { label: 'My Subscriptions', icon: CreditCard,  path: '/customer/subscriptions' },
        { label: 'My Invoices',      icon: Receipt,      path: '/customer/invoices' },
        { label: 'Payment History',  icon: TrendingUp,   path: '/customer/payments' },
      ],
    },
    {
      section: 'Account',
      items: [
        { label: 'Profile',      icon: Users,            path: '/customer/profile' },
      ],
    },
  ],
};

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const role = user?.role || 'customer';
  const navSections = NAV_CONFIG[role] || [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`mobile-overlay ${mobileOpen ? 'visible' : ''}`}
        onClick={onMobileClose}
        aria-hidden="true"
      />

      <aside
        className={`sidebar${collapsed ? ' collapsed' : ''}${mobileOpen ? ' mobile-open' : ''}`}
        aria-label="Main navigation"
      >
        {/* Brand / Logo */}
        <div className="sidebar-brand">
          <div className="sidebar-logo">S</div>
          <div className="sidebar-brand-text">
            <span className="sidebar-brand-name">SubSync</span>
            <span className="sidebar-brand-tagline">Sync. Subscribe. Simplify.</span>
          </div>
        </div>

        {/* Desktop collapse toggle */}
        <button
          className="sidebar-toggle"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>

        {/* Navigation */}
        <nav className="sidebar-nav" aria-label="Main menu">
          {navSections.map((section) => (
            <div key={section.section}>
              <div className="sidebar-section-label">{section.section}</div>
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `nav-item${isActive ? ' active' : ''}`
                    }
                    data-tooltip={item.label}
                    onClick={onMobileClose}
                    aria-label={item.label}
                  >
                    <span className="nav-item-icon">
                      <Icon size={18} />
                    </span>
                    <span className="nav-item-label">{item.label}</span>
                    {item.badge && (
                      <span className="nav-item-badge">{item.badge}</span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer – User info + Logout */}
        <div className="sidebar-footer">
          <div
            className="sidebar-user"
            onClick={handleLogout}
            role="button"
            tabIndex={0}
            aria-label="Log out"
            onKeyDown={(e) => e.key === 'Enter' && handleLogout()}
            title="Log out"
          >
            <div
              className="avatar"
              style={{ background: 'var(--primary)', color: '#fff', fontSize: '0.8125rem' }}
            >
              {user?.initials || user?.name?.[0] || '?'}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.name || 'User'}</div>
              <div className="sidebar-user-role" style={{ textTransform: 'capitalize' }}>
                {role}
              </div>
            </div>
            <LogOut size={16} style={{ color: 'var(--sidebar-text)', flexShrink: 0 }} />
          </div>
        </div>
      </aside>
    </>
  );
}
