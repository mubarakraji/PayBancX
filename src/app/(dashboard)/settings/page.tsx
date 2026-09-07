'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { MdArrowBack, MdChevronRight, MdLogout, MdPerson, MdVerifiedUser, MdSecurity, MdNotifications, MdHelpOutline, MdDescription, MdCheckCircle } from 'react-icons/md';
import PersonalInfoModal from '@/components/common/PersonalInfoModal';
import KYCVerificationModal from '@/components/common/KYCVerificationModal';
import { toastSuccess, toastError } from '@/hooks/useToast';

const teal = '#1C3F3B';
const tealLight = 'rgba(28, 63, 59, 0.08)';

const settingsItems = [
  {
    icon: <MdSecurity size={20} className="text-[#E8960A]" />,
    bg: 'rgba(232, 150, 10, 0.08)',
    label: 'Security',
    sub: 'Password and authentication',
    href: '/settings/security',
  },
  {
    icon: <MdNotifications size={20} className="text-[#7C5CBF]" />,
    bg: 'rgba(124, 92, 191, 0.08)',
    label: 'Notifications',
    sub: 'Manage alerts and updates',
    href: '/settings/notifications',
  },
];

const supportItems = [
  {
    icon: <MdHelpOutline size={20} className="text-[#E05252]" />,
    bg: 'rgba(224, 82, 82, 0.08)',
    label: 'Help Center',
    sub: 'Get help and support',
    href: '/settings/help-center',
  },
  {
    icon: <MdDescription size={20} className="text-[#64748B]" />,
    bg: 'rgba(100, 116, 139, 0.08)',
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
      className={`flex items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-white px-3 py-3.5 transition-all duration-200 select-none ${
        pressed ? 'border-[#1C3F3B] bg-[#F8FAFA]' : 'hover:border-[#1C3F3B]/30 hover:bg-[#F8FAFA]'
      }`}
    >
      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: bg }}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-[#122927]">{label}</div>
        <div className="mt-0.5 text-sm text-[#64748B]">{sub}</div>
      </div>
      <MdChevronRight className="h-5 w-5 flex-shrink-0 text-[#94A3B8]" />
    </div>
  );

  if (onClick) return content;
  if (!href) return content;

  return (
    <Link href={href} className="block">
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
    <div className="min-h-screen bg-[#F5F6F8] text-[#122927]">
      <div className="border-b border-[#1C3F3B]/10 bg-white">
        <div className="mx-0 flex max-w-7xl items-center gap-3 px-3 py-3 xs:px-4 sm:px-5 sm:py-4 md:px-6">
          <button
            onClick={() => router.back()}
            title="Go back"
            aria-label="Go back"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#1C3F3B] transition-all duration-200 hover:border-[#1C3F3B]/30 hover:bg-[#F8FAFA]"
          >
            <MdArrowBack size={20} />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-[#122927] sm:text-xl">Settings</h1>
            <p className="text-sm text-[#64748B]">Manage your account and preferences</p>
          </div>
        </div>
      </div>

      <main className="mx-0 flex max-w-7xl flex-col gap-4 px-3 py-4 xs:px-4 sm:px-5 sm:py-5 md:px-6 lg:py-6">
        <section className="overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white shadow-sm">
          <div className="border-b border-[#E5E7EB] bg-gradient-to-r from-[#1C3F3B] to-[#2D5D59] px-4 py-5 text-white sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/70">Account overview</p>
                <h2 className="mt-1 text-xl font-semibold">Keep your profile secure and up to date</h2>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-white/90">
                <MdCheckCircle size={16} />
                <span>Protected</span>
              </div>
            </div>
          </div>

          <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5">
            <button
              onClick={() => setIsPersonalInfoOpen(true)}
              className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFA] p-4 text-left transition-all duration-200 hover:border-[#1C3F3B]/30 hover:bg-white"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1C3F3B]/10 text-[#1C3F3B]">
                  <MdPerson size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#122927]">Personal Information</p>
                  <p className="text-sm text-[#64748B]">Update your profile details</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setIsKYCOpen(true)}
              className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFA] p-4 text-left transition-all duration-200 hover:border-[#1C3F3B]/30 hover:bg-white"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#22C55E]/10 text-[#16A34A]">
                  <MdVerifiedUser size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#122927]">KYC Verification</p>
                  <p className="text-sm text-[#64748B]">Verify your identity securely</p>
                </div>
              </div>
            </button>
          </div>
        </section>

        <section className="rounded-3xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#122927]">Account preferences</h2>
            <span className="text-sm text-[#64748B]">Secure</span>
          </div>
          <div className="space-y-2.5">
            {settingsItems.map((item) => (
              <SettingRow key={item.label} {...item} />
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#122927]">Support</h2>
            <span className="text-sm text-[#64748B]">Always available</span>
          </div>
          <div className="space-y-2.5">
            {supportItems.map((item) => (
              <SettingRow key={item.label} {...item} />
            ))}
          </div>
        </section>

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

