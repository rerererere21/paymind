'use client';

import React, { useEffect, useState } from 'react';
import AppShell from '@/components/AppShell';
import { supabase } from '@/lib/supabaseClient';
import { useCurrency } from '@/context/CurrencyContext';
import Link from 'next/link';
import {
DollarSign,
CreditCard,
TrendingUp,
AlertTriangle,
Layers,
ArrowRight,
Calendar,
AlertCircle,
} from 'lucide-react';
import CategorySpendChart from '../components/CategorySpendChart';
import ServiceLogo from '@/components/ServiceLogo';

export default function DashboardPage() {

const [subscriptions, setSubscriptions] = useState<any[]>([]);
const { format } = useCurrency();

const calculateDays = (date: string) => {
  const today = new Date();
  const next = new Date(date);
  const diff = Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
};

useEffect(() => {
  const fetchData = async () => {
    const { data } = await supabase.from('bills').select('*');

    if (data) {
      const mapped = data.map((item) => ({
        id: item.id,
        name: item.title,
        category: 'Other',
        price: Number(item.amount),
        billingCycle: 'Monthly',
        nextBilling: item.due_date,
        daysUntil: calculateDays(item.due_date),
        status: 'active',
        color: '#3B82F6'
      }));

      setSubscriptions(mapped);
    }
  };

  fetchData();
}, []);

const totalMonthly = subscriptions.reduce((acc, s) => acc + s.price, 0);
const activeCount = subscriptions.length;
const pausedCount = 0;
const trialCount = 0;

const annualProjection = totalMonthly * 12;

const upcomingRenewals = subscriptions
.filter((s) => s.daysUntil >= 0 && s.daysUntil <= 14)
.sort((a, b) => a.daysUntil - b.daysUntil)
.slice(0, 5);

const categoryTotals = subscriptions.reduce((acc: any, s) => {
acc[s.category] = (acc[s.category] ?? 0) + s.price;
return acc;
}, {});

const topCategory = Object.entries(categoryTotals).sort((a: any, b: any) => b[1] - a[1])[0];

return (
<AppShell>
<div className="space-y-8 animate-fadeIn">

<div className="flex items-center justify-between flex-wrap gap-3">
  <div>
    <h1 className="text-2xl font-700 text-foreground">Dashboard</h1>
    <p className="text-sm text-muted-foreground mt-1">
      Good morning — here&apos;s your subscription overview
    </p>
  </div>
  <Link href="/add-subscription" className="btn-primary text-sm">
    + Add Subscription
  </Link>
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

  <div className="bg-primary rounded-xl p-6 sm:col-span-2 border border-primary shadow-lg">
    <p className="text-sm text-blue-100 uppercase">Total Monthly Spend</p>
    <p className="text-4xl font-800 text-white">{format(totalMonthly)}</p>
    <p className="text-sm text-blue-100">{activeCount} active subscriptions</p>
  </div>

  <div className="card p-5">
    <p>Active Subscriptions</p>
    <p className="text-2xl font-bold">{activeCount}</p>
  </div>

  <div className="card p-5">
    <p>Annual Projection</p>
    <p className="text-2xl font-bold">{format(annualProjection)}</p>
  </div>

  <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
    <p>Renewing in 7 Days</p>
    <p className="text-2xl font-bold">
      {subscriptions.filter((s) => s.daysUntil <= 7 && s.daysUntil >= 0).length}
    </p>
  </div>

</div>

<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

  <div className="lg:col-span-2">
    <CategorySpendChart />
  </div>

  <div className="card p-6">
    <h2 className="mb-4">Upcoming Renewals</h2>

    {upcomingRenewals.length === 0 ? (
      <p>No renewals in the next 14 days</p>
    ) : (
      upcomingRenewals.map((item) => (
        <div key={item.id} className="flex justify-between p-3 border-b">
          <div className="flex items-center gap-3">
            <ServiceLogo name={item.name} color={item.color} size={32} />
            <div>
              <p>{item.name}</p>
              <p className="text-sm text-gray-500">{item.nextBilling}</p>
            </div>
          </div>

          <div className="text-right">
            <p>{format(item.price)}</p>
            <p className="text-xs">{item.daysUntil} days</p>
          </div>
        </div>
      ))
    )}
  </div>

</div>

</div>
</AppShell>
);
}
