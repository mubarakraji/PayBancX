/* eslint-disable @next/next/no-style-component-with-dynamic-styles */
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import PersonalInfoModal from '@/components/common/PersonalInfoModal';
import KYCVerificationModal from '@/components/common/KYCVerificationModal';
import { toastSuccess, toastError } from '@/hooks/useToast';

const teal = '#0F172A';
const tealLight = 'rgba(15, 23, 42, 0.08)';

const settingsItems = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e8960a" strokeWidth="1.8">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    bg: 'rgba(232, 150, 10, 0.08)',
    label: 'Security',
    sub: 'Password and authentication',
    href: '/settings/security',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7c5cbf" strokeWidth="1.8">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
    bg: 'rgba(124, 92, 191, 0.08)',
    label: 'Notifications',
    sub: 'Manage notifications',
    href: '/settings/notifications',
  },
];

const supportItems = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e05252" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    bg: 'rgba(224, 82, 82, 0.08)',
    label: 'Help Center',
    sub: 'Get help and support',
    href: '/settings/help-center',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.8">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    bg: 'rgba(136, 136, 136, 0.08)',
    label: 'Terms & Privacy',
    sub: 'Legal information',
    href: '/settings/terms-privacy',
  },
];

function SettingRow({ icon, bg, label, sub, href, onClick }: { icon: React.ReactNode; bg: string; label: string; sub: string; href?: string; onClick?: () => void }) {
  const [pressed, setPressed] = useState(false);
  
  const content = (
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
        style={{ backgroundColor: bg }}
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

  if (onClick) return content;
  if (!href) return content;
  
  return (
    <Link href={href} className="no-underline">
      {content}
    </Link>
  );
}

export default function SettingsPage() {
  const { logout } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isPersonalInfoOpen, setIsPersonalInfoOpen] = useState(false);
  const [isKYCOpen, setIsKYCOpen] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      toastSuccess('Logged out successfully');
      setTimeout(() => {
        router.push('/login');
      }, 500);
    } catch (error) {
      console.error('Logout error:', error);
      toastError('Failed to logout. Please try again.');
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8]">
      {/* Header */}
      <div className="bg-white border-b border-[#2D5D59]/10">
        <div className="max-w-5xl mx-auto px-3 xs:px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 md:py-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.history.back()}
              title="Go back"
              className="md:hidden p-1 -ml-1 hover:bg-[#2D5D59]/5 rounded-lg transition-colors"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-base sm:text-lg md:text-xl font-bold text-[#333333] font-[family-name:Syne]">Settings</h1>
              <p className="text-[#888888] text-[10px] mt-0.5">Manage your account</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-3 xs:px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 md:py-3">
        {/* Account Settings Section */}
        <div className="mb-4">
          <h2 className="text-[11px] sm:text-xs font-bold text-[#333333] mb-2 px-1 font-[family-name:Syne]">Account Settings</h2>
          <div className="space-y-0.5">
            {/* Personal Information - Modal */}
            <SettingRow
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={teal} strokeWidth="1.8">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              }
              bg={tealLight}
              label="Personal Information"
              sub="Update your details"
              onClick={() => setIsPersonalInfoOpen(true)}
            />
            {/* KYC Verification - Modal */}
            <SettingRow
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={teal} strokeWidth="1.8">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
              }
              bg={tealLight}
              label="KYC Verification"
              sub="Verify your identity with your BVN"
              onClick={() => setIsKYCOpen(true)}
            />
            {settingsItems.map((item) => (
              <SettingRow key={item.label} {...item} />
            ))}
          </div>
        </div>

        {/* Support Section */}
        <div className="mb-4">
          <h2 className="text-[11px] sm:text-xs font-bold text-[#333333] mb-2 px-1 font-[family-name:Syne]">Support</h2>
          <div className="space-y-0.5">
            {supportItems.map((item) => (
              <SettingRow key={item.label} {...item} />
            ))}
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-5">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="px-4 py-2.5 font-semibold text-[11px] bg-red-500 hover:bg-red-600 text-white border border-red-600 rounded-lg shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/35 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </main>

      {/* Personal Information Modal */}
      <PersonalInfoModal 
        isOpen={isPersonalInfoOpen} 
        onClose={() => setIsPersonalInfoOpen(false)} 
      />

      {/* KYC Verification Modal */}
      <KYCVerificationModal 
        isOpen={isKYCOpen} 
        onClose={() => setIsKYCOpen(false)} 
      />
    </div>
  );
}

