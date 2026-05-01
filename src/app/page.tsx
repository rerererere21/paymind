'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, TrendingDown, Bell, BarChart2, Shield, CheckCircle, Star } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


const features = [
  {
    id: 'feat-track',
    icon: BarChart2,
    iconBg: 'bg-blue-50',
    iconColor: 'text-primary',
    title: 'Track every subscription',
    desc: 'See all your recurring charges in one place — Netflix, Spotify, SaaS tools, and more.',
  },
  {
    id: 'feat-alerts',
    icon: Bell,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    title: 'Renewal alerts',
    desc: 'Get notified before you\'re charged. Never be surprised by an unexpected renewal again.',
  },
  {
    id: 'feat-spend',
    icon: TrendingDown,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    title: 'Cut unnecessary spend',
    desc: 'Spot subscriptions you forgot about and cancel what you don\'t use.',
  },
  {
    id: 'feat-secure',
    icon: Shield,
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
    title: 'Private & secure',
    desc: 'Your data stays on your device. No bank connections, no data selling.',
  },
];

const testimonials = [
  { id: 't1', name: 'Sarah K.', role: 'Freelance Designer', quote: 'I found 4 subscriptions I completely forgot about. Saved $60/month instantly.', rating: 5 },
  { id: 't2', name: 'Marcus T.', role: 'Software Engineer', quote: 'Finally a clean way to see exactly what I\'m paying for every month. Love the dashboard.', rating: 5 },
  { id: 't3', name: 'Priya M.', role: 'Product Manager', quote: 'The renewal alerts alone are worth it. No more surprise charges on my card.', rating: 5 },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                <rect x="2" y="5" width="18" height="12" rx="3" fill="white" />
                <rect x="5" y="2" width="12" height="12" rx="2" fill="white" fillOpacity="0.9" />
                <path d="M11 7L13 10H9L11 7Z" fill="#3B82F6" />
              </svg>
            </div>
            <span className="font-extrabold text-lg text-foreground tracking-tight">PayMind</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/sign-up-login-screen" className="text-sm font-600 text-muted-foreground hover:text-foreground transition-colors px-3 py-2">
              Sign in
            </Link>
            <Link href="/dashboard" className="btn-primary text-sm py-2 px-4">
              Get started free
            </Link>
          </div>
        </div>
      </header>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground text-xs font-600 px-3 py-1.5 rounded-full border border-accent mb-6">
          <span className="w-1.5 h-1.5 bg-primary rounded-full" />
          Free to use · No credit card required
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-800 text-foreground leading-tight text-balance mb-6">
          Stop paying for things<br />
          <span className="text-primary">you forgot about</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          PayMind tracks all your subscriptions in one place. See your real monthly cost, catch upcoming renewals, and take back control of your spending.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/dashboard" className="btn-primary text-base py-3 px-8 w-full sm:w-auto">
            Open Dashboard <ArrowRight size={18} />
          </Link>
          <Link href="/sign-up-login-screen" className="btn-secondary text-base py-3 px-8 w-full sm:w-auto">
            Sign in
          </Link>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-14 pt-10 border-t border-border">
          {[
            { value: '12k+', label: 'Users tracking' },
            { value: '$340', label: 'Avg. monthly saved' },
            { value: '98%', label: 'Satisfaction rate' },
            { value: '0', label: 'Data sold' },
          ]?.map((s) => (
            <div key={s?.label} className="text-center">
              <p className="text-2xl font-800 text-foreground tabular-nums">{s?.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s?.label}</p>
            </div>
          ))}
        </div>
      </section>
      {/* Dashboard preview card */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="card p-6 sm:p-8 bg-gradient-to-br from-primary to-blue-700 text-white rounded-2xl shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-blue-200 text-sm font-500">Total Monthly Spend</p>
              <p className="text-4xl font-800 tabular-nums mt-1">$147.93</p>
              <p className="text-blue-200 text-sm mt-1">+$12.99 from last month</p>
            </div>
            <div className="hidden sm:grid grid-cols-3 gap-4">
              {[
                { label: 'Active', val: '12' },
                { label: 'Paused', val: '2' },
                { label: 'Trial', val: '1' },
              ]?.map((item) => (
                <div key={item?.label} className="bg-white/10 rounded-xl px-4 py-3 text-center">
                  <p className="text-xl font-800">{item?.val}</p>
                  <p className="text-xs text-blue-200 mt-0.5">{item?.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            {[
              { name: 'Spotify', price: '$9.99', date: 'May 2', color: '#1DB954' },
              { name: 'Adobe Creative Cloud', price: '$54.99', date: 'May 4', color: '#FF0000' },
              { name: 'Disney+', price: '$16.00', date: 'May 11', color: '#0063E5' },
            ]?.map((sub) => (
              <div key={sub?.name} className="flex items-center justify-between bg-white/10 rounded-xl px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-800" style={{ backgroundColor: sub?.color }}>
                    {sub?.name?.charAt(0)}
                  </div>
                  <span className="text-sm font-600">{sub?.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-700 tabular-nums">{sub?.price}</p>
                  <p className="text-xs text-blue-200">{sub?.date}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-600 text-blue-200 hover:text-white transition-colors">
              View full dashboard <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
      {/* Features */}
      <section className="bg-muted/40 border-y border-border py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-800 text-foreground mb-3">Everything you need to manage subscriptions</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Simple, powerful tools to keep your recurring costs under control.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features?.map((f) => {
              const Icon = f?.icon;
              return (
                <div key={f?.id} className="card p-6 hover:shadow-md transition-shadow duration-200">
                  <div className={`w-10 h-10 rounded-xl ${f?.iconBg} flex items-center justify-center mb-4`}>
                    <Icon size={20} className={f?.iconColor} />
                  </div>
                  <h3 className="text-sm font-700 text-foreground mb-2">{f?.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f?.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-800 text-foreground mb-3">Trusted by thousands</h2>
          <p className="text-muted-foreground">Real people saving real money every month.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials?.map((t) => (
            <div key={t?.id} className="card p-6">
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t?.rating })?.map((_, i) => (
                  <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-foreground leading-relaxed mb-4">&ldquo;{t?.quote}&rdquo;</p>
              <div>
                <p className="text-sm font-700 text-foreground">{t?.name}</p>
                <p className="text-xs text-muted-foreground">{t?.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* CTA */}
      <section className="bg-primary py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-800 text-white mb-4">Start tracking your subscriptions today</h2>
          <p className="text-blue-100 mb-8">Free forever. No credit card. No bank connections.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard" className="bg-white text-primary font-700 text-base py-3 px-8 rounded-lg hover:bg-blue-50 transition-colors inline-flex items-center gap-2 w-full sm:w-auto justify-center">
              Open Dashboard <ArrowRight size={18} />
            </Link>
            <div className="flex items-center gap-2 text-blue-100 text-sm">
              <CheckCircle size={16} />
              <span>Free to use · No signup required</span>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                <rect x="2" y="5" width="18" height="12" rx="3" fill="white" />
              </svg>
            </div>
            <span className="text-sm font-700 text-foreground">PayMind</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 PayMind. Free for personal use.</p>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
            <Link href="/subscription-management" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Subscriptions</Link>
            <Link href="/sign-up-login-screen" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}