
from app import db
from sqlalchemy import CheckConstraint, UniqueConstraint, Computed, Numeric, ForeignKey, text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy import CheckConstraint, UniqueConstraint, Computed, Numeric, ForeignKey, Integer, text



class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False, default="customer")
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, server_default=func.now())


class Customer(db.Model):
    __tablename__ = "customers"

    id = db.Column(db.Integer, primary_key=True)
    company_name = db.Column(db.String(150), nullable=False)
    contact_person = db.Column(db.String(100))
    email = db.Column(db.String(150), unique=True, nullable=False)
    phone = db.Column(db.String(30))
    address = db.Column(db.Text)
    tax_number = db.Column(db.String(50), unique=True)
    user_id = db.Column(db.Integer, ForeignKey("users.id", ondelete="SET NULL"), unique=True)


class Product(db.Model):
    __tablename__ = "products"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    product_type = db.Column(db.String(50), nullable=False)
    sales_price = db.Column(Numeric(12, 2), nullable=False)
    cost_price = db.Column(Numeric(12, 2), nullable=False, default=0)
    description = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True)


class ProductVariant(db.Model):
    __tablename__ = "product_variants"

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    variant_name = db.Column(db.String(100), nullable=False)
    additional_price = db.Column(Numeric(12, 2), nullable=False, default=0)
    is_active = db.Column(db.Boolean, default=True)

    __table_args__ = (
        UniqueConstraint("product_id", "variant_name"),
    )


class Plan(db.Model):
    __tablename__ = "plans"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    product_id = db.Column(db.Integer, ForeignKey("products.id", ondelete="RESTRICT"), nullable=False)
    price = db.Column(Numeric(12, 2), nullable=False)
    billing_interval = db.Column(db.String(20), nullable=False)
    minimum_quantity = db.Column(db.Integer, default=1)
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    auto_close = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)


class Subscription(db.Model):
    __tablename__ = "subscriptions"

    id = db.Column(db.Integer, primary_key=True)
    subscription_number = db.Column(db.String(50), unique=True, nullable=False)
    customer_id = db.Column(db.Integer, ForeignKey("customers.id", ondelete="RESTRICT"), nullable=False)
    plan_id = db.Column(db.Integer, ForeignKey("plans.id", ondelete="RESTRICT"), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    expiry_date = db.Column(db.Date)
    payment_terms = db.Column(db.String(50))
    status = db.Column(db.String(20), default="draft")
    created_at = db.Column(db.DateTime, server_default=func.now())


class SubscriptionLine(db.Model):
    __tablename__ = "subscription_lines"

    id = db.Column(db.Integer, primary_key=True)
    subscription_id = db.Column(db.Integer, ForeignKey("subscriptions.id", ondelete="CASCADE"), nullable=False)
    product_id = db.Column(db.Integer, ForeignKey("products.id", ondelete="RESTRICT"), nullable=False)
    variant_id = db.Column(db.Integer, ForeignKey("product_variants.id", ondelete="SET NULL"))
    description = db.Column(db.Text)
    quantity = db.Column(Numeric(12, 2), nullable=False)
    unit_price = db.Column(Numeric(12, 2), nullable=False)
    subtotal = db.Column(Numeric(12, 2), Computed("quantity * unit_price", persisted=True))


class Quotation(db.Model):
    __tablename__ = "quotations"

    id = db.Column(db.Integer, primary_key=True)
    quotation_number = db.Column(db.String(50), unique=True, nullable=False)
    customer_id = db.Column(db.Integer, ForeignKey("customers.id", ondelete="RESTRICT"), nullable=False)
    subscription_id = db.Column(db.Integer, ForeignKey("subscriptions.id", ondelete="SET NULL"))
    quotation_date = db.Column(db.Date, nullable=False)
    expiry_date = db.Column(db.Date)
    status = db.Column(db.String(20), default="draft")
    notes = db.Column(db.Text)


class QuotationLine(db.Model):
    __tablename__ = "quotation_lines"

    id = db.Column(db.Integer, primary_key=True)
    quotation_id = db.Column(db.Integer, ForeignKey("quotations.id", ondelete="CASCADE"), nullable=False)
    product_id = db.Column(db.Integer, ForeignKey("products.id", ondelete="RESTRICT"), nullable=False)
    variant_id = db.Column(db.Integer, ForeignKey("product_variants.id", ondelete="SET NULL"))
    description = db.Column(db.Text)
    quantity = db.Column(Numeric(12, 2), nullable=False)
    unit_price = db.Column(Numeric(12, 2), nullable=False)
    subtotal = db.Column(Numeric(12, 2), Computed("quantity * unit_price", persisted=True))


class Invoice(db.Model):
    __tablename__ = "invoices"

    id = db.Column(db.Integer, primary_key=True)
    invoice_number = db.Column(db.String(50), unique=True, nullable=False)
    customer_id = db.Column(db.Integer, ForeignKey("customers.id", ondelete="RESTRICT"), nullable=False)
    subscription_id = db.Column(db.Integer, ForeignKey("subscriptions.id", ondelete="SET NULL"))
    invoice_date = db.Column(db.Date, nullable=False)
    due_date = db.Column(db.Date)
    subtotal = db.Column(Numeric(12, 2), nullable=False, default=0)
    tax_amount = db.Column(Numeric(12, 2), nullable=False, default=0)
    total_amount = db.Column(Numeric(12, 2), nullable=False, default=0)
    amount_paid = db.Column(Numeric(12, 2), nullable=False, default=0)
    status = db.Column(db.String(20), default="draft")
    notes = db.Column(db.Text)


class InvoiceLine(db.Model):
    __tablename__ = "invoice_lines"

    id = db.Column(db.Integer, primary_key=True)
    invoice_id = db.Column(db.Integer, ForeignKey("invoices.id", ondelete="CASCADE"), nullable=False)
    product_id = db.Column(db.Integer, ForeignKey("products.id", ondelete="SET NULL"))
    description = db.Column(db.Text)
    quantity = db.Column(Numeric(12, 2), nullable=False)
    unit_price = db.Column(Numeric(12, 2), nullable=False)
    tax_rate = db.Column(Numeric(5, 2), nullable=False, default=0)
    subtotal = db.Column(Numeric(12, 2), Computed("quantity * unit_price", persisted=True))
    tax_amount = db.Column(Numeric(12, 2), Computed("(quantity * unit_price * tax_rate) / 100", persisted=True))
    line_total = db.Column(Numeric(12, 2), Computed("(quantity * unit_price) + ((quantity * unit_price * tax_rate) / 100)", persisted=True))


class Payment(db.Model):
    __tablename__ = "payments"

    id = db.Column(db.Integer, primary_key=True)
    payment_reference = db.Column(db.String(100), unique=True)
    invoice_id = db.Column(db.Integer, ForeignKey("invoices.id", ondelete="RESTRICT"), nullable=False)
    amount = db.Column(Numeric(12, 2), nullable=False)
    payment_method = db.Column(db.String(30), nullable=False)
    payment_date = db.Column(db.DateTime, server_default=func.now())
    notes = db.Column(db.Text)


class Discount(db.Model):
    __tablename__ = "discounts"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    discount_type = db.Column(db.String(20), nullable=False)
    discount_value = db.Column(Numeric(12, 2), nullable=False)
    minimum_quantity = db.Column(Integer, default=1)
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    usage_limit = db.Column(db.Integer)
    used_count = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)


class SubscriptionDiscount(db.Model):
    __tablename__ = "subscription_discounts"

    id = db.Column(db.Integer, primary_key=True)
    subscription_id = db.Column(db.Integer, ForeignKey("subscriptions.id", ondelete="CASCADE"), nullable=False)
    discount_id = db.Column(db.Integer, ForeignKey("discounts.id", ondelete="RESTRICT"), nullable=False)
    applied_at = db.Column(db.DateTime, server_default=func.now())

    __table_args__ = (
        UniqueConstraint("subscription_id", "discount_id"),
    )
