'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Copy, Check, Loader2, ArrowRight } from 'lucide-react';


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

// Mock demo credentials
const demoCredential = {
  email: 'TryDemo@paymind.app',
  password: 'PayMind2026!',
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      className="p-1 rounded hover:bg-border transition-colors"
      aria-label="Copy to clipboard"
    >
      {copied ? <Check size={13} className="text-positive" /> : <Copy size={13} className="text-muted-foreground" />}
    </button>
  );
}

function LoginForm({ onFillCredentials }: { onFillCredentials: (email: string, password: string) => void }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginInputs>();

  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Expose fill function
  React.useEffect(() => {
    onFillCredentials(demoCredential.email, demoCredential.password);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fillDemo = () => {
    setValue('email', demoCredential.email);
    setValue('password', demoCredential.password);
  };

  const onSubmit = async (data: LoginInputs) => {
    setAuthError('');
    // Backend: POST /api/auth/login with { email, password }
    await new Promise((r) => setTimeout(r, 1200));
    if (data.email !== demoCredential.email || data.password !== demoCredential.password) {
      setAuthError('Invalid credentials — use the demo account below to sign in');
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
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
          })}
        />
        {errors.email && (
          <p className="text-xs text-red-600 font-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="login-password" className="block text-sm font-600 text-foreground">
            Password
          </label>
          <button type="button" className="text-xs text-primary hover:text-blue-700 font-500 transition-colors">
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
              minLength: { value: 6, message: 'Minimum 6 characters' },
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-red-600 font-500">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          id="remember"
          type="checkbox"
          className="w-4 h-4 rounded border-border accent-primary"
          {...register('remember')}
        />
        <label htmlFor="remember" className="text-sm text-muted-foreground">
          Remember me for 30 days
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full py-3"
      >
        {isSubmitting ? (
          <><Loader2 size={16} className="animate-spin" /> Signing in...</>
        ) : (
          <><span>Sign in to PayMind</span> <ArrowRight size={16} /></>
        )}
      </button>

      {/* Demo Credentials Box */}
      <div className="bg-secondary border border-accent rounded-xl p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-700 text-secondary-foreground uppercase tracking-wider">Demo Account</p>
          <button
            type="button"
            onClick={fillDemo}
            className="text-xs font-600 text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1 rounded-full transition-colors"
          >
            Autofill
          </button>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2 bg-card rounded-lg px-3 py-2 border border-border">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-xs font-600 text-foreground truncate">{demoCredential.email}</p>
            </div>
            <CopyButton text={demoCredential.email} />
          </div>
          <div className="flex items-center justify-between gap-2 bg-card rounded-lg px-3 py-2 border border-border">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Password</p>
              <p className="text-xs font-600 text-foreground">{demoCredential.password}</p>
            </div>
            <CopyButton text={demoCredential.password} />
          </div>
        </div>
      </div>
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

  const onSubmit = async (_data: SignupInputs) => {
    // Backend: POST /api/auth/register with { name, email, password }
    await new Promise((r) => setTimeout(r, 1400));
    setSuccess(true);
    setTimeout(() => { window.location.href = '/dashboard'; }, 1500);
  };

  if (success) {
    return (
      <div className="text-center py-8 space-y-3 animate-fadeIn">
        <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
          <Check size={24} className="text-emerald-600" />
        </div>
        <h3 className="text-base font-700 text-foreground">Account created!</h3>
        <p className="text-sm text-muted-foreground">Redirecting you to your dashboard...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="signup-name" className="block text-sm font-600 text-foreground">Full name</label>
        <input
          id="signup-name"
          type="text"
          autoComplete="name"
          placeholder="Your Name"
          className="input-field"
          {...register('name', { required: 'Full name is required', minLength: { value: 2, message: 'Name too short' } })}
        />
        {errors.name && <p className="text-xs text-red-600 font-500">{errors.name.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="signup-email" className="block text-sm font-600 text-foreground">Email address</label>
        <input
          id="signup-email"
          type="email"
          autoComplete="email"
          placeholder="YourName@example.com"
          className="input-field"
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
          })}
        />
        {errors.email && <p className="text-xs text-red-600 font-500">{errors.email.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="signup-password" className="block text-sm font-600 text-foreground">Password</label>
        <p className="text-xs text-muted-foreground">At least 8 characters with a number or symbol</p>
        <div className="relative">
          <input
            id="signup-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Create a strong password"
            className="input-field pr-10"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Minimum 8 characters' },
              pattern: { value: /(?=.*[0-9!@#$%^&*])/, message: 'Must include a number or symbol' },
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-red-600 font-500">{errors.password.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="signup-confirm" className="block text-sm font-600 text-foreground">Confirm password</label>
        <div className="relative">
          <input
            id="signup-confirm"
            type={showConfirm ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Repeat your password"
            className="input-field pr-10"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (v) => v === password || 'Passwords do not match',
            })}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showConfirm ? 'Hide password' : 'Show password'}
          >
            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-xs text-red-600 font-500">{errors.confirmPassword.message}</p>}
      </div>

      <div className="flex items-start gap-2">
        <input
          id="terms"
          type="checkbox"
          className="w-4 h-4 mt-0.5 rounded border-border accent-primary flex-shrink-0"
          {...register('terms', { required: 'You must accept the terms' })}
        />
        <label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed">
          I agree to PayMind&apos;s{' '}
          <span className="text-primary font-600 cursor-pointer hover:underline">Terms of Service</span>
          {' '}and{' '}
          <span className="text-primary font-600 cursor-pointer hover:underline">Privacy Policy</span>
        </label>
      </div>
      {errors.terms && <p className="text-xs text-red-600 font-500">{errors.terms.message}</p>}

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3">
        {isSubmitting ? (
          <><Loader2 size={16} className="animate-spin" /> Creating account...</>
        ) : (
          <><span>Create free account</span> <ArrowRight size={16} /></>
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
          {activeTab === 'login' ? 'Welcome back' : 'Get started free'}
        </h2>
        <p className="text-sm text-muted-foreground mt-1.5">
          {activeTab === 'login' ?'Sign in to see your subscription overview' :'Create your account to start tracking subscriptions'}
        </p>
      </div>

      {/* Tabs */}
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

      {/* Form */}
      <div className="animate-fadeIn" key={`form-${activeTab}`}>
        {activeTab === 'login' ? (
          <LoginForm onFillCredentials={() => {}} />
        ) : (
          <SignupForm />
        )}
      </div>

      {/* Switch tab */}
      <p className="text-center text-sm text-muted-foreground">
        {activeTab === 'login' ? (
          <>Don&apos;t have an account?{' '}
            <button onClick={() => setActiveTab('signup')} className="text-primary font-600 hover:underline">
              Sign up free
            </button>
          </>
        ) : (
          <>Already have an account?{' '}
            <button onClick={() => setActiveTab('login')} className="text-primary font-600 hover:underline">
              Sign in
            </button>
          </>
        )}
      </p>
    </div>
  );
}