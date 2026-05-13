'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthButton } from '@/components/auth/AuthButton';
import { MdError, MdCheckCircle } from 'react-icons/md';
import { useAuth } from '@/hooks/useAuth';

export default function OTPVerificationPage() {
  const router = useRouter();
  const { verifyOTP: verifyOTPContext, isLoading } = useAuth();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(45);
  const [otpTimer, setOtpTimer] = useState(60);
  const [isOtpExpired, setIsOtpExpired] = useState(false);
  const [phone, setPhone] = useState('+234 812 ***4567');

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
    } else if (resendTimer === 0) {
      setIsResending(false);
    }
  }, [resendTimer, isResending]);

  const handleOtpChange = (index: number, value: string) => {
    if (isOtpExpired) {
      setError('OTP has expired. Please request a new code.');
      return;
    }

    if (!/^\d*$/.test(value)) return;
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (error) setError('');

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }

    if (value && index === 5) {
      const completeOtp = newOtp.join('');
      if (completeOtp.length === 6) {
        handleSubmit(completeOtp);
      }
    }
  };

  const handleBackspace = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
    }
  };

  const handleSubmit = async (otpValue?: string) => {
    const otpCode = otpValue || otp.join('');
    
    if (otpCode.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setError('');
    setSuccess('');

    try {
      await verifyOTPContext(otpCode);
      setSuccess('OTP verified successfully! Redirecting...');
      
      setTimeout(() => {
        router.push('/set-pin');
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid OTP. Please try again.';
      setError(errorMessage);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setResendTimer(45);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/v1/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ purpose: 'REGISTER' }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend OTP');
      }

      setSuccess('OTP resent! Check your phone/email.');
      setOtp(['', '', '', '', '', '']);
      setOtpTimer(60);
      setIsOtpExpired(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to resend OTP. Please try again.';
      setError(errorMessage);
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

          <div className="relative z-10 flex-1 flex flex-col justify-center py-8">
            <h2
              className="text-white text-4xl font-bold leading-tight mb-4 font-[family-name:Syne]"
            >
              Almost<br />there
            </h2>
            <p className="text-[#A8D8D0] text-sm leading-relaxed max-w-[220px]">
              Verify your phone number to complete your account setup and start paying bills.
            </p>

            <div className="flex flex-col gap-2.5 mt-7">
              {['Quick verification', 'One-time code', 'Instant access'].map((f) => (
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
              Verify your phone
            </h1>
            <p className="text-[#7a9490] text-sm">We sent a 6-digit code to {phone}</p>
          </div>

          <p className={`text-xs mb-5 font-medium ${otpTimer < 60 ? 'text-red-500' : 'text-[#7a9490]'}`}>
            Code expires in: <span className="font-bold">{Math.floor(otpTimer / 60)}:{String(otpTimer % 60).padStart(2, '0')}</span>
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 rounded-lg flex items-center gap-2">
              <MdError className="text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-900/20 border border-green-500/50 rounded-lg flex items-center gap-2">
              <MdCheckCircle className="text-green-500 flex-shrink-0" />
              <p className="text-sm text-green-500">{success}</p>
            </div>
          )}

          <div className="flex justify-center gap-2.5 mb-6">
            {otp.map((value, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                inputMode="numeric"
                value={value}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleBackspace(index, e)}
                className={`w-12 h-12 bg-white border rounded-lg font-bold text-xl text-center outline-none transition-all ${
                  value
                    ? 'border-[#2D5D59]/30 text-[#2D5D59]'
                    : 'border-[#e0e7e6]'
                } focus:border-[#2D5D59]/25 focus:bg-[#2D5D59]/5`}
                placeholder="—"
                autoComplete="off"
              />
            ))}
          </div>

          <AuthButton type="button" onClick={() => handleSubmit()} disabled={isLoading || isOtpExpired || otp.join('').length !== 6}>
            {isLoading ? 'Verifying...' : isOtpExpired ? 'Code Expired' : 'Verify Code'}
          </AuthButton>

          <div className="flex items-center gap-3 my-4">
            <span className="flex-1 h-px bg-[#d6e2e0]" />
            <span className="text-xs text-[#9ab4b0]">or</span>
            <span className="flex-1 h-px bg-[#d6e2e0]" />
          </div>

          <p className="text-center text-xs text-[#7a9490] mb-4">
            {isOtpExpired ? (
              <button
                onClick={handleResend}
                disabled={isLoading || isResending}
                className="text-[#2D5D59] font-medium hover:opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Code expired. Get a new one
              </button>
            ) : isResending ? (
              <>
                Didn&apos;t get the code?
                <span className="text-[#2D5D59] ml-2 font-medium">Resend in 00:{resendTimer.toString().padStart(2, '0')}</span>
              </>
            ) : (
              <>
                Didn&apos;t get the code?
                <button
                  onClick={handleResend}
                  disabled={isLoading}
                  className="text-[#2D5D59] ml-2 font-medium hover:opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Resend now
                </button>
              </>
            )}
          </p>

          <p className="text-center text-sm text-[#7a9490]">
            Wrong number?{' '}
            <Link
              href="/signup"
              className="text-[#2D5D59] font-semibold hover:opacity-75 transition-opacity"
            >
              Change it
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

