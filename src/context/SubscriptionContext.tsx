'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

import { supabase } from '@/lib/supabaseClient';

export type Status =
  | 'active'
  | 'paused'
  | 'cancelled'
  | 'trial';

export type BillingCycle =
  | 'Monthly'
  | 'Annual'
  | 'Quarterly'
  | 'Weekly';

export interface Subscription {
  id: string;
  user_id?: string;
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

  addSubscription: (
    data: Omit<
      Subscription,
      'id' | 'daysUntil' | 'color'
    >
  ) => Promise<void>;

  updateSubscription: (
    id: string,
    data: Partial<Subscription>
  ) => Promise<void>;

  deleteSubscription: (
    id: string
  ) => Promise<void>;

  toggleStatus: (
    id: string
  ) => Promise<void>;

  totalMonthly: number;

  activeCount: number;

  pausedCount: number;

  trialCount: number;

  refreshSubscriptions: () => Promise<void>;
}

const SubscriptionContext =
  createContext<SubscriptionContextValue | null>(null);

const CATEGORY_COLORS: Record<
  string,
  string
> = {
  Entertainment: '#E11D48',
  Productivity: '#3B82F6',
  'Cloud Storage': '#0061FF',
  Health: '#5B8DEF',
  'News & Media': '#374151',
  'Developer Tools': '#24292E',
  Education: '#58CC02',
  Finance: '#10B981',
  Design: '#F24E1E',
  Food: '#F59E0B',
  Utilities: '#14B8A6',
  Insurance: '#6366F1',
  Transportation: '#0EA5E9',
  Healthcare: '#EC4899',
  Housing: '#8B5CF6',
  Other: '#6B7280',
};

export function SubscriptionProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [
    subscriptions,
    setSubscriptions,
  ] = useState<Subscription[]>([]);

  const refreshSubscriptions =
    useCallback(async () => {

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {

        setSubscriptions([]);

        return;

      }

      const {
        data,
        error,
      } = await supabase
        .from('bills')
        .select('*')
        .eq('user_id', user.id)
        .order('due_date', {
          ascending: true,
        });

      if (error) {

        console.log(error);

        return;

      }

      const formattedSubscriptions:
        Subscription[] =
        (data || []).map(
          (bill: any) => {

            const dueDate =
              new Date(
                bill.due_date
              );

            const today =
              new Date();

            const diffTime =
              dueDate.getTime() -
              today.getTime();

            const daysUntil =
              Math.ceil(
                diffTime /
                (
                  1000 *
                  60 *
                  60 *
                  24
                )
              );

            let mappedStatus: Status =
              'active';

            if (
              bill.bill_status ===
              'cancelled'
            ) {

              mappedStatus =
                'cancelled';

            } else if (
              bill.bill_status ===
              'paused'
            ) {

              mappedStatus =
                'paused';

            } else if (
              bill.bill_status ===
              'trial'
            ) {

              mappedStatus =
                'trial';

            }

            return {

              id: bill.id,

              user_id:
                bill.user_id,

              name:
                bill.title,

              category:
                bill.category ||
                'Other',

              price:
                Number(
                  bill.amount || 0
                ),

              billingCycle:
                'Monthly',

              nextBilling:
                bill.due_date,

              daysUntil,

              status:
                mappedStatus,

              color:
                CATEGORY_COLORS[
                  bill.category
                ] || '#3B82F6',

              startDate:
                bill.created_at || '',

              website: '',

              notes:
                bill.notes || '',

            };

          }
        );

      setSubscriptions(
        formattedSubscriptions
      );

    }, []);

  useEffect(() => {

    refreshSubscriptions();

  }, [refreshSubscriptions]);

  const addSubscription =
    useCallback(
      async (
        data: Omit<
          Subscription,
          'id' |
          'daysUntil' |
          'color'
        >
      ) => {

        const {
          data: { user },
        } =
          await supabase.auth.getUser();

        if (!user) return;

        const {
          error,
        } = await supabase
          .from('bills')
          .insert({

            user_id:
              user.id,

            title:
              data.name,

            amount:
              Number(
                data.price
              ),

            due_date:
              data.nextBilling,

            category:
              data.category,

            notes:
              data.notes || '',

            bill_status:
              data.status ===
              'active'
                ? 'pending'
                : data.status,

            is_recurring:
              true,

          });

        if (error) {

          console.log(error);

          return;

        }

        await refreshSubscriptions();

      },
      [refreshSubscriptions]
    );

  const updateSubscription =
    useCallback(
      async (
        id: string,
        data: Partial<Subscription>
      ) => {

        await supabase
          .from('bills')
          .update({

            title:
              data.name,

            amount:
              data.price,

            category:
              data.category,

            notes:
              data.notes,

            bill_status:
              data.status ===
              'active'
                ? 'pending'
                : data.status,

          })
          .eq('id', id);

        await refreshSubscriptions();

      },
      [refreshSubscriptions]
    );

  const deleteSubscription =
    useCallback(
      async (id: string) => {

        await supabase
          .from('bills')
          .delete()
          .eq('id', id);

        await refreshSubscriptions();

      },
      [refreshSubscriptions]
    );

  const toggleStatus =
    useCallback(
      async (id: string) => {

        const sub =
          subscriptions.find(
            (s) => s.id === id
          );

        if (!sub) return;

        const newStatus =
          sub.status === 'active'
            ? 'paused'
            : 'pending';

        await supabase
          .from('bills')
          .update({
            bill_status:
              newStatus,
          })
          .eq('id', id);

        await refreshSubscriptions();

      },
      [
        subscriptions,
        refreshSubscriptions,
      ]
    );

  const totalMonthly =
    subscriptions
      .filter(
        (s) =>
          s.status ===
          'active'
      )
      .reduce(
        (acc, s) =>
          acc + s.price,
        0
      );

  const activeCount =
    subscriptions.filter(
      (s) =>
        s.status ===
        'active'
    ).length;

  const pausedCount =
    subscriptions.filter(
      (s) =>
        s.status ===
        'paused'
    ).length;

  const trialCount =
    subscriptions.filter(
      (s) =>
        s.status ===
        'trial'
    ).length;

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

        trialCount,

        refreshSubscriptions,

      }}
    >

      {children}

    </SubscriptionContext.Provider>

  );

}

export function useSubscriptions() {

  const ctx =
    useContext(
      SubscriptionContext
    );

  if (!ctx) {

    throw new Error(
      'useSubscriptions must be used within SubscriptionProvider'
    );

  }

  return ctx;

}