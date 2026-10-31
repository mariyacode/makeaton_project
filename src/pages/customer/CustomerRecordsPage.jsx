import React, { useMemo, useState } from 'react';
import { CreditCard, FileText, Receipt } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { Button } from '../../components/common/Button.jsx';
import { DataTable } from '../../components/common/DataTable.jsx';
import { Modal } from '../../components/common/Modal.jsx';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';
import { useCollection } from '../../hooks/useCollection.js';
import { apiClient } from '../../services/apiClient.js';
import { mockCustomers, mockInvoices, mockPayments, mockSubscriptions } from '../../data/mockData.js';

const today = () => new Date().toISOString().slice(0, 10);

export default function CustomerRecordsPage({ type }) {
  const { user } = useAuth();
  const customers = useCollection('customers', mockCustomers);
  const subscriptions = useCollection('subscriptions', mockSubscriptions);
  const invoices = useCollection('invoices', mockInvoices);
  const payments = useCollection('payments', mockPayments);
  const [selected, setSelected] = useState(null);
  const [paying, setPaying] = useState(null);
  const [method, setMethod] = useState('Credit Card');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const customer = customers.items.find((item) => item.email?.toLowerCase() === user.email?.toLowerCase());
  const records = useMemo(() => {
    const source = type === 'subscriptions' ? subscriptions.items : type === 'invoices' ? invoices.items : payments.items;
    return customer ? source.filter((item) => String(item.customerId) === String(customer.id)) : [];
  }, [customer, type, subscriptions.items, invoices.items, payments.items]);

  const payInvoice = async () => {
    setBusy(true);
    setError('');
    try {
      if (apiClient.configured) {
        await apiClient.request('/payments', { method: 'POST', body: { invoiceId: paying.id, paymentMethod: method } });
      } else {
        await payments.create({
          invoiceId: paying.id,
          customerId: customer.id,
          customerName: customer.name,
          amount: Number(paying.amount),
          currency: paying.currency || 'USD',
          method,
          status: 'success',
          processedAt: today(),
          reference: `DEMO-${Date.now()}`,
        });
        await invoices.update(paying.id, { status: 'paid', paidAt: today() });
      }
      await Promise.all([invoices.reload(), payments.reload()]);
      setPaying(null);
    } catch (requestError) {
      setError(requestError.message || 'Payment could not be completed.');
    } finally {
      setBusy(false);
    }
  };

  const heading = type === 'subscriptions' ? 'My subscriptions' : type === 'invoices' ? 'My invoices' : 'Payment history';
  const columns = type === 'subscriptions' ? [
    { key: 'planName', label: 'Plan', sortable: true },
    { key: 'billingCycle', label: 'Billing cycle', render: (value) => value?.replace(/^./, (letter) => letter.toUpperCase()) },
    { key: 'amount', label: 'Amount', render: (value, row) => `$${Number(value).toFixed(2)} / ${row.billingCycle}` },
    { key: 'startDate', label: 'Started', sortable: true },
    { key: 'nextBillingDate', label: 'Next billing' },
    { key: 'status', label: 'Status', render: (value) => <StatusBadge status={value} /> },
  ] : type === 'invoices' ? [
    { key: 'id', label: 'Invoice', render: (value) => <span className="mono-label">{String(value).toUpperCase()}</span> },
    { key: 'planName', label: 'Plan' },
    { key: 'amount', label: 'Amount', render: (value) => `$${Number(value).toFixed(2)}` },
    { key: 'issuedAt', label: 'Issued', sortable: true },
    { key: 'dueDate', label: 'Due date', sortable: true },
    { key: 'status', label: 'Status', render: (value) => <StatusBadge status={value} /> },
    { key: 'id', label: 'Actions', render: (_, row) => <div className="table-actions"><button className="btn btn-secondary btn-sm" onClick={() => setSelected(row)}>View</button>{row.status !== 'paid' && <Button size="sm" onClick={() => setPaying(row)}>Pay now</Button>}</div> },
  ] : [
    { key: 'reference', label: 'Transaction', sortable: true, render: (value) => <span className="mono-label">{value}</span> },
    { key: 'invoiceId', label: 'Invoice', render: (value) => String(value).toUpperCase() },
    { key: 'amount', label: 'Amount', render: (value) => `$${Number(value).toFixed(2)}` },
    { key: 'method', label: 'Method' },
    { key: 'processedAt', label: 'Date', sortable: true },
    { key: 'status', label: 'Status', render: (value) => <StatusBadge status={value} /> },
  ];

  const loading = customers.loading || (type === 'subscriptions' ? subscriptions.loading : type === 'invoices' ? invoices.loading : payments.loading);
  return <div className="animate-fade-in">
    <div className="page-header"><div className="page-header-left"><h1 className="page-title">{heading}</h1><p className="page-subtitle">{records.length} record{records.length === 1 ? '' : 's'}</p></div></div>
    {error && <div className="inline-error" role="alert">{error}</div>}
    <DataTable columns={columns} data={records} loading={loading} emptyTitle={`No ${type} yet`} emptyDesc={type === 'subscriptions' ? 'Browse plans to start a subscription.' : 'Your billing records will appear here.'} emptyIcon={type === 'subscriptions' ? CreditCard : type === 'invoices' ? FileText : Receipt} />
    <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={`Invoice ${String(selected?.id || '').toUpperCase()}`} footer={<Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>}>
      {selected && <div className="invoice-detail"><div><span>Plan</span><strong>{selected.planName}</strong></div><div><span>Amount due</span><strong>${Number(selected.amount).toFixed(2)} {selected.currency || 'USD'}</strong></div><div><span>Issued</span><strong>{selected.issuedAt}</strong></div><div><span>Due date</span><strong>{selected.dueDate}</strong></div><div><span>Status</span><StatusBadge status={selected.status} /></div></div>}
    </Modal>
    <Modal isOpen={!!paying} onClose={() => !busy && setPaying(null)} title="Pay invoice" footer={<><Button variant="secondary" disabled={busy} onClick={() => setPaying(null)}>Cancel</Button><Button loading={busy} onClick={payInvoice}>Pay ${Number(paying?.amount || 0).toFixed(2)}</Button></>}>
      {paying && <div className="form-stack"><div className="checkout-summary"><span>Invoice {String(paying.id).toUpperCase()}</span><strong>${Number(paying.amount).toFixed(2)}</strong></div><div className="input-group"><label htmlFor="invoice-payment-method" className="input-label">Payment method</label><select id="invoice-payment-method" className="select input" value={method} onChange={(event) => setMethod(event.target.value)}><option>Credit Card</option><option>Bank Transfer</option><option>PayPal</option></select></div>{!apiClient.configured && <p className="table-secondary">Demo mode records a successful test payment.</p>}</div>}
    </Modal>
  </div>;
}