'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormGroup } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { MdEmail, MdCheckCircle, MdError } from 'react-icons/md';
import { useAuth } from '@/hooks/useAuth';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { resetPassword, isLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationError, setValidationError] = useState('');

  const validateEmail = (emailValue: string): boolean => {
    if (!emailValue.trim()) {
      setValidationError('Email or phone number is required');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\d\s+\-()]+$/;
    
    if (!emailRegex.test(emailValue) && !phoneRegex.test(emailValue)) {
      setValidationError('Please enter a valid email or phone number');
      return false;
    }
    
    setValidationError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateEmail(email)) {
      return;
    }

    try {
      const response = await resetPassword(email);
      
      if (response?.data?.expiresAt) {
        localStorage.setItem('otpExpiresAt', response.data.expiresAt);
      }
      
      setSuccess('Code sent! Redirecting to verification page...');
      setEmail('');
      
      setTimeout(() => {
        router.push(`/verify-reset-code?email=${encodeURIComponent(email)}`);
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send reset link. Please try again.';
      setError(errorMessage);
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
          <span
            className="absolute -top-10 -left-10 w-52 h-52 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #4db3a8 0%, transparent 70%)' }}
          />
          <span
            className="absolute top-1/3 -right-14 w-56 h-56 rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #3DB89E 0%, transparent 70%)' }}
          />
          <span
            className="absolute -bottom-12 left-8 w-44 h-44 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #4db3a8 0%, transparent 70%)' }}
          />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          <div className="relative z-10">
            <span className="text-white text-lg font-semibold tracking-wide">Paybancx</span>
          </div>

          <div className="relative z-10 flex-1 flex flex-col justify-center py-6">
            <h2
              className="text-white text-4xl font-bold leading-tight mb-4 font-[family-name:Syne]"
            >
              Reset your<br />password safely
            </h2>
            <p className="text-[#9fd4cf] text-xs leading-relaxed max-w-[200px]">
              We&apos;ll help you regain access to your account in just a few simple steps.
            </p>

            <div className="flex flex-col gap-2 mt-5">
              {['Secure verification', 'Quick & easy', 'Your account protected'].map((f) => (
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

          <div className="relative z-10">
            <p className="text-[#5a9894] text-xs">© 2025 Paybancx. All rights reserved.</p>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="flex-1 flex flex-col justify-center bg-[#f7f9f8] px-8 py-8 md:py-10">
          <span className="text-[#1C3F3B] font-semibold md:hidden mb-6 block text-sm">Paybancx</span>

          <div className="mb-5">
            <h1
              className="text-[#1a2e2c] text-2xl font-bold mb-1 font-[family-name:Syne]"
            >
              Forgot your password?
            </h1>
            <p className="text-[#7a9490] text-xs">Enter your email to reset your password</p>
          </div>

          {error && (
            <div className="mb-3 p-2.5 bg-red-900/20 border border-red-500/50 rounded-lg flex items-center gap-2">
              <MdError className="text-red-500 flex-shrink-0 w-4 h-4" />
              <p className="text-xs text-red-500">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-3 p-2.5 bg-green-900/20 border border-green-500/50 rounded-lg flex items-center gap-2">
              <MdCheckCircle className="text-green-500 flex-shrink-0 w-4 h-4" />
              <p className="text-xs text-green-500">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
            <div>
              <FormGroup
                label="Email or phone number"
                icon={<MdEmail className="w-3.5 h-3.5" />}
                type="text"
                placeholder="you@example.com or +234..."
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setEmail(e.target.value);
                  if (validationError) {
                    setValidationError('');
                  }
                }}
              />
              {validationError && (
                <p className="text-xs text-red-500 mt-0.5 ml-0">{validationError}</p>
              )}
            </div>

            <AuthButton type="submit" disabled={isLoading}>
              {isLoading ? 'Sending code...' : 'Send Reset Code'}
            </AuthButton>
          </form>

          <div className="flex items-center gap-3 my-3.5">
            <span className="flex-1 h-px bg-[#d6e2e0]" />
            <span className="text-xs text-[#9ab4b0]">or</span>
            <span className="flex-1 h-px bg-[#d6e2e0]" />
          </div>

          <p className="text-center text-xs text-[#7a9490]">
            Remembered it?{' '}
            <Link
              href="/login"
              className="text-[#1C3F3B] font-semibold hover:opacity-75 transition-opacity"
            >
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

