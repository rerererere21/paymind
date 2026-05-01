'use client';

import React, { useState, useMemo } from 'react';
import {
Search,
Plus,
Edit2,
Trash2,
PauseCircle,
PlayCircle,
ChevronUp,
ChevronDown,
Filter,
X,
Loader2,
AlertTriangle,
} from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import AddSubscriptionForm from './AddSubscriptionForm';
import { CreditCard } from 'lucide-react';
import ServiceLogo from '@/components/ServiceLogo';
import { useCurrency } from '@/context/CurrencyContext';
import { useSubscriptions } from '@/context/SubscriptionContext';

type Status = 'active' | 'paused' | 'cancelled' | 'trial';
type BillingCycle = 'Monthly' | 'Annual' | 'Quarterly' | 'Weekly';

interface Subscription {
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

const categories = ['All', 'Entertainment', 'Productivity', 'Cloud Storage'];
const statusFilters = ['All', 'Active', 'Paused', 'Trial', 'Cancelled'];

type SortKey = 'name' | 'price' | 'nextBilling' | 'daysUntil' | 'status';

export default function SubscriptionTable() {
const { subscriptions, addSubscription, updateSubscription, deleteSubscription } = useSubscriptions();

const [search, setSearch] = useState('');
const [categoryFilter, setCategoryFilter] = useState('All');
const [statusFilter, setStatusFilter] = useState('All');
const [sortKey, setSortKey] = useState<SortKey>('daysUntil');
const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
const [addModalOpen, setAddModalOpen] = useState(false);
const [editSub, setEditSub] = useState<Subscription | null>(null);
const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
const [deletingId, setDeletingId] = useState<string | null>(null);
const [deletingRows, setDeletingRows] = useState<Set<string>>(new Set());
const { format } = useCurrency();

const filtered = useMemo(() => {
let result = [...subscriptions];

```
if (search) {
  const q = search.toLowerCase();
  result = result.filter(
    (s) => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
  );
}

if (categoryFilter !== 'All') {
  result = result.filter((s) => s.category === categoryFilter);
}

if (statusFilter !== 'All') {
  result = result.filter((s) => s.status.toLowerCase() === statusFilter.toLowerCase());
}

result.sort((a, b) => {
  let cmp = 0;
  if (sortKey === 'name') cmp = a.name.localeCompare(b.name);
  if (sortKey === 'price') cmp = a.price - b.price;
  if (sortKey === 'daysUntil') cmp = a.daysUntil - b.daysUntil;
  if (sortKey === 'status') cmp = a.status.localeCompare(b.status);
  return sortDir === 'asc' ? cmp : -cmp;
});

return result;
```

}, [subscriptions, search, categoryFilter, statusFilter, sortKey, sortDir]);

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

const handleAddSubscription = (data: any) => {
addSubscription(data);
setAddModalOpen(false);
};

return ( <div className="space-y-4"> <div className="card p-4 space-y-3"> <div className="flex flex-col sm:flex-row gap-3"> <div className="relative flex-1"> <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
<input
type="text"
placeholder="Search subscriptions..."
value={search}
onChange={(e) => setSearch(e.target.value)}
className="input-field pl-9"
/> </div>

```
      <button
        onClick={() => setAddModalOpen(true)}
        className="btn-primary flex-shrink-0"
      >
        <Plus size={16} /> Add Subscription
      </button>
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
    <ServiceLogo 
      name={sub.name?.toLowerCase().trim()} 
      color={sub.color} 
      size={40} 
    />
    <span>{sub.name}</span>
  </div>
</td>
              <td>{format(sub.price)}</td>
              <td>
                <StatusBadge status={sub.status} size="sm" />
              </td>
              <td>
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
      onSubmit={handleAddSubscription}
      onCancel={() => setAddModalOpen(false)}
    />
  </Modal>
</div>
);
}
