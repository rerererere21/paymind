'use client';

import React, { useState, useMemo } from 'react';
import {
Search,
Plus,
Trash2,
PauseCircle,
PlayCircle,
Loader2,
} from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';
import AddSubscriptionForm from './AddSubscriptionForm';
import ServiceLogo from '@/components/ServiceLogo';
import { useCurrency } from '@/context/CurrencyContext';
import { useSubscriptions } from '@/context/SubscriptionContext';

type Status = 'active' | 'paused' | 'cancelled' | 'trial';

interface Subscription {
id: string;
name: string;
category: string;
price: number;
nextBilling: string;
daysUntil: number;
status: Status;
color: string;
}

export default function SubscriptionTable() {

const { subscriptions, addSubscription, updateSubscription, deleteSubscription } = useSubscriptions();

const [search, setSearch] = useState('');
const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
const [addModalOpen, setAddModalOpen] = useState(false);
const [deletingId, setDeletingId] = useState<string | null>(null);
const { format } = useCurrency();

const calculateDays = (date: string) => {
  const today = new Date();
  const next = new Date(date);
  return Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

const filtered = useMemo(() => {
  return subscriptions
    .map(sub => ({
      ...sub,
      daysUntil: calculateDays(sub.nextBilling)
    }))
    .filter(sub =>
      (!search || sub.name.toLowerCase().includes(search.toLowerCase())) &&
      (!categoryFilter || sub.category === categoryFilter)
    );
}, [subscriptions, search, categoryFilter]);

const handleDelete = async (id: string) => {
  setDeletingId(id);
  await deleteSubscription(id);
  setDeletingId(null);
};

const handleToggleStatus = (id: string) => {
  const sub = subscriptions.find(s => s.id === id);
  if (!sub) return;

  updateSubscription(id, {
    status: sub.status === 'active' ? 'paused' : 'active'
  });
};

return (
<div className="space-y-4">

  <div className="card p-4 space-y-3">
    <div className="flex flex-col sm:flex-row gap-3">

      <div className="relative flex-1">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search subscriptions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-9"
        />
      </div>

      <button
        onClick={() => setAddModalOpen(true)}
        className="btn-primary"
      >
        <Plus size={16} /> Add Subscription
      </button>

    </div>

    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => setCategoryFilter(null)}
        className={`px-3 py-1 rounded-full text-sm ${!categoryFilter ? 'bg-primary text-white' : 'bg-muted'}`}
      >
        All
      </button>

      {[...new Set(subscriptions.map(s => s.category))].map(cat => (
        <button
          key={cat}
          onClick={() => setCategoryFilter(cat)}
          className={`px-3 py-1 rounded-full text-sm ${categoryFilter === cat ? 'bg-primary text-white' : 'bg-muted'}`}
        >
          {cat}
        </button>
      ))}
    </div>

  </div>

  <div className="card overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <tbody>

          {filtered.map((sub) => (
            <tr key={sub.id}>

              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <ServiceLogo name={sub.name.toLowerCase()} color={sub.color} size={40} />
                  <span>{sub.name}</span>
                </div>
              </td>

              <td>
                <span
                  onClick={() => setCategoryFilter(sub.category)}
                  className="cursor-pointer px-2 py-1 bg-muted rounded-full text-sm"
                >
                  {sub.category}
                </span>
              </td>

              <td>{format(sub.price)}</td>

              <td>
                {sub.nextBilling}
                <div className="text-xs text-gray-500">
                  {sub.daysUntil}d
                </div>
              </td>

              <td>
                <StatusBadge status={sub.status} size="sm" />
              </td>

              <td className="flex gap-2">
                <button onClick={() => handleToggleStatus(sub.id)}>
                  {sub.status === 'active' ? <PauseCircle size={14} /> : <PlayCircle size={14} />}
                </button>

                <button onClick={() => handleDelete(sub.id)}>
                  {deletingId === sub.id ? <Loader2 size={14} /> : <Trash2 size={14} />}
                </button>
              </td>

            </tr>
          ))}

        </tbody>
      </table>
    </div>
  </div>

  <Modal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} title="Add Subscription">
    <AddSubscriptionForm
      onSubmit={addSubscription}
      onCancel={() => setAddModalOpen(false)}
    />
  </Modal>

</div>
);
}
