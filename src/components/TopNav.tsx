'use client';

import React, { useState } from 'react';
import Link from 'next/link';

import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CreditCard,
  User,
  LogOut,
  Bell,
  Settings,
  Plus,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { useCurrency, CURRENCIES, CurrencyCode } from '@/context/CurrencyContext';
import { useProfile } from '@/context/ProfileContext';

const navItems = [
  { id: 'nav-dashboard', label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { id: 'nav-subscriptions', label: 'Subscriptions', href: '/subscription-management', icon: CreditCard },
  { id: 'nav-add', label: 'Add New', href: '/add-subscription', icon: Plus },
  { id: 'nav-profile', label: 'Profile', href: '/profile', icon: User },
  { id: 'nav-settings', label: 'Settings', href: '/settings', icon: Settings },
];

export default function TopNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const { totalMonthly } = useSubscriptions();
  const { currency, setCurrencyCode, format } = useCurrency();
  const { profileImage, userName } = useProfile();

  const isActive = (href: string) =>
    pathname === href || (href !== '/dashboard' && pathname.startsWith(href));

  return (
    <>
      <header className="sticky top-0 z-40 bg-card border-b border-border shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-white flex items-center justify-center">
  <img
    src="/assets/images/ChatGPT_Image_30_2026_04_37_35_-1777556439227.png"
    alt="PayMind logo"
    width={60}
    height={60}
    style={{ width: 60, height: 60, objectFit: 'contain' }}
  />
</div>
              <span className="font-extrabold text-lg tracking-tight" style={{ color: '#1A3C6E' }}>PayMind</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const NavIcon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-500 transition-all duration-150 ${
                      active
                        ? 'bg-primary/10 text-primary font-600' :'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <NavIcon size={16} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Monthly spend pill */}
              <div className="hidden sm:flex items-center gap-1.5 bg-secondary text-secondary-foreground text-xs font-700 px-3 py-1.5 rounded-full border border-accent">
                <span className="text-muted-foreground font-500">Monthly:</span>
                <span className="tabular-nums">{format(totalMonthly)}</span>
              </div>

              {/* Currency Selector */}
              <div className="relative">
                <button
                  onClick={() => setCurrencyOpen(!currencyOpen)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-600 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors border border-border"
                >
                  {currency.code}
                  <ChevronDown size={12} />
                </button>
                {currencyOpen && (
                  <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-elevated z-50 min-w-[140px] py-1 animate-scaleIn">
                    {CURRENCIES.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => {
                          setCurrencyCode(c.code as CurrencyCode);
                          setCurrencyOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-muted ${
                          currency.code === c.code ? 'text-primary font-600' : 'text-foreground'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Bell */}
              <button className="relative w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
              </button>

              {/* Avatar */}
              <Link href="/profile" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center flex-shrink-0 border-2 border-primary/20">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt={`${userName} profile`}
                      style={{ width: 32, height: 32, objectFit: 'cover' }}
                    />
                  ) : (
                    <User size={14} className="text-primary" />
                  )}
                </div>
                <span className="hidden lg:block text-sm font-600 text-foreground group-hover:text-primary transition-colors">
                  {userName.split(' ')[0]}
                </span>
              </Link>

              {/* Sign out */}
              <Link
                href="/sign-up-login-screen"
                className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-negative transition-colors px-2 py-1.5 rounded-lg hover:bg-negative/5"
                title="Sign Out"
              >
                <LogOut size={15} />
              </Link>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-30 pt-16">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="relative bg-card border-b border-border shadow-lg animate-fadeIn">
            <nav className="max-w-screen-2xl mx-auto px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const NavIcon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-500 transition-all duration-150 ${
                      active
                        ? 'bg-primary/10 text-primary font-600' :'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <NavIcon size={18} />
                    {item.label}
                  </Link>
                );
              })}
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex items-center justify-between px-4 py-2">
                  <span className="text-xs text-muted-foreground">Monthly total</span>
                  <span className="text-sm font-700 text-primary tabular-nums">{format(totalMonthly)}</span>
                </div>
                {/* Currency selector mobile */}
                <div className="px-4 py-2">
                  <label className="text-xs text-muted-foreground block mb-1">Currency</label>
                  <select
                    value={currency.code}
                    onChange={(e) => setCurrencyCode(e.target.value as CurrencyCode)}
                    className="input-field py-2 text-sm"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <Link
                  href="/sign-up-login-screen"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-500 text-muted-foreground hover:bg-negative/5 hover:text-negative transition-colors"
                >
                  <LogOut size={18} />
                  Sign Out
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Close currency dropdown on outside click */}
      {currencyOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setCurrencyOpen(false)} />
      )}
    </>
  );
}
