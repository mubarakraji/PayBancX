'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthButton } from '@/components/auth/AuthButton';
import { MdLock, MdRemoveRedEye, MdCheck, MdError, MdCheckCircle } from 'react-icons/md';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('resetToken');
    const storedEmail = localStorage.getItem('resetEmail');
    
    if (storedToken) {
      setToken(storedToken);
      setEmail(storedEmail);
    } else {
      const urlToken = searchParams.get('token') || searchParams.get('reset_token');
      setToken(urlToken);
    }
  }, [searchParams]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token. Please request a new password reset.');
    }
  }, [token]);

  const handlePasswordChange = (value: string) => {
    setFormData({ ...formData, newPassword: value });
    let strength = 0;
    if (value.length > 0) strength += 1;
    if (value.length > 8) strength += 1;
    if (/[0-9]/.test(value)) strength += 1;
    if (/[!@#$%^&*]/.test(value)) strength += 1;
    setPasswordStrength(strength);
    
    if (validationErrors.newPassword) {
      setValidationErrors({ ...validationErrors, newPassword: '' });
    }
  };

  const isPasswordMatch = formData.confirmPassword === formData.newPassword && formData.confirmPassword.length > 0;

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    } else if (!/[0-9]/.test(formData.newPassword)) {
      errors.newPassword = 'Password must contain at least one number';
    } else if (!/[!@#$%^&*]/.test(formData.newPassword)) {
      errors.newPassword = 'Password must contain at least one special character (!@#$%^&*)';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('Invalid reset token. Please request a new password reset link.');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      setSuccess('Password reset successfully! Redirecting to login...');
      
      localStorage.removeItem('resetToken');
      localStorage.removeItem('resetEmail');
      
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reset password. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
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

          <div className="relative z-10 flex-1 flex flex-col justify-center py-8">
            <h2
              className="text-white text-4xl font-bold leading-tight mb-4 font-[family-name:Syne]"
            >
              Create a new<br />password
            </h2>
            <p className="text-[#9fd4cf] text-xs leading-relaxed max-w-[220px]">
              Make sure it's strong and unique to keep your account safe and secure.
            </p>

            <div className="flex flex-col gap-2 mt-5">
              {['8+ characters minimum', 'Use numbers & symbols', 'Keep it unique'].map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#4db3a8]/20 border border-[#4db3a8]/50 flex items-center justify-center flex-shrink-0">
                    <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
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
          <span className="text-[#1C3F3B] font-semibold md:hidden mb-6 block">Paybancx</span>

          <div className="mb-5">
            <h1
              className="text-[#1a2e2c] text-2xl font-bold mb-1 font-[family-name:Syne]"
            >
              Reset your password
            </h1>
            <p className="text-[#7a9490] text-xs">Create a new strong password</p>
          </div>

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

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <div>
              <label className="text-xs font-medium text-[#1C3F3B] tracking-wide">New password</label>
              <div className="relative flex items-center mt-1.5">
                <span className="absolute left-3.5 text-[#888888]">
                  <MdLock className="w-3.5 h-3.5" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="New password"
                  className={`w-full bg-white border ${validationErrors.newPassword ? 'border-red-500/50' : 'border-[#e0e7e6]'} rounded-lg py-2.5 pl-10 pr-3.5 font-['DM_Sans'] text-sm text-[#1C3F3B] outline-none transition-all focus:border-[#1C3F3B]/25 focus:bg-[#1C3F3B]/5`}
                  value={formData.newPassword}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                />
                <span
                  className="absolute right-3.5 text-[#888888] cursor-pointer hover:text-[#1C3F3B] transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <MdRemoveRedEye className="w-3.5 h-3.5" />
                </span>
              </div>

              {validationErrors.newPassword && (
                <p className="text-xs text-red-500 mt-1 ml-0.5">{validationErrors.newPassword}</p>
              )}

              {formData.newPassword && (
                <div className="flex flex-col gap-1.5 mt-2">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`flex-1 h-1 rounded-full ${
                          i < passwordStrength ? 'bg-[#2D5D59]' : 'bg-[#d6e2e0]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-xs ${passwordStrength >= 3 ? 'text-[#2D5D59]' : 'text-[#888888]'}`}>
                    {passwordStrength < 2 ? 'Weak' : passwordStrength < 3 ? 'Medium' : 'Strong'} password
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-[#2D5D59] tracking-wide">Confirm new password</label>
              <div className="relative flex items-center mt-1.5">
                <span className="absolute left-3.5 text-[#888888]">
                  <MdLock className="w-4 h-4" />
                </span>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  className={`w-full bg-white border ${validationErrors.confirmPassword ? 'border-red-500/50' : 'border-[#e0e7e6]'} rounded-lg py-2.5 pl-10 pr-10 font-['DM_Sans'] text-sm text-[#2D5D59] outline-none transition-all focus:border-[#2D5D59]/25 focus:bg-[#2D5D59]/5`}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
                <span
                  className={`absolute right-3.5 cursor-pointer transition-colors ${
                    isPasswordMatch ? 'text-[#2D5D59]' : 'text-[#888888] hover:text-[#2D5D59]'
                  }`}
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {isPasswordMatch ? (
                    <MdCheck className="w-4 h-4" />
                  ) : (
                    <MdRemoveRedEye className="w-4 h-4" />
                  )}
                </span>
              </div>

              {validationErrors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1 ml-0.5">{validationErrors.confirmPassword}</p>
              )}
            </div>

            <AuthButton type="submit" disabled={isLoading || (!!error && !token)}>
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </AuthButton>
          </form>

          <div className="flex items-center gap-3 my-4">
            <span className="flex-1 h-px bg-[#d6e2e0]" />
            <span className="text-xs text-[#9ab4b0]">or</span>
            <span className="flex-1 h-px bg-[#d6e2e0]" />
          </div>

          <p className="text-center text-sm text-[#7a9490]">
            Remember your password?{' '}
            <Link
              href="/login"
              className="text-[#2D5D59] font-semibold hover:opacity-75 transition-opacity"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}

