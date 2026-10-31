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
