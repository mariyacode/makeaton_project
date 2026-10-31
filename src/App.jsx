// ============================================================
// App.jsx – Root Router & Route Guards
// ============================================================
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { DashboardLayout } from './components/layout/DashboardLayout.jsx';

// Auth pages
import LoginPage    from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard.jsx';

// Staff pages
import StaffDashboard from './pages/staff/StaffDashboard.jsx';

// Customer pages
import CustomerDashboard from './pages/customer/CustomerDashboard.jsx';

// Placeholder
import PlaceholderPage from './pages/PlaceholderPage.jsx';

// ──── Route Guards ────
function ProtectedRoute({ allowedRoles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to correct role dashboard
    const path = user.role === 'admin' ? '/admin/dashboard' : user.role === 'staff' ? '/staff/dashboard' : '/customer/dashboard';
    return <Navigate to={path} replace />;
  }
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}

function PublicOnlyRoute() {
  const { user } = useAuth();
  if (user) {
    const path = user.role === 'admin' ? '/admin/dashboard' : user.role === 'staff' ? '/staff/dashboard' : '/customer/dashboard';
    return <Navigate to={path} replace />;
  }
  return <Outlet />;
}

function RootRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  const path = user.role === 'admin' ? '/admin/dashboard' : user.role === 'staff' ? '/staff/dashboard' : '/customer/dashboard';
  return <Navigate to={path} replace />;
}

// ──── App ────
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Root */}
          <Route path="/" element={<RootRedirect />} />

          {/* Public routes (redirect if already logged in) */}
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Admin routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard"    element={<AdminDashboard />} />
            <Route path="/admin/customers"    element={<PlaceholderPage title="Customers" />} />
            <Route path="/admin/products"     element={<PlaceholderPage title="Products" />} />
            <Route path="/admin/plans"        element={<PlaceholderPage title="Subscription Plans" />} />
            <Route path="/admin/subscriptions"element={<PlaceholderPage title="Subscriptions" />} />
            <Route path="/admin/quotations"   element={<PlaceholderPage title="Quotations" />} />
            <Route path="/admin/invoices"     element={<PlaceholderPage title="Invoices" />} />
            <Route path="/admin/payments"     element={<PlaceholderPage title="Payments" />} />
            <Route path="/admin/discounts"    element={<PlaceholderPage title="Discounts" />} />
            <Route path="/admin/analytics"    element={<PlaceholderPage title="Analytics" />} />
            <Route path="/admin/staff"        element={<PlaceholderPage title="Staff Management" />} />
            <Route path="/admin/settings"     element={<PlaceholderPage title="Settings" />} />
            <Route path="/admin/profile"      element={<PlaceholderPage title="Profile" />} />
          </Route>

          {/* Staff routes */}
          <Route element={<ProtectedRoute allowedRoles={['staff']} />}>
            <Route path="/staff/dashboard"    element={<StaffDashboard />} />
            <Route path="/staff/customers"    element={<PlaceholderPage title="Customers" />} />
            <Route path="/staff/subscriptions"element={<PlaceholderPage title="Subscriptions" />} />
            <Route path="/staff/quotations"   element={<PlaceholderPage title="Quotations" />} />
            <Route path="/staff/invoices"     element={<PlaceholderPage title="Invoices" />} />
            <Route path="/staff/payments"     element={<PlaceholderPage title="Payments" />} />
            <Route path="/staff/profile"      element={<PlaceholderPage title="Profile" />} />
            <Route path="/staff/settings"     element={<PlaceholderPage title="Settings" />} />
          </Route>

          {/* Customer routes */}
          <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
            <Route path="/customer/dashboard"    element={<CustomerDashboard />} />
            <Route path="/customer/plans"        element={<PlaceholderPage title="Browse Plans" />} />
            <Route path="/customer/subscriptions"element={<PlaceholderPage title="My Subscriptions" />} />
            <Route path="/customer/invoices"     element={<PlaceholderPage title="My Invoices" />} />
            <Route path="/customer/payments"     element={<PlaceholderPage title="Payment History" />} />
            <Route path="/customer/profile"      element={<PlaceholderPage title="Profile" />} />
            <Route path="/customer/settings"     element={<PlaceholderPage title="Settings" />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
