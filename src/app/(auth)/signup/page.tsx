'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormGroup } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { PasswordStrengthIndicator } from '@/components/auth/PasswordStrengthIndicator';
import { EmailValidationIndicator } from '@/components/auth/EmailValidationIndicator';
import { MdPerson, MdEmail, MdPhone, MdLock, MdRemoveRedEye, MdError } from 'react-icons/md';
import { useAuth } from '@/hooks/useAuth';

export default function SignUpPage() {
  const router = useRouter();
  const { signup, isLoading, isAuthenticated, error: authError } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/home');
    }
  }, [isAuthenticated, router]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.phone.replace(/\s|-|\(|\)/g, ''))) {
      errors.phone = 'Please enter a valid phone number (10-15 digits)';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/[0-9]/.test(formData.password)) {
      errors.password = 'Password must contain at least one number';
    } else if (!/[A-Z]/.test(formData.password)) {
      errors.password = 'Password must contain at least one uppercase letter';
    } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password)) {
      errors.password = 'Password must contain at least one special character (!@#$%^&*)';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await signup({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
    } catch (err) {
      console.error('Signup error:', err);
    }
  };

  const displayError = authError;

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
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

          <div className="relative z-10 flex-1 flex flex-col justify-center py-8">
            <h2
              className="text-white text-3xl font-bold leading-tight mb-3 font-[family-name:Syne]"
            >
              Join thousands<br />managing bills
            </h2>
            <p className="text-[#9fd4cf] text-xs leading-relaxed max-w-[220px]">
              Get started with Paybancx and take control of your bill payments today.
            </p>

            <div className="flex flex-col gap-2 mt-5">
              {['Quick signup', '100% secure', 'Start paying instantly'].map((f) => (
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
        <div className="flex-1 flex flex-col justify-center bg-[#f7f9f8] px-8 py-8 md:py-10 overflow-y-auto max-h-screen md:max-h-none">
          <span className="text-[#1C3F3B] font-semibold md:hidden mb-6 block">Paybancx</span>

          <div className="mb-5">
            <h1
              className="text-[#1a2e2c] text-2xl font-bold mb-1 font-[family-name:Syne]"
            >
              Create your account
            </h1>
            <p className="text-[#7a9490] text-xs">Sign up to manage your bills</p>
          </div>

          {displayError && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 rounded-lg flex items-center gap-2">
              <MdError className="text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-500">{displayError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
            {/* First Name */}
            <div>
              <FormGroup
                label="First name"
                icon={<MdPerson className="w-3.5 h-3.5" />}
                type="text"
                placeholder="Olanrewaju"
                value={formData.firstName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFormData({ ...formData, firstName: e.target.value });
                  if (validationErrors.firstName) {
                    setValidationErrors({ ...validationErrors, firstName: '' });
                  }
                }}
              />
              {validationErrors.firstName && (
                <p className="text-xs text-red-500 mt-1 ml-0.5">{validationErrors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <FormGroup
                label="Last name"
                icon={<MdPerson className="w-3.5 h-3.5" />}
                type="text"
                placeholder="Afolabi"
                value={formData.lastName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFormData({ ...formData, lastName: e.target.value });
                  if (validationErrors.lastName) {
                    setValidationErrors({ ...validationErrors, lastName: '' });
                  }
                }}
              />
              {validationErrors.lastName && (
                <p className="text-xs text-red-500 mt-1 ml-0.5">{validationErrors.lastName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <FormGroup
                label="Email address"
                icon={<MdEmail className="w-3.5 h-3.5" />}
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (validationErrors.email) {
                    setValidationErrors({ ...validationErrors, email: '' });
                  }
                }}
              />
              <EmailValidationIndicator email={formData.email} />
              {validationErrors.email && (
                <p className="text-xs text-red-500 mt-1 ml-0.5">{validationErrors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <FormGroup
                label="Phone number"
                icon={<MdPhone className="w-3.5 h-3.5" />}
                type="tel"
                placeholder="+234..."
                value={formData.phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFormData({ ...formData, phone: e.target.value });
                  if (validationErrors.phone) {
                    setValidationErrors({ ...validationErrors, phone: '' });
                  }
                }}
              />
              {validationErrors.phone && (
                <p className="text-xs text-red-500 mt-1 ml-0.5">{validationErrors.phone}</p>
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
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (validationErrors.password) {
                    setValidationErrors({ ...validationErrors, password: '' });
                  }
                }}
              />
              <div className="mt-2">
                <PasswordStrengthIndicator password={formData.password} showDetails={true} />
              </div>
              {validationErrors.password && (
                <p className="text-xs text-red-500 mt-2 ml-0.5">{validationErrors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <FormGroup
                label="Confirm password"
                icon={<MdLock className="w-3.5 h-3.5" />}
                endIcon={<MdRemoveRedEye className="w-3.5 h-3.5" />}
                onEndIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFormData({ ...formData, confirmPassword: e.target.value });
                  if (validationErrors.confirmPassword) {
                    setValidationErrors({ ...validationErrors, confirmPassword: '' });
                  }
                }}
              />
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <p className="text-xs text-green-600 mt-1 ml-0.5 font-medium">✓ Passwords match</p>
              )}
              {validationErrors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1 ml-0.5">{validationErrors.confirmPassword}</p>
              )}
            </div>

            <AuthButton type="submit" disabled={isLoading} className="mt-2">
              {isLoading ? 'Creating account...' : 'Create Account'}
            </AuthButton>
          </form>

          <div className="flex items-center gap-3 my-3.5">
            <span className="flex-1 h-px bg-[#d6e2e0]" />
            <span className="text-xs text-[#9ab4b0]">or</span>
            <span className="flex-1 h-px bg-[#d6e2e0]" />
          </div>

          <p className="text-center text-xs text-[#7a9490]">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-[#1C3F3B] font-semibold hover:opacity-75 transition-opacity"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

