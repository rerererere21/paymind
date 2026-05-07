'use client';

import React, {
  useState,
  useRef,
  useEffect
} from 'react';

import AppShell from '@/components/AppShell';

import { useSubscriptions } from '@/context/SubscriptionContext';

import {
  useCurrency
} from '@/context/CurrencyContext';

import {
  useProfile
} from '@/context/ProfileContext';

import { supabase } from '@/lib/supabaseClient';

import {
  User,
  Mail,
  Check,
  Camera,
  X
} from 'lucide-react';

export default function ProfilePage() {

  const {
    subscriptions,
    totalMonthly,
    activeCount
  } = useSubscriptions();

  const {
    format
  } = useCurrency();

  const {
    profileImage,
    setProfileImage
  } = useProfile();

  const [name, setName] = useState('');

  const [email, setEmail] = useState('');

  const [nameSaved, setNameSaved] =
    useState(false);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  useEffect(() => {

    const loadUser = async () => {

      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) return;

      setEmail(user.email || '');

      const fullName =
        user.user_metadata?.full_name ||
        user.email?.split('@')[0] ||
        '';

      setName(fullName);

      const { data } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!data) {

        await supabase
          .from('user_profiles')
          .insert({
            id: user.id,
            email: user.email,
            full_name: fullName,
          });

      }

    };

    loadUser();

  }, []);

const handleSaveName = async () => {

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase
    .from('user_profiles')
    .upsert({
      id: user.id,
      email: user.email,
      full_name: name,
    });

  await supabase.auth.updateUser({
    data: {
      full_name: name,
    },
  });

  setName(name);

  setNameSaved(true);

  setTimeout(() => {
    setNameSaved(false);
  }, 2000);

};

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file =
      e.target.files?.[0];

    if (!file) return;

    const reader =
      new FileReader();

    reader.onload = (ev) => {

      const result =
        ev.target?.result as string;

      setProfileImage(result);

    };

    reader.readAsDataURL(file);

  };

  const handleRemoveImage = () => {

    setProfileImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

  };

  return (

    <AppShell>

      <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">

        <div>

          <h1 className="text-2xl font-700 text-foreground">
            Profile
          </h1>

          <p className="text-sm text-muted-foreground mt-1">
            Manage your account information
          </p>

        </div>

        <div className="card p-6">

          <div className="flex items-center gap-4 mb-6">

            <div className="relative flex-shrink-0">

              <div className="w-20 h-20 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center border-4 border-primary/20">

                {profileImage ? (

                  <img
                    src={profileImage}
                    alt={`${name} profile picture`}
                    style={{
                      width: 80,
                      height: 80,
                      objectFit: 'cover'
                    }}
                  />

                ) : (

                  <User
                    size={32}
                    className="text-primary"
                  />

                )}

              </div>

              <button
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-md hover:bg-blue-700 transition-colors"
              >

                <Camera size={13} />

              </button>

              {profileImage && (

                <button
                  onClick={handleRemoveImage}
                  className="absolute top-0 right-0 w-6 h-6 rounded-full bg-negative text-white flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
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

              <h2 className="text-lg font-700 text-foreground">
                {name}
              </h2>

              <p className="text-sm text-muted-foreground">
                {email}
              </p>

              <div className="flex items-center gap-2 mt-1">

                <span className="text-xs bg-emerald-50 text-emerald-700 font-600 px-2 py-0.5 rounded-full">
                  Free Plan
                </span>

                <span className="text-xs text-muted-foreground">
                  Member since 2026
                </span>

              </div>

              <p className="text-xs text-muted-foreground mt-1">

                {profileImage
                  ? 'Click the camera icon to change your photo'
                  : 'Click the camera icon to add a profile photo'}

              </p>

            </div>

          </div>

          <div className="grid grid-cols-3 gap-4 p-4 bg-muted/40 rounded-xl mb-6">

            {[
              {
                label: 'Subscriptions',
                value: subscriptions.length
              },
              {
                label: 'Active',
                value: activeCount
              },
              {
                label: 'Monthly Spend',
                value: format(totalMonthly)
              },
            ].map((s) => (

              <div
                key={s.label}
                className="text-center"
              >

                <p className="text-xl font-800 text-foreground tabular-nums">
                  {s.value}
                </p>

                <p className="text-xs text-muted-foreground mt-0.5">
                  {s.label}
                </p>

              </div>

            ))}

          </div>

          <div className="space-y-3">

            <h3 className="text-sm font-700 text-foreground flex items-center gap-2">

              <User
                size={15}
                className="text-muted-foreground"
              />

              Personal Information

            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className="space-y-1.5">

                <label className="block text-xs font-600 text-muted-foreground uppercase tracking-wider">
                  Full Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  className="input-field"
                />

              </div>

              <div className="space-y-1.5">

                <label className="block text-xs font-600 text-muted-foreground uppercase tracking-wider">
                  Email Address
                </label>

                <div className="relative">

                  <Mail
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />

                  <input
                    type="email"
                    value={email}
                    readOnly
                    className="input-field pl-9 opacity-60 cursor-not-allowed"
                  />

                </div>

              </div>

            </div>

            <div className="flex justify-end">

              <button
                onClick={handleSaveName}
                className="btn-primary text-sm py-2 px-4 flex items-center gap-2"
              >

                {nameSaved ? (
                  <>
                    <Check size={15} />
                    Saved!
                  </>
                ) : (
                  'Save Changes'
                )}

              </button>

            </div>

          </div>

        </div>

      </div>

    </AppShell>

  );

}