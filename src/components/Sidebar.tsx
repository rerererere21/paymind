'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { LayoutDashboard, CreditCard, User, LogOut, ChevronLeft, ChevronRight, Settings, Plus,  } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const navItems: NavItem[] = [
  { id: 'nav-dashboard', label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { id: 'nav-subscriptions', label: 'Subscriptions', href: '/subscription-management', icon: CreditCard, badge: 3 },
  { id: 'nav-add', label: 'Add New', href: '/add-subscription', icon: Plus },
  { id: 'nav-profile', label: 'Profile', href: '/profile', icon: User },
  { id: 'nav-settings', label: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  activePath: string;
}

export default function Sidebar({ activePath }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-border ${collapsed ? 'justify-center' : ''}`}>
        <AppLogo size={36} />
        {!collapsed && (
          <span className="font-extrabold text-lg text-foreground tracking-tight">
            PayMind
          </span>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <div className="mb-3">
          {!collapsed && (
            <p className="text-xs font-600 uppercase tracking-widest text-muted-foreground px-3 mb-2">
              Menu
            </p>
          )}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePath === item.href || (item.href !== '/dashboard' && activePath.startsWith(item.href));
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group relative
                  ${isActive
                    ? 'bg-primary/10 text-primary font-600' :'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }
                  ${collapsed ? 'justify-center' : ''}
                `}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={18} className={`flex-shrink-0 ${isActive ? 'text-primary' : ''}`} />
                {!collapsed && (
                  <span className="text-sm font-500 flex-1">{item.label}</span>
                )}
                {!collapsed && item.badge !== undefined && (
                  <span className="bg-primary text-white text-xs font-700 rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
                {collapsed && item.badge !== undefined && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User + Collapse */}
      <div className="border-t border-border px-3 py-4 space-y-1">
        <Link
          href="/dashboard"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-150 ${collapsed ? 'justify-center' : ''}`}
        >
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <User size={14} className="text-primary" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-600 text-foreground truncate">Alex Rivera</p>
              <p className="text-xs text-muted-foreground truncate">TryDemo@paymind.app</p>
            </div>
          )}
        </Link>

        <Link
          href="/sign-up-login-screen"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-negative/10 hover:text-negative transition-all duration-150 ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Sign Out' : undefined}
        >
          <LogOut size={16} />
          {!collapsed && <span className="text-sm font-500">Sign Out</span>}
        </Link>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-150 ${collapsed ? 'justify-center' : ''}`}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!collapsed && <span className="text-sm font-500">Collapse</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`
          hidden lg:flex flex-col bg-card border-r border-border
          transition-all duration-300 ease-in-out flex-shrink-0
          ${collapsed ? 'w-16' : 'w-60'}
        `}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Hamburger */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileOpen(true)}
          className="w-10 h-10 bg-card border border-border rounded-lg flex items-center justify-center shadow-card"
        >
          <div className="space-y-1">
            <span className="block w-4 h-0.5 bg-foreground" />
            <span className="block w-4 h-0.5 bg-foreground" />
            <span className="block w-3 h-0.5 bg-foreground" />
          </div>
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-64 bg-card border-r border-border h-full z-50 animate-slideInRight">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}