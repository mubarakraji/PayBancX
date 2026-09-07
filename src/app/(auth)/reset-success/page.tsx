'use client';

import React from 'react';
import Link from 'next/link';
import { AuthButton } from '@/components/auth/AuthButton';
import { MdCheck } from 'react-icons/md';

export default function ResetSuccessPage() {
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
              You&apos;re all<br />set!
            </h2>
            <p className="text-[#A8D8D0] text-sm leading-relaxed max-w-[220px]">
              Your password has been successfully reset. You can now sign in with your new password.
            </p>

            <div className="flex flex-col gap-2.5 mt-7">
              {['Password updated', 'Account secured', 'Ready to use'].map((f) => (
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
        <div className="flex-1 flex flex-col justify-center items-center bg-[#f7f9f8] px-10 py-10 md:py-12">
          <span className="text-[#2D5D59] font-semibold md:hidden mb-8 block">Paybancx</span>

          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-[#2D5D59]/10 border border-[#2D5D59]/25 rounded-full flex items-center justify-center mb-6">
              <MdCheck className="w-10 h-10 text-[#2D5D59]" />
            </div>

            <h1
              className="text-[#1a2e2c] text-3xl font-bold mb-2 font-[family-name:Syne]"
            >
              All done! 🎉
            </h1>
            <p className="text-[#7a9490] text-sm mb-8 max-w-sm">
              Your password has been successfully reset. You can now log in with your new password.
            </p>

            <Link href="/login" className="w-full max-w-xs">
              <AuthButton>Back to Login</AuthButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

