/* eslint-disable @next/next/no-style-component-with-dynamic-styles */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormGroup } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { MdEmail, MdLock, MdRemoveRedEye } from 'react-icons/md';
import { useAuth } from '@/hooks/useAuth';
import { toastError } from '@/hooks/useToast';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, isAuthenticated, error: authError } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/home');
    }
  }, [isAuthenticated, router]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      toastError(firstError);
    }

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await login(email, password);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
      toastError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-3">
      {/* Card container */}
      <div
        className="w-full max-w-[850px] min-h-[480px] rounded-2xl overflow-hidden flex shadow-lg"
        style={{ boxShadow: '0 16px 48px rgba(0,0,0,0.3)' }}
      >
        {/* ── LEFT PANEL ── */}
        <div
          className="hidden md:flex flex-col justify-between relative overflow-hidden w-[45%] p-8"
          style={{
            background: 'linear-gradient(145deg, #1C3F3B 0%, #162e2a 60%, #0d1f1d 100%)',
          }}
        >
          {/* Decorative blobs */}
          <span
            className="absolute -top-10 -left-10 w-52 h-52 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #5ECFB8 0%, transparent 70%)' }}
          />
          <span
            className="absolute top-1/3 -right-14 w-56 h-56 rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #3DB89E 0%, transparent 70%)' }}
          />
          <span
            className="absolute -bottom-12 left-8 w-44 h-44 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #5ECFB8 0%, transparent 70%)' }}
          />
          {/* Subtle grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          {/* Logo / brand */}
          <div className="relative z-10">
            <span className="text-white text-lg font-semibold tracking-wide">Paybancx</span>
          </div>

          {/* Center copy */}
          <div className="relative z-10 flex-1 flex flex-col justify-center py-6">
            <h2
              className="text-white text-3xl font-bold leading-tight mb-3 font-[family-name:Syne]"
            >
              Manage your<br />bills with ease
            </h2>
            <p className="text-[#9fd4cf] text-xs leading-relaxed max-w-[200px]">
              Track payments, set reminders, and stay on top of every due date — all in one place.
            </p>

            {/* Feature pills */}
            <div className="flex flex-col gap-2 mt-5">
              {['Bill tracking & alerts', 'Secure payments', 'Spending insights'].map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#4db3a8]/20 border border-[#4db3a8]/50 flex items-center justify-center flex-shrink-0">
                    <svg width="7" height="7" viewBox="0 0 9 9" fill="none">
                      <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="#4db3a8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="text-[#b8e4df] text-xs">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom note */}
          <div className="relative z-10">
            <p className="text-[#5a9894] text-xs">© 2025 Paybancx. All rights reserved.</p>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="flex-1 flex flex-col justify-center bg-[#f7f9f8] px-8 py-8 md:py-10">
          {/* Mobile logo */}
          <span className="text-[#1C3F3B] font-semibold md:hidden mb-6 block text-sm">Paybancx</span>

          <div className="mb-5">
            <h1
              className="text-[#1a2e2c] text-2xl font-bold mb-1 font-[family-name:Syne]"
            >
              Welcome back
            </h1>
            <p className="text-[#7a9490] text-xs">Sign in to continue managing your bills</p>
          </div>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
            {/* Email */}
            <div>
              <FormGroup
                label="Email address"
                icon={<MdEmail className="w-3.5 h-3.5" />}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setEmail(e.target.value);
                  if (validationErrors.email) {
                    setValidationErrors({ ...validationErrors, email: '' });
                  }
                }}
              />
              {validationErrors.email && (
                <p className="text-xs text-red-500 mt-0.5 ml-0">{validationErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <FormGroup
                label="Password"
                icon={<MdLock className="w-3.5 h-3.5" />}
                endIcon={<MdRemoveRedEye className="w-3.5 h-3.5" />}
                onEndIconClick={() => setShowPassword(!showPassword)}
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value);
                  if (validationErrors.password) {
                    setValidationErrors({ ...validationErrors, password: '' });
                  }
                }}
              />
              {validationErrors.password && (
                <p className="text-xs text-red-500 mt-0.5 ml-0">{validationErrors.password}</p>
              )}
            </div>

            {/* Forgot password */}
            <div className="flex justify-end -mt-0.5">
              <Link
                href="/forgot-password"
                className="text-xs text-[#1C3F3B] font-medium hover:opacity-75 transition-opacity"
              >
                Forgot password?
              </Link>
            </div>

            <AuthButton type="submit" disabled={isLoading}>
              {isLoading ? 'Signing in…' : 'Sign In'}
            </AuthButton>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-3.5">
            <span className="flex-1 h-px bg-[#d6e2e0]" />
            <span className="text-xs text-[#9ab4b0]">or</span>
            <span className="flex-1 h-px bg-[#d6e2e0]" />
          </div>

          {/* Sign up prompt */}
          <p className="text-center text-xs text-[#7a9490]">
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              className="text-[#1C3F3B] font-semibold hover:opacity-75 transition-opacity"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

