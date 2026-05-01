'use client';

import React from 'react';
import AppShell from '@/components/AppShell';
import { useSubscriptions } from '@/context/SubscriptionContext';
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
import StatusBadge from '@/components/ui/StatusBadge';
import CategorySpendChart from '../components/CategorySpendChart';
import ServiceLogo from '@/components/ServiceLogo';

export default function DashboardPage() {
const { subscriptions, totalMonthly, activeCount, pausedCount, trialCount } = useSubscriptions();
const { format } = useCurrency();

const annualProjection = totalMonthly * 12;

const upcomingRenewals = subscriptions
.filter((s) => s.status === 'active' && s.daysUntil <= 14)
.sort((a, b) => a.daysUntil - b.daysUntil)
.slice(0, 5);

const recentSubs = [...subscriptions].slice(0, 5);

const categoryTotals = subscriptions
.filter((s) => s.status === 'active')
.reduce<Record<string, number>>((acc, s) => {
const monthly =
s.billingCycle === 'Annual'
? s.price / 12
: s.billingCycle === 'Quarterly'
? s.price / 3
: s.price;


  acc[s.category] = (acc[s.category] ?? 0) + monthly;
  return acc;
}, {});


const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

return ( <AppShell> <div className="space-y-8 animate-fadeIn">

    <div className="flex items-center justify-between flex-wrap gap-3">
      <div>
        <h1 className="text-2xl font-700 text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Good morning, — here&apos;s your subscription overview
        </p>
      </div>
      <Link href="/add-subscription" className="btn-primary text-sm">
        + Add Subscription
      </Link>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

      <div className="bg-primary rounded-xl p-6 sm:col-span-2 border border-primary shadow-lg">
        <div className="flex items-start justify-between mb-4">
          <p className="text-sm font-600 text-blue-100 uppercase tracking-wider">
            Total Monthly Spend
          </p>
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <DollarSign size={20} className="text-white" />
          </div>
        </div>
        <p className="text-4xl font-800 text-white tabular-nums mb-2">
          {format(totalMonthly)}
        </p>
        <p className="text-sm text-blue-100">{activeCount} active subscriptions</p>
      </div>

      <div className="card rounded-xl p-5 border">
        <div className="flex items-start justify-between mb-3">
          <p className="text-xs font-600 uppercase tracking-wider text-muted-foreground">
            Active Subscriptions
          </p>
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <CreditCard size={16} className="text-primary" />
          </div>
        </div>
        <p className="text-2xl font-800 tabular-nums mb-1">{activeCount}</p>
        <p className="text-xs text-muted-foreground">
          {pausedCount} paused, {trialCount} trial
        </p>
      </div>

      <div className="card rounded-xl p-5 border">
        <div className="flex items-start justify-between mb-3">
          <p className="text-xs font-600 uppercase tracking-wider text-muted-foreground">
            Annual Projection
          </p>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
            <TrendingUp size={16} className="text-emerald-600" />
          </div>
        </div>
        <p className="text-2xl font-800 tabular-nums mb-1">
          {format(annualProjection)}
        </p>
        <p className="text-xs text-muted-foreground">Based on current subs</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <div className="flex items-start justify-between mb-3">
          <p className="text-xs font-600 uppercase tracking-wider text-amber-700">
            Renewing in 7 Days
          </p>
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
            <AlertTriangle size={16} className="text-amber-600" />
          </div>
        </div>
        <p className="text-2xl font-800 tabular-nums mb-1 text-amber-800">
          {subscriptions.filter((s) => s.daysUntil <= 7 && s.status === 'active').length}
        </p>
        <p className="text-xs text-amber-700">
          {upcomingRenewals[0]
            ? `Next: ${upcomingRenewals[0].name} in ${upcomingRenewals[0].daysUntil}d`
            : 'No renewals soon'}
        </p>
      </div>

      <div className="card rounded-xl p-5 border">
        <div className="flex items-start justify-between mb-3">
          <p className="text-xs font-600 uppercase tracking-wider text-muted-foreground">
            Spending Categories
          </p>
          <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
            <Layers size={16} className="text-purple-600" />
          </div>
        </div>
        <p className="text-2xl font-800 tabular-nums mb-1">
          {Object.keys(categoryTotals).length}
        </p>
        <p className="text-xs text-muted-foreground">
          {topCategory
            ? `${topCategory[0]} leads at ${format(topCategory[1])}`
            : 'No data'}
        </p>
      </div>

    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      <div className="lg:col-span-2">
        <CategorySpendChart />
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-700 text-foreground">Upcoming Renewals</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Next 14 days</p>
          </div>
          <Calendar size={16} className="text-muted-foreground" />
        </div>

        {upcomingRenewals.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No renewals in the next 14 days
          </p>
        ) : (
          <div className="space-y-3">
            {upcomingRenewals.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-3 rounded-lg transition-all duration-150 hover:bg-muted/60 ${
                  item.daysUntil <= 3
                    ? 'bg-amber-50 border border-amber-200'
                    : 'bg-muted/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ServiceLogo name={item.name} color={item.color} size={32} />
                  <div>
                    <p className="text-sm font-600 text-foreground flex items-center gap-1.5">
                      {item.name}
                      {item.daysUntil <= 3 && (
                        <AlertCircle size={12} className="text-amber-500" />
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.nextBilling}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-700 text-foreground tabular-nums">
                    {format(item.price)}
                  </p>
                  <span className="text-xs font-600 px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {item.daysUntil}d
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>

  </div>
</AppShell>
 );
}
