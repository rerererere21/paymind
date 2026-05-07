'use client';

import React, { useState, useMemo } from 'react';
import AppShell from '@/components/AppShell';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { useRouter } from 'next/navigation';
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
  AlertTriangle,
} from 'lucide-react';

import StatusBadge from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import AddSubscriptionForm from './components/AddSubscriptionForm';

import type { Subscription } from '@/context/SubscriptionContext';

const statusFilters = ['All', 'Active', 'Paused', 'Trial', 'Cancelled'];

type SortKey =
  | 'name'
  | 'price'
  | 'nextBilling'
  | 'daysUntil'
  | 'status';

export default function SubscriptionManagementPage() {
  const {
    subscriptions,
    deleteSubscription,
    toggleStatus,
    updateSubscription,
    totalMonthly,
    activeCount,
    pausedCount,
    trialCount,
  } = useSubscriptions();

  const router = useRouter();

  const categories = [
    'All',
    ...Array.from(new Set(subscriptions.map((s) => s.category))),
  ];

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [sortKey, setSortKey] =
    useState<SortKey>('daysUntil');

  const [sortDir, setSortDir] =
    useState<'asc' | 'desc'>('asc');

  const [selectedRows, setSelectedRows] =
    useState<Set<string>>(new Set());

  const [editSub, setEditSub] =
    useState<Subscription | null>(null);

  const [deleteConfirm, setDeleteConfirm] =
    useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const filtered = useMemo(() => {
    let result = [...subscriptions];

    if (search) {
      const q = search.toLowerCase();

      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q)
      );
    }

    if (categoryFilter !== 'All') {
      result = result.filter(
        (s) => s.category === categoryFilter
      );
    }

    if (statusFilter !== 'All') {
      result = result.filter(
        (s) =>
          s.status.toLowerCase() ===
          statusFilter.toLowerCase()
      );
    }

    result.sort((a, b) => {
      let cmp = 0;

      if (sortKey === 'name') {
        cmp = a.name.localeCompare(b.name);
      } else if (sortKey === 'price') {
        cmp = a.price - b.price;
      } else if (sortKey === 'daysUntil') {
        cmp = a.daysUntil - b.daysUntil;
      } else if (sortKey === 'status') {
        cmp = a.status.localeCompare(b.status);
      }

      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [
    subscriptions,
    search,
    categoryFilter,
    statusFilter,
    sortKey,
    sortDir,
  ]);

  const totalPages = Math.ceil(
    filtered.length / itemsPerPage
  );

  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const toggleRow = (id: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  const toggleAll = () => {
    if (
      selectedRows.size === paginated.length &&
      paginated.length > 0
    ) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(
        new Set(paginated.map((s) => s.id))
      );
    }
  };

  const handleBulkDelete = () => {
    Array.from(selectedRows).forEach((id) =>
      deleteSubscription(id)
    );

    setSelectedRows(new Set());
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) {
      return (
        <ChevronUp
          size={12}
          className="text-muted-foreground/40"
        />
      );
    }

    return sortDir === 'asc' ? (
      <ChevronUp
        size={12}
        className="text-primary"
      />
    ) : (
      <ChevronDown
        size={12}
        className="text-primary"
      />
    );
  };

  return (
    <AppShell>
      <div className="space-y-6 animate-fadeIn">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-700 text-foreground">
              Subscriptions
            </h1>

            <p className="text-sm text-muted-foreground mt-1">
              {subscriptions.length} total · {activeCount} active
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              label: 'Active',
              value: activeCount,
              color:
                'text-emerald-700 bg-emerald-50',
            },
            {
              label: 'Paused',
              value: pausedCount,
              color:
                'text-amber-700 bg-amber-50',
            },
            {
              label: 'Trial',
              value: trialCount,
              color:
                'text-purple-700 bg-purple-50',
            },
            {
              label: 'Monthly Total',
              value: `$${totalMonthly.toFixed(2)}`,
              color:
                'text-primary bg-secondary',
            },
          ].map((item) => (
            <div
              key={item.label}
              className={`rounded-xl px-4 py-3 ${item.color}`}
            >
              <p className="text-xs font-600 uppercase tracking-wider opacity-70">
                {item.label}
              </p>

              <p className="text-xl font-800 tabular-nums mt-0.5">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="card p-4 space-y-3">

          <div className="flex flex-col sm:flex-row gap-3">

            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <input
                type="text"
                placeholder="Search subscriptions..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="input-field pl-9"
              />

              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter
                size={14}
                className="text-muted-foreground flex-shrink-0"
              />

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="input-field w-36 py-2.5"
              >
                {statusFilters.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Add Button */}
            <button
              onClick={() =>
                router.push('/add-subscription')
              }
              className="btn-primary flex-shrink-0"
            >
              <Plus size={16} />
              Add Subscription
            </button>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategoryFilter(cat);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-600 transition-all duration-150 ${
                  categoryFilter === cat
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-muted text-muted-foreground hover:bg-accent hover:text-secondary-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedRows.size > 0 && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 flex items-center justify-between">

            <span className="text-sm font-600 text-primary">
              {selectedRows.size} selected
            </span>

            <div className="flex items-center gap-2">

              <button
                onClick={() =>
                  setSelectedRows(new Set())
                }
                className="btn-secondary text-xs py-1.5 px-3"
              >
                Clear
              </button>

              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-1.5 text-xs font-600 text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Trash2 size={13} />
                Delete {selectedRows.size}
              </button>
            </div>
          </div>
        )}

      </div>
    </AppShell>
  );
}