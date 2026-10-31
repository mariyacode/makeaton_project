// ============================================================
// Mock Data – Users (Admin / Staff / Customer)
// ============================================================
export const mockUsers = [
  {
    id: 'u1',
    name: 'Alex Johnson',
    email: 'admin@subsync.io',
    password: 'admin123',
    role: 'admin',
    avatar: null,
    initials: 'AJ',
    joinedAt: '2024-01-15',
    status: 'active',
  },
  {
    id: 'u2',
    name: 'Sarah Mitchell',
    email: 'staff@subsync.io',
    password: 'staff123',
    role: 'staff',
    avatar: null,
    initials: 'SM',
    joinedAt: '2024-02-20',
    status: 'active',
  },
  {
    id: 'u3',
    name: 'James Carter',
    email: 'customer@subsync.io',
    password: 'customer123',
    role: 'customer',
    avatar: null,
    initials: 'JC',
    joinedAt: '2024-03-10',
    status: 'active',
  },
  {
    id: 'u4',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    password: 'priya123',
    role: 'customer',
    avatar: null,
    initials: 'PS',
    joinedAt: '2024-04-05',
    status: 'active',
  },
  {
    id: 'u5',
    name: 'David Lee',
    email: 'david@example.com',
    password: 'david123',
    role: 'customer',
    avatar: null,
    initials: 'DL',
    joinedAt: '2024-05-18',
    status: 'active',
  },
];

// ============================================================
// Mock Data – Products
// ============================================================
export const mockProducts = [
  { id: 'p1', name: 'Starter Pack', description: 'Basic access for individuals', category: 'SaaS', status: 'active', price: 9.99 },
  { id: 'p2', name: 'Professional Suite', description: 'Advanced tools for growing teams', category: 'SaaS', status: 'active', price: 49.99 },
  { id: 'p3', name: 'Enterprise Platform', description: 'Full-featured enterprise solution', category: 'SaaS', status: 'active', price: 199.99 },
  { id: 'p4', name: 'Analytics Add-on', description: 'Advanced analytics and reporting', category: 'Add-on', status: 'active', price: 19.99 },
  { id: 'p5', name: 'Storage Expansion', description: 'Extra cloud storage capacity', category: 'Add-on', status: 'inactive', price: 14.99 },
];

// ============================================================
// Mock Data – Subscription Plans
// ============================================================
export const mockPlans = [
  {
    id: 'plan1',
    name: 'Starter',
    productId: 'p1',
    billingCycle: 'monthly',
    price: 9.99,
    currency: 'USD',
    trialDays: 14,
    features: [
      '1 User', '5GB Storage', 'Email Support', 'Basic Analytics', 'API Access',
    ],
    status: 'active',
    popular: false,
    color: '#64748B',
  },
  {
    id: 'plan2',
    name: 'Professional',
    productId: 'p2',
    billingCycle: 'monthly',
    price: 49.99,
    currency: 'USD',
    trialDays: 7,
    features: [
      '10 Users', '50GB Storage', 'Priority Support', 'Advanced Analytics',
      'Custom Integrations', 'Team Collaboration', 'API Access',
    ],
    status: 'active',
    popular: true,
    color: '#2563EB',
  },
  {
    id: 'plan3',
    name: 'Enterprise',
    productId: 'p3',
    billingCycle: 'monthly',
    price: 199.99,
    currency: 'USD',
    trialDays: 0,
    features: [
      'Unlimited Users', 'Unlimited Storage', '24/7 Dedicated Support',
      'Full Analytics Suite', 'Custom Integrations', 'SLA Guarantee',
      'White-labeling', 'Custom Contracts', 'Onboarding Manager',
    ],
    status: 'active',
    popular: false,
    color: '#7C3AED',
  },
  {
    id: 'plan4',
    name: 'Starter Annual',
    productId: 'p1',
    billingCycle: 'annual',
    price: 99.99,
    currency: 'USD',
    trialDays: 14,
    features: ['1 User', '5GB Storage', 'Email Support', 'Basic Analytics', 'API Access', '2 Months Free'],
    status: 'active',
    popular: false,
    color: '#059669',
  },
];

// ============================================================
// Mock Data – Customers
// ============================================================
export const mockCustomers = [
  { id: 'c1', userId: 'u3', name: 'James Carter', email: 'customer@subsync.io', phone: '+1 555-0101', company: 'Carter & Co', status: 'active', joinedAt: '2024-03-10', totalSpent: 599.88 },
  { id: 'c2', userId: 'u4', name: 'Priya Sharma', email: 'priya@example.com', phone: '+1 555-0102', company: 'Sharma Tech', status: 'active', joinedAt: '2024-04-05', totalSpent: 299.94 },
  { id: 'c3', userId: 'u5', name: 'David Lee', email: 'david@example.com', phone: '+1 555-0103', company: 'Lee Media', status: 'active', joinedAt: '2024-05-18', totalSpent: 149.97 },
  { id: 'c4', name: 'Emily Watson', email: 'emily@example.com', phone: '+1 555-0104', company: 'Watson Group', status: 'active', joinedAt: '2024-06-12', totalSpent: 999.95 },
  { id: 'c5', name: 'Liam Torres', email: 'liam@example.com', phone: '+1 555-0105', company: 'Torres Inc', status: 'inactive', joinedAt: '2024-07-01', totalSpent: 49.99 },
  { id: 'c6', name: 'Sophie Chen', email: 'sophie@example.com', phone: '+1 555-0106', company: 'Chen Studios', status: 'active', joinedAt: '2024-07-22', totalSpent: 749.91 },
];

// ============================================================
// Mock Data – Subscriptions
// ============================================================
export const mockSubscriptions = [
  {
    id: 'sub1',
    customerId: 'c1',
    customerName: 'James Carter',
    planId: 'plan2',
    planName: 'Professional',
    status: 'active',
    startDate: '2024-03-10',
    nextBillingDate: '2026-11-10',
    billingCycle: 'monthly',
    amount: 49.99,
    currency: 'USD',
  },
  {
    id: 'sub2',
    customerId: 'c2',
    customerName: 'Priya Sharma',
    planId: 'plan1',
    planName: 'Starter',
    status: 'active',
    startDate: '2024-04-05',
    nextBillingDate: '2026-11-05',
    billingCycle: 'monthly',
    amount: 9.99,
    currency: 'USD',
  },
  {
    id: 'sub3',
    customerId: 'c4',
    customerName: 'Emily Watson',
    planId: 'plan3',
    planName: 'Enterprise',
    status: 'active',
    startDate: '2024-06-12',
    nextBillingDate: '2026-11-12',
    billingCycle: 'monthly',
    amount: 199.99,
    currency: 'USD',
  },
  {
    id: 'sub4',
    customerId: 'c5',
    customerName: 'Liam Torres',
    planId: 'plan1',
    planName: 'Starter',
    status: 'cancelled',
    startDate: '2024-07-01',
    nextBillingDate: null,
    billingCycle: 'monthly',
    amount: 9.99,
    currency: 'USD',
  },
  {
    id: 'sub5',
    customerId: 'c3',
    customerName: 'David Lee',
    planId: 'plan1',
    planName: 'Starter',
    status: 'trialing',
    startDate: '2026-10-18',
    nextBillingDate: '2026-11-01',
    billingCycle: 'monthly',
    amount: 9.99,
    currency: 'USD',
  },
  {
    id: 'sub6',
    customerId: 'c6',
    customerName: 'Sophie Chen',
    planId: 'plan2',
    planName: 'Professional',
    status: 'active',
    startDate: '2024-07-22',
    nextBillingDate: '2026-11-22',
    billingCycle: 'monthly',
    amount: 49.99,
    currency: 'USD',
  },
];

// ============================================================
// Mock Data – Invoices
// ============================================================
export const mockInvoices = [
  { id: 'inv001', subscriptionId: 'sub1', customerId: 'c1', customerName: 'James Carter', amount: 49.99, currency: 'USD', status: 'paid', issuedAt: '2026-10-10', dueDate: '2026-10-24', paidAt: '2026-10-12', planName: 'Professional' },
  { id: 'inv002', subscriptionId: 'sub3', customerId: 'c4', customerName: 'Emily Watson', amount: 199.99, currency: 'USD', status: 'paid', issuedAt: '2026-10-12', dueDate: '2026-10-26', paidAt: '2026-10-13', planName: 'Enterprise' },
  { id: 'inv003', subscriptionId: 'sub6', customerId: 'c6', customerName: 'Sophie Chen', amount: 49.99, currency: 'USD', status: 'overdue', issuedAt: '2026-09-22', dueDate: '2026-10-06', paidAt: null, planName: 'Professional' },
  { id: 'inv004', subscriptionId: 'sub2', customerId: 'c2', customerName: 'Priya Sharma', amount: 9.99, currency: 'USD', status: 'pending', issuedAt: '2026-10-05', dueDate: '2026-11-05', paidAt: null, planName: 'Starter' },
  { id: 'inv005', subscriptionId: 'sub1', customerId: 'c1', customerName: 'James Carter', amount: 49.99, currency: 'USD', status: 'paid', issuedAt: '2026-09-10', dueDate: '2026-09-24', paidAt: '2026-09-11', planName: 'Professional' },
  { id: 'inv006', subscriptionId: 'sub3', customerId: 'c4', customerName: 'Emily Watson', amount: 199.99, currency: 'USD', status: 'paid', issuedAt: '2026-09-12', dueDate: '2026-09-26', paidAt: '2026-09-14', planName: 'Enterprise' },
  { id: 'inv007', subscriptionId: 'sub5', customerId: 'c3', customerName: 'David Lee', amount: 9.99, currency: 'USD', status: 'pending', issuedAt: '2026-10-18', dueDate: '2026-11-01', paidAt: null, planName: 'Starter' },
];

// ============================================================
// Mock Data – Payments
// ============================================================
export const mockPayments = [
  { id: 'pay001', invoiceId: 'inv001', customerId: 'c1', customerName: 'James Carter', amount: 49.99, currency: 'USD', method: 'Credit Card', status: 'success', processedAt: '2026-10-12', reference: 'TXN-A1B2C3' },
  { id: 'pay002', invoiceId: 'inv002', customerId: 'c4', customerName: 'Emily Watson', amount: 199.99, currency: 'USD', method: 'Bank Transfer', status: 'success', processedAt: '2026-10-13', reference: 'TXN-D4E5F6' },
  { id: 'pay003', invoiceId: 'inv005', customerId: 'c1', customerName: 'James Carter', amount: 49.99, currency: 'USD', method: 'Credit Card', status: 'success', processedAt: '2026-09-11', reference: 'TXN-G7H8I9' },
  { id: 'pay004', invoiceId: 'inv006', customerId: 'c4', customerName: 'Emily Watson', amount: 199.99, currency: 'USD', method: 'Bank Transfer', status: 'success', processedAt: '2026-09-14', reference: 'TXN-J0K1L2' },
];

// ============================================================
// Mock Data – Analytics / Revenue Chart
// ============================================================
export const mockRevenueData = [
  { month: 'May', revenue: 3200, subscriptions: 18 },
  { month: 'Jun', revenue: 4100, subscriptions: 22 },
  { month: 'Jul', revenue: 3800, subscriptions: 20 },
  { month: 'Aug', revenue: 5200, subscriptions: 28 },
  { month: 'Sep', revenue: 4900, subscriptions: 26 },
  { month: 'Oct', revenue: 6100, subscriptions: 34 },
];

export const mockSubscriptionGrowth = [
  { month: 'May', active: 18, cancelled: 2, new: 5 },
  { month: 'Jun', active: 22, cancelled: 1, new: 6 },
  { month: 'Jul', active: 20, cancelled: 3, new: 4 },
  { month: 'Aug', active: 28, cancelled: 1, new: 9 },
  { month: 'Sep', active: 26, cancelled: 2, new: 3 },
  { month: 'Oct', active: 34, cancelled: 1, new: 10 },
];

// ============================================================
// Mock Data – Discounts
// ============================================================
export const mockDiscounts = [
  { id: 'd1', code: 'WELCOME20', type: 'percentage', value: 20, validUntil: '2026-12-31', usageCount: 12, maxUsage: 100, status: 'active' },
  { id: 'd2', code: 'FLAT10', type: 'fixed', value: 10, validUntil: '2026-11-30', usageCount: 5, maxUsage: 50, status: 'active' },
  { id: 'd3', code: 'BLACKFRIDAY', type: 'percentage', value: 40, validUntil: '2026-11-29', usageCount: 0, maxUsage: 200, status: 'active' },
];

// ============================================================
// Mock Data – Staff
// ============================================================
export const mockStaff = [
  { id: 's1', name: 'Sarah Mitchell', email: 'staff@subsync.io', role: 'staff', department: 'Customer Success', status: 'active', joinedAt: '2024-02-20' },
  { id: 's2', name: 'Mark Nguyen', email: 'mark@subsync.io', role: 'staff', department: 'Billing', status: 'active', joinedAt: '2024-05-01' },
];

// ============================================================
// Dashboard Summary Stats
// ============================================================
export const mockDashboardStats = {
  admin: {
    activeSubscriptions: { value: 5, trend: +12, label: 'Active Subscriptions' },
    revenueReceived: { value: 509.95, trend: +18.5, label: 'Revenue Received (Oct)' },
    outstandingPayments: { value: 59.97, trend: -5, label: 'Outstanding Payments' },
    overdueInvoices: { value: 1, trend: 0, label: 'Overdue Invoices' },
  },
};
