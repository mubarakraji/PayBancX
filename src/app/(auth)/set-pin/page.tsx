'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { AuthButton } from '@/components/auth/AuthButton';

export default function SetPINPage() {
  const [pin, setPin] = useState(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
  const [step, setStep] = useState(1);
  
  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);
  const confirmPinRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handlePinChange = (index: number, value: string, arrType: 'pin' | 'confirm') => {
    if (value.length > 1) return;
    const arr = arrType === 'pin' ? [...pin] : [...confirmPin];
    arr[index] = value;
    if (arrType === 'pin') setPin(arr);
    else setConfirmPin(arr);

    if (value && index < 3) {
      const refs = arrType === 'pin' ? pinRefs.current : confirmPinRefs.current;
      refs[index + 1]?.focus();
    }
  };

  const pinFilled = pin.every((p) => p);
  const confirmPinFilled = confirmPin.every((p) => p);
  const pinsMatch = pin.join('') === confirmPin.join('');

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
              className="text-white text-3xl font-bold leading-tight mb-3 font-[family-name:Syne]"
            >
              Secure your<br />transactions
            </h2>
            <p className="text-[#9fd4cf] text-xs leading-relaxed max-w-[220px]">
              Create a 4-digit PIN to confirm all your payments and keep your account safe.
            </p>

            <div className="flex flex-col gap-2 mt-5">
              {['Quick setup', 'Extra security', 'Peace of mind'].map((f) => (
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

          {step === 1 ? (
            <>
              <div className="mb-5">
                <h1
                  className="text-[#1a2e2c] text-2xl font-bold mb-1 font-[family-name:Syne]"
                >
                  Set your PIN
                </h1>
                <p className="text-[#7a9490] text-xs">Create a 4-digit PIN to secure your transactions</p>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-medium text-[#1C3F3B] mb-3">Enter PIN</label>
                <div className="flex justify-center gap-3">
                  {pin.map((value, index) => (
                    <input
                      key={`pin-${index}`}
                      ref={(el) => {
                        pinRefs.current[index] = el;
                      }}
                      type="password"
                      maxLength={1}
                      value={value}
                      onChange={(e) => handlePinChange(index, e.target.value, 'pin')}
                      className={`w-14 h-14 bg-white border rounded-lg font-bold text-2xl text-center outline-none transition-all ${
                        value
                          ? 'border-[#1C3F3B]/30 text-[#1C3F3B]'
                          : 'border-[#e0e7e6]'
                      } focus:border-[#1C3F3B]/25 focus:bg-[#1C3F3B]/5`}
                      placeholder="•"
                    />
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-medium text-[#1C3F3B] mb-3">Confirm PIN</label>
                <div className="flex justify-center gap-3">
                  {confirmPin.map((value, index) => (
                    <input
                      key={`confirm-${index}`}
                      ref={(el) => {
                        confirmPinRefs.current[index] = el;
                      }}
                      type="password"
                      maxLength={1}
                      value={value}
                      onChange={(e) => handlePinChange(index, e.target.value, 'confirm')}
                      className={`w-14 h-14 bg-white border rounded-lg font-bold text-2xl text-center outline-none transition-all ${
                        value
                          ? 'border-[#2D5D59]/30 text-[#2D5D59]'
                          : 'border-[#e0e7e6]'
                      } focus:border-[#2D5D59]/25 focus:bg-[#2D5D59]/5`}
                      placeholder="•"
                    />
                  ))}
                </div>
              </div>

              {!pinsMatch && confirmPinFilled && (
                <p className="text-xs text-red-500 text-center mb-4">PINs do not match. Please try again.</p>
              )}

              <AuthButton
                onClick={() => pinFilled && confirmPinFilled && pinsMatch && setStep(2)}
                disabled={!pinFilled || !confirmPinFilled || !pinsMatch}
              >
                Set PIN & Continue
              </AuthButton>

              <div className="text-center mt-6">
                <Link href="/dashboard/home" className="text-sm text-[#2D5D59] font-semibold hover:opacity-75 transition-opacity">
                  Skip for now
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-[#2D5D59]/10 border border-[#2D5D59]/25 rounded-full flex items-center justify-center mb-6">
                  <span className="text-4xl">✓</span>
                </div>

                <h1
                  className="text-[#1a2e2c] text-3xl font-bold mb-2 font-[family-name:Syne]"
                >
                  PIN Set! 🎉
                </h1>
                <p className="text-[#7a9490] text-sm mb-8 max-w-sm">
                  Your transaction PIN has been successfully set. You&apos;ll need it to confirm payments.
                </p>

                <Link href="/dashboard/home" className="w-full max-w-xs">
                  <AuthButton>Go to Dashboard</AuthButton>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

