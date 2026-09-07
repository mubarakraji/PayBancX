'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthButton } from '@/components/auth/AuthButton';
import { toastError, toastSuccess } from '@/hooks/useToast';

function VerifyResetCodeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [otpTimer, setOtpTimer] = useState(0);
  const [isOtpExpired, setIsOtpExpired] = useState(false);

  useEffect(() => {
    const expiresAtStr = localStorage.getItem('otpExpiresAt');
    if (expiresAtStr) {
      const expiresAt = new Date(expiresAtStr).getTime();
      const now = new Date().getTime();
      const remainingSeconds = Math.max(0, Math.floor((expiresAt - now) / 1000));
      setOtpTimer(remainingSeconds);
      
      if (remainingSeconds <= 0) {
        setIsOtpExpired(true);
      }
    }
  }, []);

  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (otpTimer === 0) {
      setIsOtpExpired(true);
    }
  }, [otpTimer]);

  useEffect(() => {
    if (resendTimer > 0 && isResending) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (resendTimer === 0 && isResending) {
      setIsResending(false);
    }
  }, [resendTimer, isResending]);

  const handleCodeChange = (index: number, value: string) => {
    if (isOtpExpired) {
      toastError('OTP has expired. Please request a new code.');
      return;
    }

    if (!/^\d*$/.test(value)) return;
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }

    if (value && index === 5) {
      const completeCode = newCode.join('');
      if (completeCode.length === 6) {
        handleSubmit(completeCode);
      }
    }
  };

  const handleBackspace = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
      const newCode = [...code];
      newCode[index - 1] = '';
      setCode(newCode);
    }
  };

  const handleSubmit = async (codeValue?: string) => {
    const codeStr = codeValue || code.join('');
    
    if (codeStr.length !== 6) {
      toastError('Please enter a valid 6-digit code');
      return;
    }

    if (!email) {
      toastError('Email is missing. Please start over.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/v1/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: codeStr,
          email,
          purpose: 'RESET_PASSWORD',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Code verification failed');
      }

      toastSuccess('Code verified! Redirecting...');
      
      if (data.token || data.data?.token) {
        const token = data.token || data.data.token;
        localStorage.setItem('resetToken', token);
        localStorage.setItem('resetEmail', email);
      }

      setTimeout(() => {
        router.push('/reset-password');
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Code verification failed. Please try again.';
      toastError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toastError('Email is missing. Please start over.');
      return;
    }

    setIsResending(true);
    setResendTimer(45);

    try {
      const response = await fetch('/api/v1/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, purpose: 'RESET_PASSWORD' }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.message || data.errors || 'Failed to resend code';
        throw new Error(Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg);
      }

      toastSuccess('Code resent to your email! Check your inbox.');
      setCode(['', '', '', '', '', '']);
      
      if (data.data?.expiresAt) {
        localStorage.setItem('otpExpiresAt', data.data.expiresAt);
        const expiresAt = new Date(data.data.expiresAt).getTime();
        const now = new Date().getTime();
        const remainingSeconds = Math.max(0, Math.floor((expiresAt - now) / 1000));
        setOtpTimer(remainingSeconds);
      }
      setIsOtpExpired(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to resend code. Please try again.';
      toastError(errorMessage);
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div
        className="w-full max-w-[900px] min-h-[520px] rounded-3xl overflow-hidden flex shadow-2xl"
        style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.45)' }}
      >
        {/* ── LEFT PANEL ── */}
        <div
          className="hidden md:flex flex-col justify-between relative overflow-hidden w-[45%] p-10"
          style={{
            background: 'linear-gradient(145deg, #2D5D59 0%, #1a3a37 60%, #0f2422 100%)',
          }}
        >
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

          <div className="relative z-10 flex-1 flex flex-col justify-center py-8">
            <h2
              className="text-white text-4xl font-bold leading-tight mb-4 font-[family-name:Syne]"
            >
              Verify your<br />code
            </h2>
            <p className="text-[#A8D8D0] text-sm leading-relaxed max-w-[220px]">
              We sent a 6-digit code to your email. Enter it to reset your password.
            </p>

            <div className="flex flex-col gap-2.5 mt-7">
              {['Quick verification', 'Secure process', 'Instant access'].map((f) => (
                <div key={f} className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#5ECFB8]/20 border border-[#5ECFB8]/50 flex items-center justify-center flex-shrink-0">
                    <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                      <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="#5ECFB8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="text-[#C8E8E4] text-xs">{f}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10">
            <p className="text-[#6BA8A2] text-xs">© 2025 Paybancx. All rights reserved.</p>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="flex-1 flex flex-col justify-center bg-[#f7f9f8] px-10 py-10 md:py-12">
          <span className="text-[#2D5D59] font-semibold md:hidden mb-8 block">Paybancx</span>

          <div className="mb-6">
            <h1
              className="text-[#1a2e2c] text-3xl font-bold mb-1.5 font-[family-name:Syne]"
            >
              Verify your code
            </h1>
            <p className="text-[#7a9490] text-sm">We sent a 6-digit code to {email}</p>
          </div>

          <p className={`text-xs mb-6 font-medium ${otpTimer < 60 ? 'text-red-500' : 'text-[#7a9490]'}`}>
            Code expires in: <span className="font-bold">{Math.floor(otpTimer / 60)}:{String(otpTimer % 60).padStart(2, '0')}</span>
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="w-full"
          >
            <div className="flex gap-2.5 justify-center mb-6">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleBackspace(index, e)}
                  disabled={isLoading}
                  className="w-12 h-12 text-center text-xl font-bold rounded-lg border border-[#e0e7e6] bg-white text-[#2D5D59] placeholder-[#888888] focus:outline-none focus:border-[#2D5D59] focus:bg-[#2D5D59]/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  placeholder="0"
                />
              ))}
            </div>

            <AuthButton type="submit" disabled={isLoading || isOtpExpired}>
              {isOtpExpired ? 'Code Expired' : isLoading ? 'Verifying...' : 'Verify Code'}
            </AuthButton>
          </form>

          <div className="flex items-center gap-3 my-4">
            <span className="flex-1 h-px bg-[#d6e2e0]" />
            <span className="text-xs text-[#9ab4b0]">or</span>
            <span className="flex-1 h-px bg-[#d6e2e0]" />
          </div>

          <p className="text-center text-xs text-[#7a9490]">
            {isOtpExpired ? (
              <button
                onClick={handleResend}
                disabled={isLoading || isResending}
                className="text-[#2D5D59] font-medium hover:opacity-75 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Code expired. Click here to get a new one
              </button>
            ) : isResending ? (
              <>
                Resend code in <span className="text-[#2D5D59] font-medium ml-1">{resendTimer}s</span>
              </>
            ) : (
              <>
                Didn&apos;t receive the code?
                <button
                  onClick={handleResend}
                  disabled={isLoading}
                  className="text-[#2D5D59] font-medium ml-2 hover:opacity-75 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Resend
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyResetCodePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyResetCodeContent />
    </Suspense>
  );
}

