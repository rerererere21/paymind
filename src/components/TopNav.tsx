'use client';

import React, {
  useState,
  useEffect,
  useRef
} from 'react';

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

import { supabase } from '@/lib/supabaseClient';

import { useSubscriptions } from '@/context/SubscriptionContext';

import {
  useCurrency,
  CURRENCIES,
  CurrencyCode
} from '@/context/CurrencyContext';

import {
  useProfile
} from '@/context/ProfileContext';

const navItems = [
  {
    id: 'nav-dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard
  },
  {
    id: 'nav-subscriptions',
    label: 'Subscriptions',
    href: '/subscription-management',
    icon: CreditCard
  },
  {
    id: 'nav-add',
    label: 'Add New',
    href: '/add-subscription',
    icon: Plus
  },
  {
    id: 'nav-profile',
    label: 'Profile',
    href: '/profile',
    icon: User
  },
  {
    id: 'nav-settings',
    label: 'Settings',
    href: '/settings',
    icon: Settings
  },
];

export default function TopNav() {

  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [currencyOpen, setCurrencyOpen] =
    useState(false);

  const [notificationOpen, setNotificationOpen] =
    useState(false);

  const [userName, setUserName] =
    useState('User');

  const {
    totalMonthly
  } = useSubscriptions();

  const {
    currency,
    setCurrencyCode,
    format
  } = useCurrency();

  const {
    profileImage
  } = useProfile();

  const notificationRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {

    const loadUser = async () => {

      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) return;

const { data: profile } = await supabase
  .from('user_profiles')
  .select('full_name')
  .eq('id', user.id)
  .single();

const fullName =
  profile?.full_name ||
  user.email?.split('@')[0] ||
  'User';

setUserName(fullName);

    };

    loadUser();

  }, []);

  useEffect(() => {

    const closeMenus = (
      e: MouseEvent
    ) => {

      if (
        notificationRef.current &&
        !notificationRef.current.contains(
          e.target as Node
        )
      ) {
        setNotificationOpen(false);
      }

    };

    document.addEventListener(
      'mousedown',
      closeMenus
    );

    return () =>
      document.removeEventListener(
        'mousedown',
        closeMenus
      );

  }, []);

  const isActive = (
    href: string
  ) =>
    pathname === href ||
    (
      href !== '/dashboard' &&
      pathname.startsWith(href)
    );

  return (

    <>

      <header className="sticky top-0 z-40 bg-card border-b border-border shadow-sm">

        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex items-center justify-between h-16">

            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 flex-shrink-0"
            >

              <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-white flex items-center justify-center">

                <img
                  src="/assets/images/ChatGPT_Image_30_2026_04_37_35_-1777556439227.png"
                  alt="PayMind logo"
                  width={60}
                  height={60}
                  style={{
                    width: 60,
                    height: 60,
                    objectFit: 'contain'
                  }}
                />

              </div>

              <span
                className="font-extrabold text-lg tracking-tight"
                style={{ color: '#1A3C6E' }}
              >
                PayMind
              </span>

            </Link>

            <nav className="hidden md:flex items-center gap-1">

              {navItems.map((item) => {

                const NavIcon = item.icon;

                const active =
                  isActive(item.href);

                return (

                  <Link
                    key={item.id}
                    href={item.href}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-500 transition-all duration-150
                      ${
                        active
                          ? 'bg-primary/10 text-primary font-600'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }
                    `}
                  >

                    <NavIcon size={16} />

                    {item.label}

                  </Link>

                );

              })}

            </nav>

            <div className="flex items-center gap-2">

              <div className="hidden sm:flex items-center gap-1.5 bg-secondary text-secondary-foreground text-xs font-700 px-3 py-1.5 rounded-full border border-accent">

                <span className="text-muted-foreground font-500">
                  Monthly:
                </span>

                <span className="tabular-nums">
                  {format(totalMonthly)}
                </span>

              </div>

              <div className="relative">

                <button
                  onClick={() =>
                    setCurrencyOpen(!currencyOpen)
                  }
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

                          setCurrencyCode(
                            c.code as CurrencyCode
                          );

                          setCurrencyOpen(false);

                        }}
                        className={`
                          w-full text-left px-4 py-2 text-sm transition-colors hover:bg-muted
                          ${
                            currency.code === c.code
                              ? 'text-primary font-600'
                              : 'text-foreground'
                          }
                        `}
                      >

                        {c.label}

                      </button>

                    ))}

                  </div>

                )}

              </div>

              <div
                className="relative"
                ref={notificationRef}
              >

                <button
                  onClick={() =>
                    setNotificationOpen(
                      !notificationOpen
                    )
                  }
                  className="relative w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >

                  <Bell size={18} />

                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />

                </button>

                {notificationOpen && (

                  <div className="absolute right-0 mt-2 w-72 bg-card border border-border rounded-2xl shadow-elevated z-50 overflow-hidden animate-scaleIn">

                    <div className="p-4 border-b border-border">

                      <h3 className="text-sm font-700 text-foreground">
                        Notifications
                      </h3>

                    </div>

                    <div className="p-4 space-y-3">

                      <div className="p-3 rounded-xl bg-muted/40">

                        <p className="text-sm font-600 text-foreground">
                          Welcome to PayMind
                        </p>

                        <p className="text-xs text-muted-foreground mt-1">
                          Your notifications will appear here
                        </p>

                      </div>

                    </div>

                  </div>

                )}

              </div>

              <Link
                href="/profile"
                className="flex items-center gap-2 group"
              >

                <div className="w-8 h-8 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center flex-shrink-0 border-2 border-primary/20">

                  {profileImage ? (

                    <img
                      src={profileImage}
                      alt={`${userName} profile`}
                      style={{
                        width: 32,
                        height: 32,
                        objectFit: 'cover'
                      }}
                    />

                  ) : (

                    <User
                      size={14}
                      className="text-primary"
                    />

                  )}

                </div>

                <span className="hidden lg:block text-sm font-600 text-foreground group-hover:text-primary transition-colors">

                  {userName.split(' ')[0]}

                </span>

              </Link>

              <Link
                href="/sign-up-login-screen"
                className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-negative transition-colors px-2 py-1.5 rounded-lg hover:bg-negative/5"
                title="Sign Out"
              >

                <LogOut size={15} />

              </Link>

              <button
                onClick={() =>
                  setMobileOpen(!mobileOpen)
                }
                className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
              >

                {mobileOpen
                  ? <X size={20} />
                  : <Menu size={20} />
                }

              </button>

            </div>

          </div>

        </div>

      </header>

      {mobileOpen && (

        <div className="md:hidden fixed inset-0 z-30 pt-16">

          <div
            className="absolute inset-0 bg-black/40"
            onClick={() =>
              setMobileOpen(false)
            }
          />

          <div className="relative bg-card border-b border-border shadow-lg animate-fadeIn">

            <nav className="max-w-screen-2xl mx-auto px-4 py-3 space-y-1">

              {navItems.map((item) => {

                const NavIcon = item.icon;

                const active =
                  isActive(item.href);

                return (

                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() =>
                      setMobileOpen(false)
                    }
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-500 transition-all duration-150
                      ${
                        active
                          ? 'bg-primary/10 text-primary font-600'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }
                    `}
                  >

                    <NavIcon size={18} />

                    {item.label}

                  </Link>

                );

              })}

            </nav>

          </div>

        </div>

      )}

    </>

  );

}
