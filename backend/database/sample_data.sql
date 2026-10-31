
-- ============================================
-- SubSync - Sample Data for Testing
-- ============================================

-- 1. USERS
INSERT INTO users (name, email, password_hash, role)
VALUES
('Admin User', 'admin@subsync.com', 'dummy_hash_admin', 'admin'),
('Staff User', 'staff@subsync.com', 'dummy_hash_staff', 'staff'),
('Customer User', 'customer@subsync.com', 'dummy_hash_customer', 'customer');

-- 2. CUSTOMERS
INSERT INTO customers (company_name, contact_person, email, phone, address)
VALUES
('Tech Solutions', 'Arun Kumar', 'arun@techsolutions.com',
 '9876543210', 'Kochi, Kerala'),
('Digital World', 'Meera Nair', 'meera@digitalworld.com',
 '9123456780', 'Thrissur, Kerala');

-- 3. PRODUCTS
INSERT INTO products (name, product_type, sales_price, cost_price, description)
VALUES
('Cloud Storage', 'service', 999.00, 400.00, 'Cloud storage subscription'),
('CRM Software', 'service', 2499.00, 1200.00, 'Customer relationship management'),
('Email Marketing', 'service', 499.00, 200.00, 'Email marketing add-on');

-- 4. PRODUCT VARIANTS
INSERT INTO product_variants (product_id, variant_name, additional_price)
VALUES
(1, 'Premium Storage', 500.00),
(2, 'Enterprise Edition', 1000.00);

-- 5. PLANS
INSERT INTO plans (name, product_id, price, billing_interval, minimum_quantity)
VALUES
('Monthly Cloud Plan', 1, 999.00, 'monthly', 1),
('Yearly CRM Plan', 2,24999.00, 'yearly', 1),
('Monthly Email Plan', 3,499.00, 'monthly', 1);

-- 6. SUBSCRIPTIONS
INSERT INTO subscriptions
(subscription_number, customer_id, plan_id, start_date, expiry_date, status)
VALUES
('SUB-2026-001', 1, 1, CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 'active'),
('SUB-2026-002', 2,2, CURRENT_DATE, CURRENT_DATE + INTERVAL '365 days', 'confirmed');

-- 7. SUBSCRIPTION LINES
INSERT INTO subscription_lines
(subscription_id, product_id, description, quantity, unit_price)
VALUES
(1, 1, 'Cloud Storage Premium', 2, 999.00),
(2, 2, 'CRM Software Enterprise', 1, 24999.00);

-- 8. QUOTATIONS
INSERT INTO quotations
(quotation_number, customer_id, quotation_date, expiry_date, status, notes)
VALUES
('QUO-2026-001', 1, CURRENT_DATE, CURRENT_DATE + INTERVAL '15 days',
 'sent', 'Cloud services quotation');

-- 9. QUOTATION LINES
INSERT INTO quotation_lines
(quotation_id, product_id, description, quantity, unit_price)
VALUES
(1, 1, 'Cloud Storage', 2, 999.00),
(1, 3, 'Email Marketing', 1, 499.00);

-- 10. INVOICES
INSERT INTO invoices
(invoice_number, customer_id, subscription_id, invoice_date, due_date,
 subtotal, tax_amount, total_amount, amount_paid, status)
VALUES
('INV-2026-001', 1, 1, CURRENT_DATE, CURRENT_DATE + INTERVAL '15 days',
 1998.00, 359.64, 2357.64, 1000.00, 'partially_paid'),
('INV-2026-002', 2, 2, CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days',
 24999.00, 4499.82, 29498.82, 0.00, 'confirmed');

-- 11. INVOICE LINES
INSERT INTO invoice_lines
(invoice_id, product_id, description, quantity, unit_price,
 tax_rate, tax_amount, line_total)
VALUES
(1, 1, 'Cloud Storage Premium', 2, 999.00, 18.00, 359.64, 2357.64),
(2, 2, 'CRM Software Enterprise', 1,24999.00, 18.00, 4499.82, 29498.82);

-- 12. PAYMENTS
INSERT INTO payments
(payment_reference, invoice_id, amount, payment_method, notes)
VALUES
('PAY-2026-001', 1, 1000.00, 'upi', 'Partial payment received'),
('PAY-2026-002', 2, 5000.00, 'bank_transfer', 'Advance payment');

-- 13. DISCOUNTS
INSERT INTO discounts
(name, discount_type, discount_value, minimum_quantity, usage_limit)
VALUES
('Welcome Discount', 'percentage', 10.00, 1, 100),
('Annual Discount', 'percentage', 15.00, 1, 50);

-- 14. SUBSCRIPTION DISCOUNTS
INSERT INTO subscription_discounts (subscription_id, discount_id)
VALUES
(1, 1),
(2, 2);
