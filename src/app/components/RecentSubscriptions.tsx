"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import { supabase } from '@/lib/supabaseClient';

export default function RecentSubscriptions() {

  const [recentSubs, setRecentSubs] = useState<any[]>([])

  useEffect(() => {
    const fetchSubs = async () => {
      const { data } = await supabase.from('bills').select('*')
      if (data) setRecentSubs(data)
    }

    fetchSubs()
  }, [])

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <h2 className="text-base font-700 text-foreground">Recent Subscriptions</h2>
        <Link href="/subscription-management" className="flex items-center gap-1.5 text-sm font-600 text-primary">
          View all <ArrowRight size={14} />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <tbody>
            {recentSubs.map((sub) => (
              <tr key={sub.id}>
                <td className="px-6 py-3">{sub.title}</td>
                <td className="px-4 py-3">{sub.amount}</td>
                <td className="px-4 py-3">{sub.due_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}