'use client';

import React, { useState, useRef } from 'react';
import AppShell from '@/components/AppShell';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { useCurrency, CURRENCIES, CurrencyCode } from '@/context/CurrencyContext';
import { useProfile } from '@/context/ProfileContext';
import {
  User,
  Mail,
  Bell,
  Shield,
  CreditCard,
  Trash2,
  Check,
  ChevronRight,
  Moon,
  Globe,
  Download,
  Camera,
  X,
} from 'lucide-react';


export default function ProfilePage() {
  const { subscriptions, totalMonthly, activeCount } = useSubscriptions();
  const { currency, setCurrencyCode, format } = useCurrency();
  const { profileImage, userName, setProfileImage, setUserName } = useProfile();

  const [name, setName] = useState(userName);
  const [email] = useState('alex@paymind.app');
  const [nameSaved, setNameSaved] = useState(false);
  const [notifications, setNotifications] = useState({
    renewalAlerts: true,
    weeklyDigest: true,
    priceChanges: false,
    newFeatures: true,
  });
  const [darkMode, setDarkMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveName = () => {
    setUserName(name);
    setNameSaved(true);
    setTimeout(() => setNameSaved(false), 2000);
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setProfileImage(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-700 text-foreground">Profile & Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your account and preferences</p>
        </div>

        {/* Profile Card */}
        <div className="card p-6">
          <div className="flex items-center gap-4 mb-6">
            {/* Profile picture with upload */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center border-4 border-primary/20">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={`${name} profile picture`}
                    style={{ width: 80, height: 80, objectFit: 'cover' }}
                  />
                ) : (
                  <User size={32} className="text-primary" />
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-md hover:bg-blue-700 transition-colors"
                title="Upload profile picture"
              >
                <Camera size={13} />
              </button>
              {profileImage && (
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-0 right-0 w-6 h-6 rounded-full bg-negative text-white flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                  title="Remove profile picture"
                >
                  <X size={11} />
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
            <div>
              <h2 className="text-lg font-700 text-foreground">{name}</h2>
              <p className="text-sm text-muted-foreground">{email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs bg-emerald-50 text-emerald-700 font-600 px-2 py-0.5 rounded-full">Free Plan</span>
                <span className="text-xs text-muted-foreground">Member since Jan 2024</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {profileImage ? 'Click the camera icon to change your photo' : 'Click the camera icon to add a profile photo'}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-muted/40 rounded-xl mb-6">
            {[
              { label: 'Subscriptions', value: subscriptions.length },
              { label: 'Active', value: activeCount },
              { label: 'Monthly Spend', value: format(totalMonthly) },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-xl font-800 text-foreground tabular-nums">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Edit name */}
          <div className="space-y-3">
            <h3 className="text-sm font-700 text-foreground flex items-center gap-2">
              <User size={15} className="text-muted-foreground" /> Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-600 text-muted-foreground uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-600 text-muted-foreground uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type="email" value={email} readOnly className="input-field pl-9 opacity-60 cursor-not-allowed" />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button onClick={handleSaveName} className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
                {nameSaved ? <><Check size={15} /> Saved!</> : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="card p-6 space-y-4">
          <h3 className="text-sm font-700 text-foreground flex items-center gap-2">
            <Bell size={15} className="text-muted-foreground" /> Notification Preferences
          </h3>
          <div className="space-y-3">
            {[
              { key: 'renewalAlerts' as const, label: 'Renewal Alerts', desc: 'Get notified 3 days before a subscription renews' },
              { key: 'weeklyDigest' as const, label: 'Weekly Digest', desc: 'Summary of your subscription activity every Monday' },
              { key: 'priceChanges' as const, label: 'Price Changes', desc: 'Alert when a subscription price increases' },
              { key: 'newFeatures' as const, label: 'New Features', desc: 'Updates about new PayMind features' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors">
                <div>
                  <p className="text-sm font-600 text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
                <button
                  onClick={() => toggleNotification(item.key)}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${notifications[item.key] ? 'bg-primary' : 'bg-border'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${notifications[item.key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div className="card p-6 space-y-4">
          <h3 className="text-sm font-700 text-foreground flex items-center gap-2">
            <Globe size={15} className="text-muted-foreground" /> App Preferences
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/40">
              <div>
                <p className="text-sm font-600 text-foreground">Currency</p>
                <p className="text-xs text-muted-foreground mt-0.5">Display currency for all prices</p>
              </div>
              <select
                value={currency.code}
                onChange={(e) => setCurrencyCode(e.target.value as CurrencyCode)}
                className="input-field w-36 py-2 text-sm"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors">
              <div>
                <p className="text-sm font-600 text-foreground flex items-center gap-2"><Moon size={14} /> Dark Mode</p>
                <p className="text-xs text-muted-foreground mt-0.5">Switch to dark theme (coming soon)</p>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${darkMode ? 'bg-primary' : 'bg-border'}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${darkMode ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="card p-6 space-y-2">
          <h3 className="text-sm font-700 text-foreground flex items-center gap-2 mb-4">
            <Shield size={15} className="text-muted-foreground" /> Account
          </h3>
          {[
            { icon: CreditCard, label: 'Manage Subscriptions', href: '/subscription-management', desc: `${subscriptions.length} subscriptions tracked` },
            { icon: Download, label: 'Export Data', href: '#', desc: 'Download your subscription data as CSV' },
          ].map((item) => {
            const ItemIcon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/60 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                    <ItemIcon size={16} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-600 text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-muted-foreground group-hover:text-foreground transition-colors" />
              </a>
            );
          })}
          <div className="border-t border-border pt-2 mt-2">
            <button className="flex items-center gap-3 w-full p-4 rounded-xl hover:bg-red-50 transition-colors group text-left">
              <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
                <Trash2 size={16} className="text-red-500" />
              </div>
              <div>
                <p className="text-sm font-600 text-red-600">Delete Account</p>
                <p className="text-xs text-muted-foreground">Permanently remove your account and data</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
