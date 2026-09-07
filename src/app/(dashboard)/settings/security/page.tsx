'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MdArrowBack, MdLockOutline, MdPassword, MdPrivacyTip } from 'react-icons/md';
import PINModal from '@/components/common/PINModal';
import PasswordModal from '@/components/common/PasswordModal';
import PrivacyModal from '@/components/common/PrivacyModal';

const teal = '#1C3F3B';
const tealLight = 'rgba(28, 63, 59, 0.08)';

const securityItems = [
  {
    icon: <MdLockOutline size={20} className="text-[#1C3F3B]" />,
    bg: tealLight,
    label: 'PIN',
    sub: 'Set your transaction PIN',
    id: 'pin',
  },
  {
    icon: <MdPassword size={20} className="text-[#E8960A]" />,
    bg: 'rgba(232, 150, 10, 0.08)',
    label: 'Password',
    sub: 'Change your password',
    id: 'password',
  },
  {
    icon: <MdPrivacyTip size={20} className="text-[#7C5CBF]" />,
    bg: 'rgba(124, 92, 191, 0.08)',
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
      className={`flex cursor-pointer items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-white px-3 py-3.5 transition-all duration-200 ${
        pressed ? 'border-[#1C3F3B] bg-[#F8FAFA]' : 'hover:border-[#1C3F3B]/30 hover:bg-[#F8FAFA]'
      }`}
    >
      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl" style={{ background: bg }}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-[#122927]">{label}</div>
        <div className="mt-0.5 text-sm text-[#64748B]">{sub}</div>
      </div>
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F8FAFA] text-[#94A3B8]">
        <MdArrowBack size={16} className="rotate-180" />
      </div>
    </div>
  );
}

export default function SecurityPage() {
  const router = useRouter();
  const [isPINOpen, setIsPINOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F6F8] text-[#122927]">
      <div className="border-b border-[#1C3F3B]/10 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-3 py-3 xs:px-4 sm:px-5 sm:py-4 md:px-6">
          <button
            onClick={() => router.back()}
            title="Go back"
            aria-label="Go back"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#1C3F3B] transition-all duration-200 hover:border-[#1C3F3B]/30 hover:bg-[#F8FAFA]"
          >
            <MdArrowBack size={20} />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-[#122927] sm:text-xl">Security</h1>
            <p className="text-sm text-[#64748B]">Manage your password and authentication</p>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-3 py-4 xs:px-4 sm:px-5 sm:py-5 md:px-6">
        <section className="rounded-3xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#122927]">Security settings</h2>
            <span className="text-sm text-[#64748B]">Protected</span>
          </div>
          <div className="space-y-2.5">
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
        </section>
      </main>

      <PINModal isOpen={isPINOpen} onClose={() => setIsPINOpen(false)} />
      <PasswordModal isOpen={isPasswordOpen} onClose={() => setIsPasswordOpen(false)} />
      <PrivacyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
    </div>
  );
}
