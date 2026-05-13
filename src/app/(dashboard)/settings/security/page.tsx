/* eslint-disable @next/next/no-style-component-with-dynamic-styles */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PINModal from '@/components/common/PINModal';
import PasswordModal from '@/components/common/PasswordModal';
import PrivacyModal from '@/components/common/PrivacyModal';

const teal = '#0F172A';
const tealLight = 'rgba(15, 23, 42, 0.08)';

const securityItems = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={teal} strokeWidth="1.8">
        <circle cx="12" cy="12" r="1" />
        <circle cx="12" cy="12" r="7" />
        <circle cx="12" cy="12" r="11" />
      </svg>
    ),
    bg: tealLight,
    label: 'PIN',
    sub: 'Set your transaction PIN',
    id: 'pin',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={teal} strokeWidth="1.8">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    bg: tealLight,
    label: 'Password',
    sub: 'Change your password',
    id: 'password',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={teal} strokeWidth="1.8">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    bg: tealLight,
    label: 'Privacy',
    sub: 'Manage privacy settings',
    id: 'privacy',
  },
];

function SecurityRow({ icon, bg, label, sub, onClick }: { icon: React.ReactNode; bg: string; label: string; sub: string; onClick: () => void }) {
  const [pressed, setPressed] = useState(false);
  
  return (
    <div
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onClick={onClick}
      className={`flex items-center gap-2 px-2.5 py-2 mb-1 cursor-pointer transition-all rounded-lg border select-none ${
        pressed
          ? 'bg-[#2D5D59]/8 border-[#2D5D59]'
          : 'bg-white border-[#E2E8F0] hover:border-[#2D5D59] hover:scale-[1.02]'
      }`}
    >
      <div
        className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center"
        style={{ background: bg }}
      >
        {icon}
      </div>
      <div className="flex-1">
        <div className="font-semibold text-[11px] text-[#333333]">{label}</div>
        <div className="text-[10px] text-[#888888] mt-0.5">{sub}</div>
      </div>
      <svg width="6" height="10" viewBox="0 0 8 14" fill="none" className="flex-shrink-0">
        <path d="M1 1l6 6-6 6" stroke="rgba(45, 93, 89, 0.3)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export default function SecurityPage() {
  const router = useRouter();
  const [isPINOpen, setIsPINOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F6F8]">
      {/* Header */}
      <div className="bg-white border-b border-[#2D5D59]/10">
        <div className="max-w-5xl mx-auto px-3 xs:px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 md:py-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.back()}
              title="Go back"
              className="md:hidden p-1 -ml-1 hover:bg-[#2D5D59]/5 rounded-lg transition-colors"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-base sm:text-lg md:text-xl font-bold text-[#333333] font-[family-name:Syne]">Security</h1>
              <p className="text-[#888888] text-[10px] mt-0.5">Manage your password and authentication</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-3 xs:px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 md:py-3">
        {/* Security Settings Section */}
        <div className="mb-4">
          <h2 className="text-[11px] sm:text-xs font-bold text-[#333333] mb-2 px-1 font-[family-name:Syne]">Security Settings</h2>
          <div className="space-y-0.5">
            {securityItems.map((item) => (
              <SecurityRow
                key={item.id}
                icon={item.icon}
                bg={item.bg}
                label={item.label}
                sub={item.sub}
                onClick={() => {
                  if (item.id === 'pin') setIsPINOpen(true);
                  else if (item.id === 'password') setIsPasswordOpen(true);
                  else if (item.id === 'privacy') setIsPrivacyOpen(true);
                }}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Modals */}
      <PINModal isOpen={isPINOpen} onClose={() => setIsPINOpen(false)} />
      <PasswordModal isOpen={isPasswordOpen} onClose={() => setIsPasswordOpen(false)} />
      <PrivacyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
    </div>
  );
}
