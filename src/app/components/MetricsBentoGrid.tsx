'use client';

import React from 'react';

import {
  DollarSign,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  Layers,
} from 'lucide-react';

import {
  useSubscriptions
} from '@/context/SubscriptionContext';

import {
  useCurrency
} from '@/context/CurrencyContext';

export default function MetricsBentoGrid() {

  const {
    subscriptions
  } = useSubscriptions();

  const {
    format
  } = useCurrency();

  const activeSubscriptions =
    subscriptions.filter(
      (s) => s.status === 'active'
    );

  const totalMonthly =
    activeSubscriptions.reduce(
      (sum, sub) =>
        sum + Number(sub.price || 0),
      0
    );

  const annualProjection =
    totalMonthly * 12;

  const upcomingRenewals =
    activeSubscriptions.filter((sub) => {

      if (!sub.nextBilling)
        return false;

      const today = new Date();

      const renewalDate =
        new Date(sub.nextBilling);

      const diffTime =
        renewalDate.getTime() -
        today.getTime();

      const diffDays =
        Math.ceil(
          diffTime /
          (1000 * 60 * 60 * 24)
        );

      return diffDays >= 0 &&
             diffDays <= 7;

    });

  const categoryTotals =
    activeSubscriptions.reduce(
      (acc, sub) => {

        const category =
          sub.category || 'Other';

        acc[category] =
          (acc[category] || 0) +
          Number(sub.price || 0);

        return acc;

      },
      {} as Record<string, number>
    );

  const topCategory =
    Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])[0];

  return (

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-5">

      <div className="bg-primary rounded-xl p-6 sm:col-span-2 lg:col-span-2 border border-primary shadow-blue">

        <div className="flex items-start justify-between mb-4">

          <p className="text-sm font-600 text-blue-100 uppercase tracking-wider">
            Total Monthly Spend
          </p>

          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">

            <DollarSign
              size={20}
              className="text-white"
            />

          </div>

        </div>

        <p className="text-4xl font-800 text-white tabular-nums mb-2">

          {format(totalMonthly)}

        </p>

        <p className="text-sm text-blue-100">

          {activeSubscriptions.length} active subscriptions

        </p>

      </div>

      <div className="card bg-card rounded-xl p-5 border">

        <div className="flex items-start justify-between mb-3">

          <p className="text-xs font-600 uppercase tracking-wider text-muted-foreground">

            Active Subscriptions

          </p>

          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">

            <CreditCard
              size={16}
              className="text-primary"
            />

          </div>

        </div>

        <p className="text-2xl font-800 tabular-nums mb-1 text-foreground">

          {activeSubscriptions.length}

        </p>

        <p className="text-xs text-muted-foreground">

          0 paused, 0 trial

        </p>

      </div>

      <div className="card bg-card rounded-xl p-5 border">

        <div className="flex items-start justify-between mb-3">

          <p className="text-xs font-600 uppercase tracking-wider text-muted-foreground">

            Annual Projection

          </p>

          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">

            <TrendingUp
              size={16}
              className="text-emerald-600"
            />

          </div>

        </div>

        <p className="text-2xl font-800 tabular-nums mb-1 text-foreground">

          {format(annualProjection)}

        </p>

        <p className="text-xs text-muted-foreground">

          Based on current subs

        </p>

      </div>

      <div className="card bg-amber-50 border-amber-200 rounded-xl p-5 border">

        <div className="flex items-start justify-between mb-3">

          <p className="text-xs font-600 uppercase tracking-wider text-amber-900">

            Renewing in 7 Days

          </p>

          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">

            <AlertTriangle
              size={16}
              className="text-amber-600"
            />

          </div>

        </div>

        <p className="text-2xl font-800 tabular-nums mb-1 text-amber-800">

          {upcomingRenewals.length}

        </p>

        <p className="text-xs text-amber-700">

          {upcomingRenewals[0]
            ? `Next: ${upcomingRenewals[0].name}`
            : 'No renewals soon'
          }

        </p>

      </div>

      <div className="card bg-card rounded-xl p-5 border">

        <div className="flex items-start justify-between mb-3">

          <p className="text-xs font-600 uppercase tracking-wider text-muted-foreground">

            Spending Categories

          </p>

          <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">

            <Layers
              size={16}
              className="text-purple-600"
            />

          </div>

        </div>

        <p className="text-2xl font-800 tabular-nums mb-1 text-foreground">

          {Object.keys(categoryTotals).length}

        </p>

        <p className="text-xs text-muted-foreground">

          {topCategory
            ? `${topCategory[0]} leads at ${format(topCategory[1])}`
            : 'No data'
          }

        </p>

      </div>

    </div>

  );

}