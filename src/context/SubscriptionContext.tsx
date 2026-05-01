'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

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

const STORAGE_KEY = 'paymind_subscriptions';

const defaultSubscriptions: Subscription[] = [
{
id: 'sub-001',
name: 'Netflix',
category: 'Entertainment',
price: 40,
billingCycle: 'Monthly',
nextBilling: 'May 2, 2026',
daysUntil: 2,
status: 'active',
color: '#E50914',
startDate: 'Jan 1, 2024',
website: 'netflix.com'
},
{
id: 'sub-002',
name: 'Spotify',
category: 'Entertainment',
price: 20,
billingCycle: 'Monthly',
nextBilling: 'May 4, 2026',
daysUntil: 4,
status: 'active',
color: '#1DB954',
startDate: 'Mar 15, 2023',
website: 'spotify.com'
},
{
id: 'sub-003',
name: 'Disney+',
category: 'Entertainment',
price: 30,
billingCycle: 'Monthly',
nextBilling: 'May 7, 2026',
daysUntil: 7,
status: 'active',
color: '#0063E5',
startDate: 'Jun 10, 2022',
website: 'disneyplus.com'
},
{
id: 'sub-004',
name: 'YouTube Premium',
category: 'Entertainment',
price: 23,
billingCycle: 'Monthly',
nextBilling: 'May 11, 2026',
daysUntil: 11,
status: 'active',
color: '#FF0000',
startDate: 'Aug 5, 2024',
website: 'youtube.com'
},
{
id: 'sub-005',
name: 'Shahid',
category: 'Entertainment',
price: 29,
billingCycle: 'Monthly',
nextBilling: 'May 14, 2026',
daysUntil: 14,
status: 'active',
color: '#E11D48',
startDate: 'Feb 20, 2023',
website: 'shahid.net'
},
{
id: 'sub-006',
name: 'STC TV',
category: 'Entertainment',
price: 25,
billingCycle: 'Monthly',
nextBilling: 'May 18, 2026',
daysUntil: 18,
status: 'active',
color: '#6B21A8',
startDate: 'Nov 1, 2024',
website: 'stctv.com.sa'
},
{
id: 'sub-007',
name: 'Apple Music',
category: 'Entertainment',
price: 19,
billingCycle: 'Monthly',
nextBilling: 'May 22, 2026',
daysUntil: 22,
status: 'active',
color: '#FA233B',
startDate: 'Apr 3, 2025',
website: 'apple.com'
},
{
id: 'sub-008',
name: 'iCloud',
category: 'Cloud Storage',
price: 4,
billingCycle: 'Monthly',
nextBilling: 'May 28, 2026',
daysUntil: 28,
status: 'active',
color: '#3B82F6',
startDate: 'Apr 28, 2026',
website: 'icloud.com'
},
{
id: 'sub-009',
name: 'Adobe Creative Cloud',
category: 'Productivity',
price: 55,
billingCycle: 'Monthly',
nextBilling: 'Jun 1, 2026',
daysUntil: 32,
status: 'active',
color: '#FF0000',
startDate: 'Sep 12, 2024',
website: 'adobe.com'
}
];

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
const [subscriptions, setSubscriptions] = useState<Subscription[]>(defaultSubscriptions);
const [hydrated, setHydrated] = useState(false);

useEffect(() => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      setSubscriptions(JSON.parse(stored));
    } else {
      setSubscriptions(defaultSubscriptions);
    }

  } catch {
    setSubscriptions(defaultSubscriptions);
  }

  setHydrated(true);
}, []);

useEffect(() => {
if (hydrated) {
try {
localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
} catch {}
}
}, [subscriptions, hydrated]);

const addSubscription = useCallback((data: Omit<Subscription, 'id' | 'daysUntil' | 'color'>) => {
const newSub: Subscription = {
...data,
id: `sub-${Date.now()}`,
daysUntil: 30,
color: CATEGORY_COLORS[data.category] ?? '#3B82F6',
};
setSubscriptions((prev) => [newSub, ...prev]);
}, []);

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
value={{ subscriptions, addSubscription, updateSubscription, deleteSubscription, toggleStatus, totalMonthly, activeCount, pausedCount, trialCount }}
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
