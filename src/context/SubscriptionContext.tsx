'use client';

import { useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import React, { createContext, useContext, useState, useCallback } from 'react';

export type Status = 'active' | 'paused' | 'cancelled' | 'trial';
export type BillingCycle = 'Monthly' | 'Annual' | 'Quarterly' | 'Weekly';

export interface Subscription {
  id: string;
  name: string;
  category: string;
  price: number;
  billingCycle: BillingCycle;
  nextBilling: string;
  daysUntil: number;
  status: Status;
  color: string;
  startDate: string;
  website?: string;
  notes?: string;
}

interface SubscriptionContextValue {
  subscriptions: Subscription[];
  addSubscription: (data: Omit<Subscription, 'id' | 'daysUntil' | 'color'>) => void;
  updateSubscription: (id: string, data: Partial<Subscription>) => void;
  deleteSubscription: (id: string) => void;
  toggleStatus: (id: string) => void;
  totalMonthly: number;
  activeCount: number;
  pausedCount: number;
  trialCount: number;
}

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

const CATEGORY_COLORS: Record<string, string> = {
  Entertainment: '#E11D48',
  Productivity: '#3B82F6',
  'Cloud Storage': '#0061FF',
  Health: '#5B8DEF',
  'News & Media': '#374151',
  'Developer Tools': '#24292E',
  Education: '#58CC02',
  Finance: '#10B981',
  Design: '#F24E1E',
  Other: '#6B7280',
};

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])

useEffect(() => {
  const fetchSubscriptions = async () => {
    const { data } = await supabase.from('bills').select('*')

    if (data) {
      const mapped = data.map((item) => ({
        id: item.id,
        name: item.title,
        category: 'Other',
        price: item.amount,
        billingCycle: 'Monthly',
        nextBilling: item.due_date,
        daysUntil: 30,
        status: 'active',
        color: '#3B82F6',
        startDate: item.due_date
      }))

      setSubscriptions(mapped)
    }
  }

  fetchSubscriptions()
}, [])

const addSubscription = useCallback(async (data: Omit<Subscription, 'id' | 'daysUntil' | 'color'>) => {

  const { data: inserted, error } = await supabase.from('bills').insert([
    {
      title: data.name,
      amount: data.price,
      due_date: data.nextBilling
    }
  ]).select()

  if (inserted) {
    const newSub: Subscription = {
      ...data,
      id: inserted[0].id,
      daysUntil: 30,
      color: CATEGORY_COLORS[data.category] ?? '#3B82F6',
    }

    setSubscriptions((prev) => [newSub, ...prev])
  }

}, [])

  const updateSubscription = useCallback((id: string, data: Partial<Subscription>) => {
    setSubscriptions((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
  }, []);

  const deleteSubscription = useCallback((id: string) => {
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const toggleStatus = useCallback((id: string) => {
    setSubscriptions((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        return { ...s, status: s.status === 'active' ? 'paused' : 'active' };
      })
    );
  }, []);

  const totalMonthly = subscriptions
    .filter((s) => s.status === 'active')
    .reduce((acc, s) => {
      if (s.billingCycle === 'Annual') return acc + s.price / 12;
      if (s.billingCycle === 'Quarterly') return acc + s.price / 3;
      if (s.billingCycle === 'Weekly') return acc + s.price * 4.33;
      return acc + s.price;
    }, 0);

  const activeCount = subscriptions.filter((s) => s.status === 'active').length;
  const pausedCount = subscriptions.filter((s) => s.status === 'paused').length;
  const trialCount = subscriptions.filter((s) => s.status === 'trial').length;

  return (
    <SubscriptionContext.Provider
      value={{
        subscriptions,
        addSubscription,
        updateSubscription,
        deleteSubscription,
        toggleStatus,
        totalMonthly,
        activeCount,
        pausedCount,
        trialCount
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscriptions() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscriptions must be used within SubscriptionProvider');
  return ctx;
}