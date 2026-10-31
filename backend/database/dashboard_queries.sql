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
