'use client';

import React, { useState } from 'react';

import { useRouter } from 'next/navigation';

import AppShell from '@/components/AppShell';

import AddSubscriptionForm from '../subscription-management/components/AddSubscriptionForm';

export default function AddSubscriptionPage() {

  const router = useRouter();

  const [saved, setSaved] = useState(false);

  return (

    <AppShell>

      <div className="max-w-6xl mx-auto px-6 pt-6 pb-10">

        {/* Form */}

        <div className="bg-card border border-border rounded-3xl shadow-sm p-8">

          <AddSubscriptionForm
            onSuccess={() => {

              setSaved(true);

              router.push('/subscription-management');

            }}
          />

        </div>

      </div>

    </AppShell>

  );

}