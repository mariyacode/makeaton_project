import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  CircleDollarSign,
  CreditCard,
  FileText,
  Layers3,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';

const featureCards = [
  {
    icon: Layers3,
    title: 'Product & Plan Management',
    description: 'Create pricing tiers, manage offerings, and keep every plan aligned with your revenue model.',
  },
  {
    icon: Users,
    title: 'Customer Management',
    description: 'Centralize customer profiles, lifecycle status, and subscription activity in one workspace.',
  },
  {
    icon: Layers3,
    title: 'Subscription Management',
    description: 'Track renewals, plan changes, and active subscriptions with a complete operational overview.',
  },
  {
    icon: FileText,
    title: 'Automated Invoicing',
    description: 'Generate recurring invoices automatically and send up-to-date billing details on schedule.',
  },
  {
    icon: CreditCard,
    title: 'Payment Tracking',
    description: 'Monitor payments, follow failed charges, and maintain a clean record of every transaction.',
  },
  {
    icon: BarChart3,
    title: 'Business Analytics',
    description: 'Understand revenue performance, retention, and growth with real-time business insights.',
  },
];

const valuePoints = [
  {
    icon: CheckCircle2,
    title: 'Easy subscription management',
    description: 'Keep plans, renewals, and customer records organized without manual bottlenecks.',
  },
  {
    icon: Zap,
    title: 'Automated recurring billing',
    description: 'Reduce payment churn with consistent billing cycles and streamlined follow-ups.',
  },
  {
    icon: Users,
    title: 'Centralized customer information',
    description: 'Give teams instant access to customer records, subscriptions, and billing history.',
  },
  {
    icon: BarChart3,
    title: 'Real-time business insights',
    description: 'Track MRR, retention, and performance trends with live reporting and visibility.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure payment tracking',
    description: 'Monitor transactions and balances confidently with secure, structured payment workflows.',
  },
];

const metricCards = [
  { label: 'Total Customers', value: '24.8K', trend: '+18.4%' },
  { label: 'Active Subscriptions', value: '9.4K', trend: '+12.7%' },
  { label: 'Monthly Recurring Revenue', value: '$186.2K', trend: '+22.1%' },
];

const renewalList = [
  { name: 'Northstar Labs', date: 'Jun 12' },
  { name: 'Summit Studio', date: 'Jun 18' },
  { name: 'BluePeak Ops', date: 'Jun 24' },
];

export default function HomePage() {
  return (
    <div className="home-page" id="home">
      <header className="site-header">
        <div className="container">
          <nav className="site-nav" aria-label="Main navigation">
            <Link to="/" className="brand" aria-label="SubscriptIQ home">
              <span className="brand-mark">S</span>
              <span className="brand-text">SubscriptIQ</span>
            </Link>

            <div className="nav-actions">
              <Link to="/" className="nav-link">Home</Link>
              <a href="#about" className="nav-link">About</a>
              <a href="#product" className="nav-link">Product</a>
              <Link to="/login" className="btn btn-secondary nav-signin">Sign In</Link>
              <Link to="/register" className="btn btn-primary nav-cta">Get Started</Link>
            </div>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="eyebrow">
                <Sparkles size={16} />
                Smarter billing for growing businesses
              </div>

              <h1>Manage. Automate. Grow.</h1>

              <p>
                The all-in-one platform to manage products, subscriptions, recurring billing, payments and business analytics.
              </p>

              <div className="hero-actions">
                <Link to="/register" className="btn btn-primary btn-lg hero-btn">
                  Start Free Trial
                  <ArrowRight size={18} />
                </Link>
                <a href="#product" className="btn btn-secondary btn-lg hero-btn">Explore Products</a>
              </div>

              <div className="hero-stats" aria-label="Key business metrics">
                <div className="hero-stat">
                  <strong>4.9/5</strong>
                  <span>customer satisfaction</span>
                </div>
                <div className="hero-stat">
                  <strong>99.8%</strong>
                  <span>billing reliability</span>
                </div>
              </div>
            </div>

            <div className="hero-visual" aria-label="Subscription dashboard preview">
              <div className="dashboard-preview">
                <div className="preview-header">
                  <div className="preview-badges">
                    <span className="preview-dot blue" />
                    <span className="preview-dot gray" />
                    <span className="preview-dot gray" />
                  </div>
                  <span className="preview-label">Dashboard</span>
                </div>

                <div className="preview-body">
                  <div className="metric-stack">
                    {metricCards.map((card) => (
                      <div key={card.label} className="metric-card">
                        <div className="metric-label">{card.label}</div>
                        <div className="metric-value">{card.value}</div>
                        <div className="metric-trend">{card.trend}</div>
                      </div>
                    ))}
                  </div>

                  <div className="chart-panel">
                    <div className="chart-header">
                      <span>Revenue Overview</span>
                      <span className="chip positive">+18.4%</span>
                    </div>
                    <div className="chart-bars" aria-hidden="true">
                      <span style={{ height: '35%' }} />
                      <span style={{ height: '42%' }} />
                      <span style={{ height: '52%' }} />
                      <span style={{ height: '58%' }} />
                      <span style={{ height: '71%' }} />
                      <span style={{ height: '84%' }} />
                      <span style={{ height: '100%' }} />
                    </div>
                  </div>

                  <div className="summary-row">
                    <div className="summary-panel">
                      <div className="summary-header">
                        <span>Renewals</span>
                        <TrendingUp size={16} />
                      </div>
                      <strong>142</strong>
                      <small>Due in 7 days</small>
                    </div>

                    <div className="summary-panel soft">
                      <div className="summary-header">
                        <span>MRR</span>
                        <CircleDollarSign size={16} />
                      </div>
                      <strong>$186.2K</strong>
                      <small>Monthly recurring</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="content-section" id="about">
          <div className="container about-grid">
            <div className="about-copy">
              <div className="section-kicker">About</div>
              <h2>Simplifying Subscription Management</h2>
              <p>
                SubscriptIQ helps subscription-based companies manage multiple customers, products, plans, subscriptions,
                invoices and recurring payments from one centralized platform.
              </p>
              <div className="mini-checklist">
                <div className="mini-check-item">
                  <CheckCircle2 size={18} />
                  <span>One platform for billing operations</span>
                </div>
                <div className="mini-check-item">
                  <CheckCircle2 size={18} />
                  <span>Better visibility into recurring revenue</span>
                </div>
                <div className="mini-check-item">
                  <CheckCircle2 size={18} />
                  <span>Faster onboarding and fewer manual tasks</span>
                </div>
              </div>
            </div>

            <div className="about-panel">
              <div className="about-panel-header">
                <span>Operations overview</span>
                <span className="panel-chip">Live</span>
              </div>

              <div className="status-list">
                <div className="status-item">
                  <div className="status-icon purple"><Users size={16} /></div>
                  <div>
                    <strong>Customers</strong>
                    <small>24,860 total accounts</small>
                  </div>
                </div>
                <div className="status-item">
                  <div className="status-icon sky"><CreditCard size={16} /></div>
                  <div>
                    <strong>Payments</strong>
                    <small>96.4% on-time collection</small>
                  </div>
                </div>
                <div className="status-item">
                  <div className="status-icon gold"><BarChart3 size={16} /></div>
                  <div>
                    <strong>Revenue</strong>
                    <small>$186.2K recurring MRR</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="content-section alt-section" id="product">
          <div className="container">
            <div className="section-heading narrow">
              <div className="section-kicker">Product</div>
              <h2>Built for every part of the subscription lifecycle.</h2>
            </div>

            <div className="feature-grid">
              {featureCards.map((feature) => {
                const Icon = feature.icon;
                return (
                  <article key={feature.title} className="feature-card">
                    <div className="feature-icon">
                      <Icon size={20} />
                    </div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="content-section" id="why-subscriptiq">
          <div className="container why-grid">
            <div className="why-copy">
              <div className="section-kicker">Why choose SubscriptIQ</div>
              <h2>Everything you need to run a healthier subscription business.</h2>
            </div>

            <div className="why-cards">
              {valuePoints.map((point) => {
                const Icon = point.icon;
                return (
                  <div key={point.title} className="reason-card">
                    <div className="reason-icon">
                      <Icon size={18} />
                    </div>
                    <div>
                      <h3>{point.title}</h3>
                      <p>{point.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="container">
            <div className="cta-panel">
              <div>
                <div className="section-kicker light">Ready to grow</div>
                <h2>Ready to Simplify Your Subscription Business?</h2>
                <p>Manage every subscription, automate billing and track your revenue effortlessly.</p>
              </div>

              <Link to="/register" className="btn btn-primary btn-lg cta-btn">
                Get Started Free
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer" id="contact">
        <div className="container footer-grid">
          <div className="footer-brand-block">
            <Link to="/" className="brand footer-brand" aria-label="SubscriptIQ home">
              <span className="brand-mark">S</span>
              <span className="brand-text">SubscriptIQ</span>
            </Link>
            <p>
              Grow recurring revenue with a smarter, more connected subscription management platform.
            </p>
          </div>

          <div>
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><a href="#about">About</a></li>
              <li><a href="#product">Product</a></li>
            </ul>
          </div>

          <div>
            <h3>Features</h3>
            <ul className="footer-links">
              <li><a href="#product">Plans</a></li>
              <li><a href="#product">Billing</a></li>
              <li><a href="#product">Analytics</a></li>
            </ul>
          </div>

          <div>
            <h3>Contact</h3>
            <ul className="footer-links contact-links">
              <li>hello@subscriptiq.com</li>
              <li>+1 (415) 240-9910</li>
              <li>San Francisco, CA</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="container">
            <span>© 2026 SubscriptIQ. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
