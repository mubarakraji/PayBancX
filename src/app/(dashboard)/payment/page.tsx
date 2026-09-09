'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  MdArrowBack,
  MdPhoneInTalk,
  MdDataUsage,
  MdElectricBolt,
  MdTv,
  MdGamepad,
  MdArrowRightAlt,
  MdFlashOn,
  MdShield,
  MdMonetizationOn,
} from 'react-icons/md';
import { ServicePromotionBanner } from '@/components/common/ServicePromotionBanner';

interface PaymentOption {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  iconBg: string;
  href: string;
}

const paymentOptions: PaymentOption[] = [
  {
    id: 'airtime',
    title: 'Airtime',
    icon: <MdPhoneInTalk className="h-8 w-8" />,
    description: 'Buy airtime for all networks',
    iconBg: 'bg-[#0F766E]/10 text-[#0F766E]',
    href: '/payment/airtime',
  },
  {
    id: 'data',
    title: 'Data Bundle',
    icon: <MdDataUsage className="h-8 w-8" />,
    description: 'Get internet data plans',
    iconBg: 'bg-[#7C5CBF]/10 text-[#7C5CBF]',
    href: '/payment/data',
  },
  {
    id: 'electricity',
    title: 'Electricity',
    icon: <MdElectricBolt className="h-8 w-8" />,
    description: 'Pay your electricity bills',
    iconBg: 'bg-[#E8960A]/10 text-[#E8960A]',
    href: '/payment/electricity',
  },
  {
    id: 'tv',
    title: 'TV Subscription',
    icon: <MdTv className="h-8 w-8" />,
    description: 'Renew your TV subscription',
    iconBg: 'bg-[#DC2626]/10 text-[#DC2626]',
    href: '/payment/tv',
  },
  {
    id: 'games',
    title: 'Games & Betting',
    icon: <MdGamepad className="h-8 w-8" />,
    description: 'Gaming and betting credits',
    iconBg: 'bg-[#2563EB]/10 text-[#2563EB]',
    href: '/payment/games',
  },
];

export default function PaymentPage() {
  const router = useRouter();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#F5F6F8] pb-6 text-[#122927]">
      <header className="border-b border-[#E5E7EB] bg-white">
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
            <h1 className="text-lg font-semibold text-[#122927] sm:text-xl">Pay Bills & Services</h1>
            <p className="text-sm text-[#64748B]">Manage your utilities and subscriptions</p>
          </div>
        </div>
      </header>

      <main className="mx-0 max-w-7xl px-3 py-4 xs:px-4 sm:px-5 sm:py-5 md:px-6">
        <ServicePromotionBanner />

        <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {paymentOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => router.push(option.href)}
              onMouseEnter={() => setHoveredId(option.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group relative overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white p-4 text-left shadow-sm transition-all duration-200 hover:border-[#1C3F3B]/30 hover:shadow-md"
            >
              <div className="relative z-10">
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${option.iconBg}`}>
                  <div className="text-[#1C3F3B]">{option.icon}</div>
                </div>
                <h3 className="mb-1 text-base font-semibold text-[#122927]">{option.title}</h3>
                <p className="mb-4 text-sm text-[#64748B]">{option.description}</p>
                <div className="flex items-center gap-2 text-sm font-semibold text-[#1C3F3B]">
                  <span>Select Service</span>
                  <MdArrowRightAlt className={`h-4 w-4 transition-transform duration-200 ${hoveredId === option.id ? 'translate-x-1' : ''}`} />
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-sm sm:p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#0F766E]/10 text-xl text-[#0F766E]">
                <MdFlashOn />
              </div>
              <h4 className="mb-1 text-base font-semibold text-[#122927]">Lightning Fast</h4>
              <p className="text-sm text-[#64748B]">Payments are processed instantly for your provider</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#22C55E]/10 text-xl text-[#22C55E]">
                <MdShield />
              </div>
              <h4 className="mb-1 text-base font-semibold text-[#122927]">Secure & Safe</h4>
              <p className="text-sm text-[#64748B]">Industry-standard protection for every transaction</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#7C5CBF]/10 text-xl text-[#7C5CBF]">
                <MdMonetizationOn />
              </div>
              <h4 className="mb-1 text-base font-semibold text-[#122927]">Best Rates</h4>
              <p className="text-sm text-[#64748B]">Competitive rates and instant confirmation</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

