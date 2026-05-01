import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import '../styles/tailwind.css';
import { SubscriptionProvider } from '@/context/SubscriptionContext';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { ProfileProvider } from '@/context/ProfileContext';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'PayMind — Subscription Spend Tracker',
  description: 'PayMind helps you track all your recurring subscriptions, visualize monthly spend, and never get caught off guard by a renewal charge.',
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className={plusJakartaSans.className}>
        <SubscriptionProvider>
          <CurrencyProvider>
            <ProfileProvider>
              {children}
            </ProfileProvider>
          </CurrencyProvider>
        </SubscriptionProvider>
</body>
    </html>
  );
}