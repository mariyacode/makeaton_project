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
import CustomersPage from './pages/admin/CustomersPage.jsx';
import ProductsPage from './pages/admin/ProductsPage.jsx';
import PlansPage from './pages/admin/PlansPage.jsx';
import SubscriptionsPage from './pages/admin/SubscriptionsPage.jsx';
import InvoicesPage from './pages/admin/InvoicesPage.jsx';
import PaymentsPage from './pages/admin/PaymentsPage.jsx';
import AnalyticsPage from './pages/admin/AnalyticsPage.jsx';
import StaffPage from './pages/admin/StaffPage.jsx';

// Staff pages
import StaffDashboard from './pages/staff/StaffDashboard.jsx';

// Customer pages
import CustomerDashboard from './pages/customer/CustomerDashboard.jsx';
import BrowsePlansPage from './pages/customer/BrowsePlansPage.jsx';
import CustomerRecordsPage from './pages/customer/CustomerRecordsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

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
            <Route path="/admin/customers"    element={<CustomersPage />} />
            <Route path="/admin/products"     element={<ProductsPage />} />
            <Route path="/admin/plans"        element={<PlansPage />} />
            <Route path="/admin/subscriptions"element={<SubscriptionsPage />} />
            <Route path="/admin/quotations"   element={<PlaceholderPage title="Quotations" />} />
            <Route path="/admin/invoices"     element={<InvoicesPage />} />
            <Route path="/admin/payments"     element={<PaymentsPage />} />
            <Route path="/admin/discounts"    element={<PlaceholderPage title="Discounts" />} />
            <Route path="/admin/analytics"    element={<AnalyticsPage />} />
            <Route path="/admin/staff"        element={<StaffPage />} />
            <Route path="/admin/settings"     element={<PlaceholderPage title="Settings" />} />
            <Route path="/admin/profile"      element={<ProfilePage />} />
          </Route>

          {/* Staff routes */}
          <Route element={<ProtectedRoute allowedRoles={['staff']} />}>
            <Route path="/staff/dashboard"    element={<StaffDashboard />} />
            <Route path="/staff/customers"    element={<CustomersPage />} />
            <Route path="/staff/subscriptions"element={<SubscriptionsPage />} />
            <Route path="/staff/quotations"   element={<PlaceholderPage title="Quotations" />} />
            <Route path="/staff/invoices"     element={<InvoicesPage />} />
            <Route path="/staff/payments"     element={<PaymentsPage />} />
            <Route path="/staff/profile"      element={<ProfilePage />} />
            <Route path="/staff/settings"     element={<PlaceholderPage title="Settings" />} />
          </Route>

          {/* Customer routes */}
          <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
            <Route path="/customer/dashboard"    element={<CustomerDashboard />} />
            <Route path="/customer/plans"        element={<BrowsePlansPage />} />
            <Route path="/customer/subscriptions"element={<CustomerRecordsPage type="subscriptions" />} />
            <Route path="/customer/invoices"     element={<CustomerRecordsPage type="invoices" />} />
            <Route path="/customer/payments"     element={<CustomerRecordsPage type="payments" />} />
            <Route path="/customer/profile"      element={<ProfilePage />} />
            <Route path="/customer/settings"     element={<PlaceholderPage title="Settings" />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
