// ============================================================
// Analytics Page  (Admin)
// ============================================================
import React, { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { mockPlans, mockSubscriptions, mockPayments } from '../../data/mockData.js';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useCollection } from '../../hooks/useCollection.js';

const COLORS = ['#2563EB', '#16A34A', '#F59E0B', '#7C3AED', '#DC2626'];

function KPICard({ label, value, change, changeLabel, prefix = '' }) {
  const positive = change >= 0;
  return (
    <div className="card" style={{ display:'flex', flexDirection:'column', gap:'0.625rem' }}>
      <div style={{ fontSize:'0.8125rem', fontWeight:500, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'0.04em' }}>{label}</div>
      <div style={{ fontSize:'2rem', fontWeight:800, color:'var(--text-main)', lineHeight:1 }}>{prefix}{typeof value === 'number' && prefix==='$' ? value.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}) : value}</div>
      <div style={{ display:'flex', alignItems:'center', gap:'0.375rem', fontSize:'0.8125rem', fontWeight:600, color: positive ? 'var(--success)' : 'var(--error)' }}>
        {positive ? <TrendingUp size={14}/> : <TrendingDown size={14}/>}
        {positive ? '+' : ''}{change}% {changeLabel || 'vs last period'}
      </div>
    </div>
  );
}

function ChartCard({ title, badge, children }) {
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">{title}</span>
        {badge && <span className="badge badge-info">{badge}</span>}
      </div>
      {children}
    </div>
  );
}

function CustomTooltip({ active, payload, label, prefix = '' }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'0.625rem 0.875rem', boxShadow:'var(--shadow-md)', fontSize:'0.8125rem' }}>
      <p style={{ fontWeight:600, color:'var(--text-main)', marginBottom:'0.25rem' }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color:p.color }}>{p.name}: <strong>{prefix}{p.value?.toLocaleString()}</strong></p>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('6m');
  const subscriptions = useCollection('subscriptions', mockSubscriptions).items;
  const plans = useCollection('plans', mockPlans).items;
  const payments = useCollection('payments', mockPayments).items;
  const monthCount = period === '1m' ? 1 : period === '3m' ? 3 : period === '1y' ? 12 : 6;
  const months = Array.from({ length: monthCount }, (_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (monthCount - index - 1), 1);
    return date;
  });
  const monthKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  const chartData = months.map((date) => {
    const key = monthKey(date);
    const monthPayments = payments.filter((payment) => payment.status === 'success' && payment.processedAt?.slice(0, 7) === key);
    const started = subscriptions.filter((subscription) => subscription.startDate?.slice(0, 7) === key);
    return {
      month: date.toLocaleString('en-US', { month: 'short' }),
      revenue: monthPayments.reduce((sum, payment) => sum + Number(payment.amount), 0),
      subscriptions: started.length,
      active: subscriptions.filter((subscription) => ['active', 'trialing'].includes(subscription.status) && subscription.startDate <= `${key}-31`).length,
      new: started.length,
      cancelled: subscriptions.filter((subscription) => subscription.status === 'cancelled' && subscription.cancelledAt?.slice(0, 7) === key).length,
    };
  });
  const activeSubscriptions = subscriptions.filter((subscription) => ['active', 'trialing'].includes(subscription.status));
  const mrr = activeSubscriptions.reduce((sum, subscription) => sum + Number(subscription.amount) / (subscription.billingCycle === 'annual' ? 12 : subscription.billingCycle === 'weekly' ? 0.23 : 1), 0);
  const revenueByPlan = plans.map((plan) => ({
    name: plan.name,
    revenue: activeSubscriptions.filter((subscription) => subscription.planId === plan.id).reduce((sum, subscription) => sum + Number(subscription.amount) / (subscription.billingCycle === 'annual' ? 12 : subscription.billingCycle === 'weekly' ? 0.23 : 1), 0),
    color: plan.color || COLORS[plans.indexOf(plan) % COLORS.length],
  })).filter((item) => item.revenue > 0);
  const planDistData = revenueByPlan.map((item) => ({ name: item.name, value: activeSubscriptions.filter((subscription) => plans.find((plan) => plan.name === item.name)?.id === subscription.planId).length }));
  const maxPlanRevenue = Math.max(1, ...revenueByPlan.map((item) => item.revenue));
  const churnRate = subscriptions.length ? (subscriptions.filter((subscription) => subscription.status === 'cancelled').length / subscriptions.length) * 100 : 0;
  const avgRevenue = subscriptions.length ? mrr / subscriptions.length : 0;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">Business performance overview</p>
        </div>
        <select className="select" value={period} onChange={e=>setPeriod(e.target.value)} id="analytics-period-filter">
          <option value="1m">Last Month</option>
          <option value="3m">Last 3 Months</option>
          <option value="6m">Last 6 Months</option>
          <option value="1y">Last Year</option>
        </select>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4" style={{ marginBottom:'1.75rem' }}>
        <KPICard label="Monthly Recurring Revenue" value={mrr} change={0} prefix="$" />
        <KPICard label="Active Subscriptions"       value={activeSubscriptions.length} change={0} />
        <KPICard label="Churn Rate"                 value={`${churnRate.toFixed(1)}%`} change={0} />
        <KPICard label="Avg Revenue per User"        value={avgRevenue} change={0} prefix="$" />
      </div>

      {/* Revenue + MRR */}
      <div className="grid grid-cols-2" style={{ marginBottom:'1.5rem' }}>
        <ChartCard title="Revenue Overview" badge="6 months">
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="revenueGradA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#2563EB" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false}/>
              <XAxis dataKey="month" tick={{ fontSize:12, fill:'var(--text-secondary)' }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize:12, fill:'var(--text-secondary)' }} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}`}/>
              <Tooltip content={<CustomTooltip prefix="$"/>}/>
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#2563EB" strokeWidth={2.5} fill="url(#revenueGradA)" dot={{ fill:'#2563EB', r:4 }} activeDot={{ r:6 }}/>
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="MRR Growth" badge="Monthly">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData.map((item) => ({ ...item, mrr: item.active * (activeSubscriptions.length ? mrr / activeSubscriptions.length : 0) }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false}/>
              <XAxis dataKey="month" tick={{ fontSize:12, fill:'var(--text-secondary)' }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize:12, fill:'var(--text-secondary)' }} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}`}/>
              <Tooltip content={<CustomTooltip prefix="$"/>}/>
              <Line type="monotone" dataKey="mrr" name="MRR" stroke="#16A34A" strokeWidth={2.5} dot={{ fill:'#16A34A', r:4 }} activeDot={{ r:6 }}/>
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Subscriptions + Plan Breakdown */}
      <div className="grid grid-cols-2" style={{ marginBottom:'1.5rem' }}>
        <ChartCard title="Subscription Growth">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false}/>
              <XAxis dataKey="month" tick={{ fontSize:12, fill:'var(--text-secondary)' }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize:12, fill:'var(--text-secondary)' }} axisLine={false} tickLine={false}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Legend wrapperStyle={{ fontSize:'0.8125rem' }}/>
              <Bar dataKey="active"    name="Active"    fill="#2563EB" radius={[4,4,0,0]}/>
              <Bar dataKey="new"       name="New"       fill="#16A34A" radius={[4,4,0,0]}/>
              <Bar dataKey="cancelled" name="Cancelled" fill="#DC2626" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Plan Distribution">
          <div style={{ display:'flex', alignItems:'center', gap:'2rem', padding:'1rem 0' }}>
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie data={planDistData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {planDistData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
                </Pie>
                <Tooltip formatter={(v,n) => [v + ' subs', n]}/>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex:1 }}>
                {planDistData.map((item, i) => (
                <div key={item.name} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0.5rem 0', borderBottom:'1px solid var(--border)' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                    <div style={{ width:12, height:12, borderRadius:3, background:COLORS[i%COLORS.length], flexShrink:0 }}/>
                    <span style={{ fontSize:'0.875rem', color:'var(--text-main)' }}>{item.name}</span>
                  </div>
                  <span style={{ fontWeight:600, color:COLORS[i%COLORS.length] }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Progress bars – plan revenue breakdown */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Revenue by Plan</span>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          {revenueByPlan.map(item => (
            <div key={item.name} className="progress-bar-wrapper">
              <div className="progress-bar-label">
                <span>{item.name}</span>
                <strong>${item.revenue.toFixed(2)}</strong>
              </div>
              <div className="progress-bar-track">
                <div
                  className="progress-bar-fill"
                  style={{ width:`${(item.revenue/maxPlanRevenue)*100}%`, background:item.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
