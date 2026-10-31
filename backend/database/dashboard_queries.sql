SELECT
    COALESCE(SUM(amount), 0) AS total_revenue_received
FROM payments;

SELECT
    COALESCE(
        SUM(total_amount - amount_paid),
        0
    ) AS total_outstanding_amount
FROM invoices
WHERE status NOT IN ('paid', 'cancelled');

SELECT
    invoice_number,
    customer_id,
    invoice_date,
    due_date,
    total_amount,
    amount_paid,
    (total_amount - amount_paid) AS outstanding_amount
FROM invoices
WHERE due_date < CURRENT_DATE
  AND amount_paid < total_amount
  AND status != 'cancelled'
ORDER BY due_date ASC;

SELECT
    COUNT(*) AS total_active_subscriptions
FROM subscriptions
WHERE status = 'active';

SELECT
    DATE_TRUNC('month', payment_date) AS revenue_month,
    COALESCE(SUM(amount), 0) AS monthly_revenue
FROM payments
GROUP BY DATE_TRUNC('month', payment_date)
ORDER BY revenue_month ASC;

SELECT
    c.company_name,
    s.subscription_number,
    p.name AS plan_name,
    s.start_date,
    s.expiry_date,
    s.status
FROM subscriptions s
JOIN customers c
    ON s.customer_id = c.id
JOIN plans p
    ON s.plan_id = p.id
ORDER BY c.company_name, s.start_date DESC;

SELECT
    s.subscription_number,
    c.company_name,
    c.email,
    s.start_date,
    s.expiry_date,
    s.status
FROM subscriptions s
JOIN customers c
    ON s.customer_id = c.id
WHERE s.status = 'active'
  AND s.expiry_date BETWEEN CURRENT_DATE
                        AND CURRENT_DATE + INTERVAL '30 days'
ORDER BY s.expiry_date ASC;

SELECT
    s.subscription_number,
    c.company_name,
    c.email,
    s.start_date,
    s.expiry_date,
    s.status
FROM subscriptions s
JOIN customers c
    ON s.customer_id = c.id
WHERE s.status = 'active'
  AND s.expiry_date BETWEEN CURRENT_DATE
                        AND CURRENT_DATE + INTERVAL '30 days'
ORDER BY s.expiry_date ASC;

SELECT
    EXTRACT(YEAR FROM payment_date) AS revenue_year,
    SUM(amount) AS yearly_revenue
FROM payments
GROUP BY EXTRACT(YEAR FROM payment_date)
ORDER BY revenue_year ASC;

SELECT
    COUNT(*) AS total_customers
FROM customers;

SELECT
    COUNT(*) AS total_invoices
FROM invoices;

SELECT
    payment_method,
    COUNT(*) AS total_transactions,
    SUM(amount) AS total_amount_received
FROM payments
GROUP BY payment_method
ORDER BY total_amount_received DESC;

SELECT
    p.payment_reference,
    c.company_name,
    i.invoice_number,
    p.amount,
    p.payment_method,
    p.payment_date
FROM payments p
JOIN invoices i
    ON p.invoice_id = i.id
JOIN customers c
    ON i.customer_id = c.id
ORDER BY p.payment_date DESC
LIMIT 10;

SELECT
    status,
    COUNT(*) AS total_subscriptions
FROM subscriptions
GROUP BY status
ORDER BY total_subscriptions DESC;

SELECT
    c.id AS customer_id,
    c.company_name,
    COALESCE(SUM(p.amount), 0) AS total_revenue
FROM customers c
JOIN invoices i
    ON c.id = i.customer_id
JOIN payments p
    ON i.id = p.invoice_id
GROUP BY c.id, c.company_name
ORDER BY total_revenue DESC
LIMIT 5;

SELECT
    COALESCE(SUM(amount), 0) AS revenue_received_today
FROM payments
WHERE payment_date::DATE = CURRENT_DATE;

SELECT
    COALESCE(SUM(amount), 0) AS revenue_received_this_month
FROM payments
WHERE payment_date >= DATE_TRUNC('month', CURRENT_DATE)
  AND payment_date < DATE_TRUNC('month', CURRENT_DATE)
                            + INTERVAL '1 month';

SELECT
    COUNT(*) AS total_draft_invoices
FROM invoices
WHERE status = 'draft';

SELECT
    COUNT(*) AS total_confirmed_invoices
FROM invoices
WHERE status = 'confirmed';

SELECT
    COUNT(*) AS total_paid_invoices
FROM invoices
WHERE status = 'paid';

-- STEP 20: Count Paid Invoices
SELECT COUNT(*) AS total_paid_invoices
FROM invoices
WHERE status = 'paid';


-- STEP 21: Count Overdue Invoices
SELECT COUNT(*) AS total_overdue_invoices
FROM invoices
WHERE status = 'overdue';


-- STEP 22: Revenue by Product
SELECT
    pr.name AS product_name,
    COALESCE(SUM(il.line_total), 0) AS total_revenue
FROM invoice_lines il
JOIN products pr ON il.product_id = pr.id
GROUP BY pr.id, pr.name
ORDER BY total_revenue DESC;


-- STEP 23: Most Subscribed Plans
SELECT
    pl.name AS plan_name,
    COUNT(s.id) AS total_subscriptions
FROM plans pl
LEFT JOIN subscriptions s ON pl.id = s.plan_id
GROUP BY pl.id, pl.name
ORDER BY total_subscriptions DESC
LIMIT 5;


-- STEP 24: Customers Without Active Subscriptions
SELECT
    c.id AS customer_id,
    c.company_name,
    c.email
FROM customers c
WHERE NOT EXISTS (
    SELECT 1
    FROM subscriptions s
    WHERE s.customer_id = c.id
      AND s.status = 'active'
)
ORDER BY c.company_name;


-- STEP 25: Average Invoice Amount
SELECT
    COALESCE(AVG(total_amount), 0) AS average_invoice_amount
FROM invoices
WHERE status != 'cancelled';


-- STEP 26: Complete Dashboard Summary
SELECT
    (SELECT COUNT(*) FROM customers)
        AS total_customers,

    (SELECT COUNT(*) FROM subscriptions
     WHERE status = 'active')
        AS active_subscriptions,

    (SELECT COUNT(*) FROM invoices)
        AS total_invoices,

    (SELECT COALESCE(SUM(amount), 0) FROM payments)
        AS total_revenue_received,

    (SELECT COALESCE(SUM(total_amount - amount_paid), 0)
     FROM invoices
     WHERE status NOT IN ('paid', 'cancelled'))
        AS outstanding_amount,

    (SELECT COUNT(*) FROM invoices
     WHERE status = 'overdue')
        AS overdue_invoices;
