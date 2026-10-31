import React, { useState } from 'react';
import { Check, CreditCard, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Modal } from '../../components/common/Modal.jsx';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';
import { useCollection } from '../../hooks/useCollection.js';
import { apiClient } from '../../services/apiClient.js';
import { mockCustomers, mockInvoices, mockPayments, mockPlans, mockSubscriptions } from '../../data/mockData.js';

const today = () => new Date().toISOString().slice(0, 10);
const dueDate = () => new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);

export default function BrowsePlansPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const plans = useCollection('plans', mockPlans);
  const customers = useCollection('customers', mockCustomers);
  const subscriptions = useCollection('subscriptions', mockSubscriptions);
  const invoices = useCollection('invoices', mockInvoices);
  const payments = useCollection('payments', mockPayments);
  const [selected, setSelected] = useState(null);
  const [method, setMethod] = useState('Credit Card');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState('');

  const checkout = async () => {
    setProcessing(true);
    setError('');
    try {
      if (apiClient.configured) {
        const result = await apiClient.request('/checkout', { method: 'POST', body: { planId: selected.id, paymentMethod: method } });
        await Promise.all([customers.reload(), subscriptions.reload(), invoices.reload(), payments.reload()]);
        setConfirmation(`Subscription started. Invoice ${result?.invoice?.id || ''} is available in your account.`);
      } else {
        let customer = customers.items.find((item) => item.email?.toLowerCase() === user.email?.toLowerCase());
        if (!customer) {
          customer = await customers.create({
            userId: user.id,
            name: user.name,
            email: user.email,
            phone: '',
            company: '',
            status: 'active',
            joinedAt: today(),
            totalSpent: 0,
          });
        }
        const subscription = await subscriptions.create({
          customerId: customer.id,
          customerName: customer.name,
          planId: selected.id,
          planName: selected.name,
          status: 'active',
          startDate: today(),
          nextBillingDate: selected.billingCycle === 'annual'
            ? new Date(Date.now() + 365 * 86400000).toISOString().slice(0, 10)
            : new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
          billingCycle: selected.billingCycle,
          amount: Number(selected.price),
          currency: selected.currency || 'USD',
        });
        const invoice = await invoices.create({
          subscriptionId: subscription.id,
          customerId: customer.id,
          customerName: customer.name,
          amount: Number(selected.price),
          currency: selected.currency || 'USD',
          status: 'pending',
          issuedAt: today(),
          dueDate: dueDate(),
          paidAt: null,
          planName: selected.name,
        });
        const payment = await payments.create({
          invoiceId: invoice.id,
          customerId: customer.id,
          customerName: customer.name,
          amount: Number(selected.price),
          currency: selected.currency || 'USD',
          method,
          status: 'success',
          processedAt: today(),
          reference: `DEMO-${Date.now()}`,
        });
        await invoices.update(invoice.id, { status: 'paid', paidAt: today() });
        await customers.update(customer.id, { totalSpent: Number(customer.totalSpent || 0) + Number(selected.price) });
        setConfirmation(`Payment ${payment.reference} complete. Invoice ${invoice.id} is ready.`);
      }
      setSelected(null);
    } catch (checkoutError) {
      setError(checkoutError.message || 'Checkout could not be completed.');
    } finally {
      setProcessing(false);
    }
  };

  const activePlans = plans.items.filter((plan) => plan.status === 'active');
  return <div className="animate-fade-in">
    <div className="page-header"><div className="page-header-left"><h1 className="page-title">Choose your plan</h1><p className="page-subtitle">Compare options and start a subscription.</p></div></div>
    {plans.error && <div className="inline-error" role="alert">{plans.error}</div>}
    {error && <div className="inline-error" role="alert">{error}</div>}
    {confirmation && <div className="inline-success" role="status">{confirmation}<Button variant="ghost" size="sm" onClick={() => navigate('/customer/invoices')}>View invoices</Button></div>}
    {plans.loading ? <div className="card">Loading available plans...</div> : <div className="plan-browse-grid">
      {activePlans.map((plan) => <article className={`browse-plan${plan.popular ? ' is-popular' : ''}`} key={plan.id} style={{ '--plan-accent': plan.color || 'var(--primary)' }}>
        {plan.popular && <div className="browse-plan-ribbon"><Sparkles size={13} /> Popular</div>}
        <div className="browse-plan-heading"><div><h2>{plan.name}</h2><p>{plan.billingCycle === 'annual' ? 'Billed annually' : `Billed ${plan.billingCycle}`}</p></div><StatusBadge status={plan.status} /></div>
        <div className="browse-plan-price"><strong>${Number(plan.price).toFixed(2)}</strong><span> / {plan.billingCycle === 'annual' ? 'year' : plan.billingCycle.replace('ly', '')}</span></div>
        {plan.trialDays > 0 && <p className="browse-plan-trial">{plan.trialDays}-day free trial</p>}
        <ul className="browse-plan-features">{plan.features.map((feature) => <li key={feature}><Check size={15} />{feature}</li>)}</ul>
        <Button className="browse-plan-cta" variant={plan.popular ? 'primary' : 'secondary'} onClick={() => { setSelected(plan); setError(''); }}>Choose plan</Button>
      </article>)}
      {!activePlans.length && <div className="card">No plans are available right now.</div>}
    </div>}

    <Modal isOpen={!!selected} onClose={() => !processing && setSelected(null)} title="Confirm subscription" footer={<><Button variant="secondary" disabled={processing} onClick={() => setSelected(null)}>Cancel</Button><Button loading={processing} leftIcon={<CreditCard size={16} />} onClick={checkout}>Pay ${Number(selected?.price || 0).toFixed(2)}</Button></>}>
      {selected && <div className="form-stack">
        <div className="checkout-summary"><span>{selected.name} · {selected.billingCycle}</span><strong>${Number(selected.price).toFixed(2)} {selected.currency || 'USD'}</strong></div>
        <div className="input-group"><label className="input-label" htmlFor="checkout-method">Payment method</label><select id="checkout-method" className="select input" value={method} onChange={(event) => setMethod(event.target.value)}><option>Credit Card</option><option>Bank Transfer</option><option>PayPal</option></select></div>
        {apiClient.configured ? <p className="table-secondary">Payment is securely processed by your configured billing server.</p> : <p className="table-secondary">Demo checkout records a successful test payment. Configure a billing server for real payment processing.</p>}
      </div>}
    </Modal>
  </div>;
}