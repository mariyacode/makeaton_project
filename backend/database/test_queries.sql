
-- ============================================
-- TEST 1: View all customers
-- ============================================
SELECT * FROM customers;

-- ============================================
-- TEST 2: View subscriptions with customer names
-- ============================================
SELECT
    s.subscription_number,
    c.company_name,
    p.name AS plan_name,
    s.status,
    s.start_date,
    s.expiry_date
FROM subscriptions s
JOIN customers c ON s.customer_id = c.id
JOIN plans p ON s.plan_id = p.id;

-- ============================================
-- TEST 3: Invoice summary
-- ============================================
SELECT
    invoice_number,
    total_amount,
    amount_paid,
    total_amount - amount_paid AS outstanding_amount,
    status
FROM invoices;

-- ============================================
-- TEST 4: Total revenue received
-- ============================================
SELECT COALESCE(SUM(amount), 0) AS total_revenue
FROM payments;

-- ============================================
-- TEST 5: Overdue invoices
-- ============================================
SELECT
    invoice_number,
    due_date,
    total_amount - amount_paid AS outstanding
FROM invoices
WHERE due_date < CURRENT_DATE
AND amount_paid < total_amount
AND status != 'cancelled';

-- ============================================
-- TEST 6: Active subscription count
-- ============================================
SELECT COUNT(*) AS active_subscriptions
FROM subscriptions
WHERE status = 'active';
