'use client';

import React, { useState } from 'react';

import AppShell from '@/components/AppShell';

import {
  Bell,
  Globe,
  Moon,
  Shield
} from 'lucide-react';

import {
  useCurrency,
  CURRENCIES,
  CurrencyCode
} from '@/context/CurrencyContext';

export default function SettingsPage() {

  const {
    currency,
    setCurrencyCode
  } = useCurrency();

  const [notifications, setNotifications] =
    useState({
      renewalAlerts: true,
      weeklyDigest: true,
      priceChanges: false,
      newFeatures: true,
    });

  const [darkMode, setDarkMode] =
    useState(false);

  const toggleNotification = (
    key: keyof typeof notifications
  ) => {

    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));

  };

  return (

    <AppShell>

      <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">

        <div>

          <h1 className="text-2xl font-700 text-foreground">
            Settings
          </h1>

          <p className="text-sm text-muted-foreground mt-1">
            Manage your preferences and notifications
          </p>

        </div>

        <div className="card p-6 space-y-4">

          <h3 className="text-sm font-700 text-foreground flex items-center gap-2">

            <Bell
              size={15}
              className="text-muted-foreground"
            />

            Notification Preferences

          </h3>

          <div className="space-y-3">

            {[
              {
                key: 'renewalAlerts' as const,
                label: 'Renewal Alerts',
                desc: 'Get notified before subscriptions renew'
              },
              {
                key: 'weeklyDigest' as const,
                label: 'Weekly Digest',
                desc: 'Weekly summary of subscriptions'
              },
              {
                key: 'newFeatures' as const,
                label: 'New Features',
                desc: 'Updates about new PayMind features'
              },
            ].map((item) => (

              <div
                key={item.key}
                className="flex items-center justify-between p-4 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors"
              >

                <div>

                  <p className="text-sm font-600 text-foreground">
                    {item.label}
                  </p>

                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.desc}
                  </p>

                </div>

                <button
                  onClick={() =>
                    toggleNotification(item.key)
                  }
                  className={`
                    relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0
                    ${notifications[item.key]
                      ? 'bg-primary'
                      : 'bg-border'}
                  `}
                >

                  <span
                    className={`
                      absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200
                      ${notifications[item.key]
                        ? 'translate-x-5'
                        : 'translate-x-0.5'}
                    `}
                  />

                </button>

              </div>

            ))}

          </div>

        </div>

        <div className="card p-6 space-y-4">

          <h3 className="text-sm font-700 text-foreground flex items-center gap-2">

            <Globe
              size={15}
              className="text-muted-foreground"
            />

            App Preferences

          </h3>

          <div className="space-y-3">

            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/40">

              <div>

                <p className="text-sm font-600 text-foreground">
                  Currency
                </p>

                <p className="text-xs text-muted-foreground mt-0.5">
                  Display currency for all prices
                </p>

              </div>

              <select
                value={currency.code}
                onChange={(e) =>
                  setCurrencyCode(
                    e.target.value as CurrencyCode
                  )
                }
                className="input-field w-36 py-2 text-sm"
              >

                {CURRENCIES.map((c) => (

                  <option
                    key={c.code}
                    value={c.code}
                  >
                    {c.label}
                  </option>

                ))}

              </select>

            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors">

              <div>

                <p className="text-sm font-600 text-foreground flex items-center gap-2">

                  <Moon size={14} />

                  Dark Mode

                </p>

                <p className="text-xs text-muted-foreground mt-0.5">
                  Switch to dark theme
                </p>

              </div>

              <button
                onClick={() =>
                  setDarkMode(!darkMode)
                }
                className={`
                  relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0
                  ${darkMode
                    ? 'bg-primary'
                    : 'bg-border'}
                `}
              >

                <span
                  className={`
                    absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200
                    ${darkMode
                      ? 'translate-x-5'
                      : 'translate-x-0.5'}
                  `}
                />

              </button>

            </div>

          </div>

        </div>

        <div className="card p-6">

          <h3 className="text-sm font-700 text-foreground flex items-center gap-2 mb-4">

            <Shield
              size={15}
              className="text-muted-foreground"
            />

            Account Settings

          </h3>

          <div className="p-4 rounded-xl bg-muted/40">

            <p className="text-sm font-600 text-foreground">
              Account Security
            </p>

            <p className="text-xs text-muted-foreground mt-1">
              More security settings coming soon
            </p>

          </div>

        </div>

      </div>

    </AppShell>

  );

}