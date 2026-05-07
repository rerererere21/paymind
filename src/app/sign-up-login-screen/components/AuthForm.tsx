'use client';

import { supabase } from '@/lib/supabaseClient'
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Check, Loader2, ArrowRight } from 'lucide-react';

type LoginInputs = {
  email: string;
  password: string;
  remember: boolean;
};

type SignupInputs = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
};

function LoginForm() {

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInputs>();

  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const onSubmit = async (data: LoginInputs) => {

    setAuthError('');

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setAuthError(error.message);
      return;
    }

    window.location.href = '/dashboard';
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

      {authError && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700 font-500">
          {authError}
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="login-email" className="block text-sm font-600 text-foreground">
          Email address
        </label>

        <input
          id="login-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="input-field"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Enter a valid email'
            },
          })}
        />

        {errors.email && (
          <p className="text-xs text-red-600 font-500">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">

        <div className="flex items-center justify-between">
          <label
            htmlFor="login-password"
            className="block text-sm font-600 text-foreground"
          >
            Password
          </label>

          <button
            type="button"
            className="text-xs text-primary hover:text-blue-700 font-500 transition-colors"
          >
            Forgot password?
          </button>
        </div>

        <div className="relative">

          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••"
            className="input-field pr-10"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Minimum 6 characters'
              },
            })}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>

        </div>

        {errors.password && (
          <p className="text-xs text-red-600 font-500">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">

        <input
          id="remember"
          type="checkbox"
          className="w-4 h-4 rounded border-border accent-primary"
          {...register('remember')}
        />

        <label
          htmlFor="remember"
          className="text-sm text-muted-foreground"
        >
          Remember me for 30 days
        </label>

      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full py-3"
      >

        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Signing in...
          </>
        ) : (
          <>
            <span>Sign in to PayMind</span>
            <ArrowRight size={16} />
          </>
        )}

      </button>

    </form>
  );
}

function SignupForm() {

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupInputs>();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  const password = watch('password');

  const onSubmit = async (data: SignupInputs) => {

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.name,
        },
      },
    });

    if (error) {
      alert(error.message);
      return;
    }

    setSuccess(true);

    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 1500);
  };

  if (success) {

    return (
      <div className="text-center py-8 space-y-3 animate-fadeIn">

        <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
          <Check size={24} className="text-emerald-600" />
        </div>

        <h3 className="text-base font-700 text-foreground">
          Account created!
        </h3>

        <p className="text-sm text-muted-foreground">
          Redirecting you to your dashboard...
        </p>

      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">

      <div className="space-y-1.5">

        <label
          htmlFor="signup-name"
          className="block text-sm font-600 text-foreground"
        >
          Full name
        </label>

        <input
          id="signup-name"
          type="text"
          autoComplete="name"
          placeholder="Your Name"
          className="input-field"
          {...register('name', {
            required: 'Full name is required',
            minLength: {
              value: 2,
              message: 'Name too short'
            }
          })}
        />

        {errors.name && (
          <p className="text-xs text-red-600 font-500">
            {errors.name.message}
          </p>
        )}

      </div>

      <div className="space-y-1.5">

        <label
          htmlFor="signup-email"
          className="block text-sm font-600 text-foreground"
        >
          Email address
        </label>

        <input
          id="signup-email"
          type="email"
          autoComplete="email"
          placeholder="YourName@example.com"
          className="input-field"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Enter a valid email'
            },
          })}
        />

        {errors.email && (
          <p className="text-xs text-red-600 font-500">
            {errors.email.message}
          </p>
        )}

      </div>

      <div className="space-y-1.5">

        <label
          htmlFor="signup-password"
          className="block text-sm font-600 text-foreground"
        >
          Password
        </label>

        <p className="text-xs text-muted-foreground">
          At least 8 characters with a number or symbol
        </p>

        <div className="relative">

          <input
            id="signup-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Create a strong password"
            className="input-field pr-10"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Minimum 8 characters'
              },
              pattern: {
                value: /(?=.*[0-9!@#$%^&*])/,
                message: 'Must include a number or symbol'
              },
            })}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>

        </div>

      </div>

      <div className="space-y-1.5">

        <label
          htmlFor="signup-confirm"
          className="block text-sm font-600 text-foreground"
        >
          Confirm password
        </label>

        <div className="relative">

          <input
            id="signup-confirm"
            type={showConfirm ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Repeat your password"
            className="input-field pr-10"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (v) =>
                v === password || 'Passwords do not match',
            })}
          />

          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>

        </div>

      </div>

      <div className="flex items-start gap-2">

        <input
          id="terms"
          type="checkbox"
          className="w-4 h-4 mt-0.5 rounded border-border accent-primary flex-shrink-0"
          {...register('terms', {
            required: 'You must accept the terms'
          })}
        />

        <label
          htmlFor="terms"
          className="text-xs text-muted-foreground leading-relaxed"
        >
          I agree to PayMind&apos;s Terms of Service and Privacy Policy
        </label>

      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full py-3"
      >

        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Creating account...
          </>
        ) : (
          <>
            <span>Create free account</span>
            <ArrowRight size={16} />
          </>
        )}

      </button>

    </form>
  );
}

export default function AuthForm() {

  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  return (

    <div className="space-y-6">

      <div>

        <h2 className="text-2xl font-800 text-foreground">
          {activeTab === 'login'
            ? 'Welcome back'
            : 'Get started free'}
        </h2>

        <p className="text-sm text-muted-foreground mt-1.5">
          {activeTab === 'login'
            ? 'Sign in to see your subscription overview'
            : 'Create your account to start tracking subscriptions'}
        </p>

      </div>

      <div className="flex bg-muted rounded-xl p-1 gap-1">

        {(['login', 'signup'] as const).map((tab) => (

          <button
            key={`tab-${tab}`}
            onClick={() => setActiveTab(tab)}
            className={`
              flex-1 py-2.5 text-sm font-600 rounded-lg transition-all duration-200
              ${activeTab === tab
                ? 'bg-card text-foreground shadow-card'
                : 'text-muted-foreground hover:text-foreground'}
            `}
          >
            {tab === 'login' ? 'Sign In' : 'Sign Up'}
          </button>

        ))}

      </div>

      <div className="animate-fadeIn" key={`form-${activeTab}`}>
        {activeTab === 'login'
          ? <LoginForm />
          : <SignupForm />
        }
      </div>

      <p className="text-center text-sm text-muted-foreground">

        {activeTab === 'login' ? (
          <>
            Don&apos;t have an account?{' '}
            <button
              onClick={() => setActiveTab('signup')}
              className="text-primary font-600 hover:underline"
            >
              Sign up free
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button
              onClick={() => setActiveTab('login')}
              className="text-primary font-600 hover:underline"
            >
              Sign in
            </button>
          </>
        )}

      </p>

    </div>
  );
}