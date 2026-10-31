
-- ============================================
-- SubSync - Subscription Management System
-- Database: PostgreSQL
-- ============================================

-- 1. USERS TABLE
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'customer'
        CHECK (role IN ('admin', 'staff', 'customer')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. CUSTOMERS TABLE
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(150) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    tax_number VARCHAR(50) UNIQUE,
    user_id INTEGER UNIQUE REFERENCES users(id)
        ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. PRODUCTS TABLE
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    product_type VARCHAR(50) NOT NULL,
    sales_price NUMERIC(12,2) NOT NULL DEFAULT 0,
    cost_price NUMERIC(12,2) NOT NULL DEFAULT 0,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (sales_price >= 0),
    CHECK (cost_price >= 0)
);

-- 4. PRODUCT VARIANTS TABLE
CREATE TABLE product_variants (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id)
        ON DELETE CASCADE,
    variant_name VARCHAR(100) NOT NULL,
    additional_price NUMERIC(12,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE (product_id, variant_name)
);

-- ============================================
-- 5. PLANS TABLE
-- ============================================

CREATE TABLE plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    product_id INTEGER NOT NULL REFERENCES products(id)
        ON DELETE RESTRICT,
    price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
    billing_interval VARCHAR(20) NOT NULL
        CHECK (billing_interval IN (
            'daily', 'weekly', 'monthly', 'yearly'
        )),
    minimum_quantity INTEGER NOT NULL DEFAULT 1
        CHECK (minimum_quantity >= 1),
    start_date DATE,
    end_date DATE,
    auto_close BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (end_date IS NULL OR start_date IS NULL
           OR end_date >= start_date)
);

-- ============================================
-- 6. SUBSCRIPTIONS TABLE
-- ============================================

CREATE TABLE subscriptions (
    id SERIAL PRIMARY KEY,
    subscription_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id INTEGER NOT NULL REFERENCES customers(id)
        ON DELETE RESTRICT,
    plan_id INTEGER NOT NULL REFERENCES plans(id)
        ON DELETE RESTRICT,
    start_date DATE NOT NULL,
    expiry_date DATE,
    payment_terms VARCHAR(50) DEFAULT 'monthly',
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN (
            'draft', 'quotation', 'confirmed',
            'active', 'paused', 'closed'
        )),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (expiry_date IS NULL OR expiry_date >= start_date)
);

-- ============================================
-- INDEXES FOR SUBSCRIPTIONS
-- ============================================

CREATE INDEX idx_subscriptions_customer
ON subscriptions(customer_id);

CREATE INDEX idx_subscriptions_status
ON subscriptions(status);

-- ============================================
-- 7. SUBSCRIPTION LINES TABLE
-- ============================================

CREATE TABLE subscription_lines (
    id SERIAL PRIMARY KEY,
    subscription_id INTEGER NOT NULL
        REFERENCES subscriptions(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL
        REFERENCES products(id) ON DELETE RESTRICT,
    variant_id INTEGER
        REFERENCES product_variants(id) ON DELETE SET NULL,
    description VARCHAR(255),
    quantity INTEGER NOT NULL DEFAULT 1
        CHECK (quantity > 0),
    unit_price NUMERIC(12,2) NOT NULL
        CHECK (unit_price >= 0),
    subtotal NUMERIC(12,2)
        GENERATED ALWAYS AS (quantity * unit_price) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 8. QUOTATIONS TABLE
-- ============================================

CREATE TABLE quotations (
    id SERIAL PRIMARY KEY,
    quotation_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id INTEGER NOT NULL
        REFERENCES customers(id) ON DELETE RESTRICT,
    subscription_id INTEGER
        REFERENCES subscriptions(id) ON DELETE SET NULL,
    quotation_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expiry_date DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN (
            'draft', 'sent', 'accepted', 'rejected', 'expired'
        )),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (expiry_date IS NULL OR expiry_date >= quotation_date)
);

-- ============================================
-- 9. QUOTATION LINES TABLE
-- ============================================

CREATE TABLE quotation_lines (
    id SERIAL PRIMARY KEY,
    quotation_id INTEGER NOT NULL
        REFERENCES quotations(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL
        REFERENCES products(id) ON DELETE RESTRICT,
    variant_id INTEGER
        REFERENCES product_variants(id) ON DELETE SET NULL,
    description VARCHAR(255),
    quantity INTEGER NOT NULL DEFAULT 1
        CHECK (quantity > 0),
    unit_price NUMERIC(12,2) NOT NULL
        CHECK (unit_price >= 0),
    subtotal NUMERIC(12,2)
        GENERATED ALWAYS AS (quantity * unit_price) STORED
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_subscription_lines_subscription
ON subscription_lines(subscription_id);

CREATE INDEX idx_quotations_customer
ON quotations(customer_id);

CREATE INDEX idx_quotations_status
ON quotations(status);

CREATE INDEX idx_quotation_lines_quotation
ON quotation_lines(quotation_id);

