# SubSync – Subscription Management System

> **Sync. Subscribe. Simplify.**

A modern SaaS subscription management dashboard built with React + Vite.

---

## Quick Start

### 1. Install Node.js (required)

Download and install Node.js (LTS recommended) from:
**https://nodejs.org/en/download**

After installation, restart your terminal/PowerShell and verify:
```bash
node --version   # should print v18+ or v20+
npm --version    # should print 9+ or 10+
```

### 2. Install dependencies

```bash
cd subsync
npm install
```

### 3. Start the dev server

```bash
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## Demo Login Credentials

| Role     | Email                    | Password    |
|----------|--------------------------|-------------|
| Admin    | admin@subsync.io         | admin123    |
| Staff    | staff@subsync.io         | staff123    |
| Customer | customer@subsync.io      | customer123 |

These are available on the login page as quick-click buttons.

---

## Project Structure

```
src/
├── components/
│   ├── common/           # Button, InputField, StatusBadge, DataTable,
│   │                     # Modal, EmptyState, LoadingState
│   ├── layout/           # Sidebar, Header, DashboardLayout
│   └── dashboard/        # StatCard
├── pages/
│   ├── auth/             # LoginPage, RegisterPage
│   ├── admin/            # AdminDashboard (+ placeholders for all routes)
│   ├── staff/            # StaffDashboard
│   └── customer/         # CustomerDashboard
├── services/
│   └── authService.js    # Login/register/logout (swap with real API)
├── context/
│   └── AuthContext.jsx   # Auth state via React Context
├── data/
│   └── mockData.js       # All mock data (customers, plans, invoices…)
├── styles/
│   ├── global.css        # Design tokens + reset
│   ├── components.css    # All component styles
│   ├── layout.css        # Sidebar + Header styles
│   └── auth.css          # Login/register page styles
├── App.jsx               # Router + route guards
└── main.jsx              # React entry point
```

---

## Color Palette

| Token         | Value     | Usage                   |
|---------------|-----------|-------------------------|
| Primary       | `#2563EB` | Buttons, links, accents |
| Primary Hover | `#1D4ED8` | Button hover states     |
| Dark Sidebar  | `#0F172A` | Sidebar background      |
| Page BG       | `#F8FAFC` | Page background         |
| Card BG       | `#FFFFFF` | Card backgrounds        |
| Text Main     | `#1E293B` | Primary text            |
| Text Secondary| `#64748B` | Secondary text          |
| Success       | `#16A34A` | Active/Paid statuses    |
| Warning       | `#F59E0B` | Pending/Trial statuses  |
| Error         | `#DC2626` | Overdue/Cancelled       |

---

## User Roles & Navigation

### Admin
Dashboard → Customers → Products → Plans → Subscriptions → Quotations → Invoices → Payments → Discounts → Analytics → Staff → Settings

### Staff
Dashboard → Customers → Subscriptions → Quotations → Invoices → Payments

### Customer
Dashboard → Browse Plans → My Subscriptions → My Invoices → Payment History → Profile

---

## Architecture Notes

- **Mock Data**: All data lives in `src/data/mockData.js`. Replace service calls in `src/services/` with real API calls when the backend is ready.
- **Auth**: `authService.js` uses localStorage for sessions. Replace with JWT/cookie auth later.
- **Route Guards**: `ProtectedRoute` in `App.jsx` enforces role-based access. Unauthenticated users are redirected to `/login`.
- **Styling**: Pure CSS with CSS variables — no Tailwind dependency. Easy to theme or override.

---

## What's Built

- [x] Global design system (CSS variables, typography, animations)
- [x] Login page (split-screen, demo credentials, validation)
- [x] Registration page (password strength meter, validation)
- [x] Sidebar (role-based nav, collapsible, mobile overlay)
- [x] Header (breadcrumb, notifications, user dropdown)
- [x] DashboardLayout (wraps all authenticated pages)
- [x] Admin Dashboard (stats, area chart, bar chart, invoices table, activity feed)
- [x] Staff Dashboard (stats, customers, attention-needed invoices)
- [x] Customer Dashboard (stats, active plan card, recent invoices)
- [x] Reusable: Button, InputField, StatusBadge, DataTable, Modal, EmptyState, LoadingState, StatCard
- [x] Auth context + service layer
- [x] Mock data for all entities
- [x] Role-based routing + guards
- [x] Responsive design (desktop, tablet, mobile)

## What's Next (Phase 2+)

- [ ] Customers CRUD page
- [ ] Products & Plans management
- [ ] Subscriptions management with status updates
- [ ] Invoice generation & view
- [ ] Payment flow
- [ ] Customer Plan Browsing page
- [ ] Analytics page with deeper charts
- [ ] Staff Management page
- [ ] Real backend API integration
