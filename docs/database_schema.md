# SubSync – Database Schema Documentation

## Project Overview
SubSync is a subscription management system designed to manage customers, products, subscription plans, subscriptions, invoices, payments, and revenue tracking.

## Database
- Database Name: subsync_db
- DBMS: PostgreSQL
- ORM: SQLAlchemy

## Core Tables
1. users
2. customers
3. products
4. product_variants
5. plans
6. subscriptions
7. subscription_lines
8. quotations
9. quotation_lines
10. invoices
11. invoice_lines
12. payments
13. discounts
14. subscription_discounts

## Database Design Goals
- Maintain data integrity using primary and foreign keys.
- Avoid duplicate records using unique constraints.
- Use appropriate data types for monetary values.
- Support efficient searching through indexes.
- Maintain relationships between customers, subscriptions, invoices, and payments.
