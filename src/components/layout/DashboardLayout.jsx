// ============================================================
// DashboardLayout Component – wraps all authenticated pages
// ============================================================
import React, { useState } from 'react';
import { Sidebar } from './Sidebar.jsx';
import { Header } from './Header.jsx';

export function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="dashboard-root">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <main
        className={`dashboard-main${collapsed ? ' sidebar-collapsed' : ''}`}
        id="main-content"
      >
        <Header onMenuClick={() => setMobileOpen(true)} />
        <div className="dashboard-content">
          {children}
        </div>
      </main>
    </div>
  );
}
