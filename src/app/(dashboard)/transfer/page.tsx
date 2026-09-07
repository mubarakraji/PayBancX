'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { MdArrowBack, MdAccountBalance, MdQrCode2, MdArrowRightAlt } from 'react-icons/md';
import TransferToBankModal from '@/components/common/TransferToBankModal';
import TransferToQRModal from '@/components/common/TransferToQRModal';

interface TransferOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  bgGradient: string;
  iconBg: string;
}

const transferOptions: TransferOption[] = [
  {
    id: 'bank',
    title: 'Transfer to Bank',
    description: 'Send money to any bank account in Nigeria',
    icon: <MdAccountBalance className="w-10 h-10" />,
    href: '/transfer-to-bank',
    color: 'text-blue-600',
    bgGradient: 'from-blue-600/10 to-cyan-600/10',
    iconBg: 'bg-blue-500/20',
  },
  {
    id: 'qr',
    title: 'Transfer to QR',
    description: 'Scan QR or enter payment tag',
    icon: <MdQrCode2 className="w-10 h-10" />,
    href: '/transfer-to-qr',
    color: 'text-purple-600',
    bgGradient: 'from-purple-600/10 to-pink-600/10',
    iconBg: 'bg-purple-500/20',
  },
];

export default function TransferPage() {
  const router = useRouter();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isTransferToBankOpen, setIsTransferToBankOpen] = useState(false);
  const [isTransferToQROpen, setIsTransferToQROpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F6F8] text-[#122927]">
      <div className="border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-3 py-3 xs:px-4 sm:px-5 sm:py-4 md:px-6 lg:px-8">
          <button
            onClick={() => router.back()}
            title="Go back"
            aria-label="Go back"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#1C3F3B] transition-all duration-200 hover:border-[#1C3F3B]/30 hover:bg-[#F8FAFA]"
          >
            <MdArrowBack size={20} />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-[#122927] sm:text-xl">Select Transfer Method</h1>
            <p className="text-sm text-[#64748B]">Choose how you want to send money</p>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-3 py-4 xs:px-4 sm:px-5 md:px-6 lg:px-8 md:py-5">
        <div className="mb-8 grid grid-cols-1 gap-4 md:mb-10 md:grid-cols-2 md:gap-5">
          {transferOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                if (option.id === 'bank') {
                  setIsTransferToBankOpen(true);
                } else if (option.id === 'qr') {
                  setIsTransferToQROpen(true);
                }
              }}
              onMouseEnter={() => setHoveredId(option.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group relative overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white p-4 text-left shadow-sm transition-all duration-200 hover:border-[#1C3F3B]/30 hover:shadow-md md:p-5"
            >
              {/* Visual Gradient Background on Hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${option.bgGradient} opacity-0 group-hover:opacity-100 transition-all duration-300`}
              />

              <div className="relative z-10">
                {/* Icon Container */}
                <div
                  className={`${option.iconBg} w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110`}
                >
                  <div className={option.color}>{option.icon}</div>
                </div>

                {/* Title */}
                <h3 className="text-lg xs:text-xl sm:text-xl md:text-lg font-bold text-paybancx-text-dark mb-3 transition-colors group-hover:text-paybancx-action">
                  {option.title}
                </h3>

                {/* Description */}
                <p className="text-paybancx-text-muted text-xs xs:text-sm sm:text-base md:text-sm mb-6 leading-relaxed">
                  {option.description}
                </p>

                {/* CTA */}
                <div className="flex items-center gap-3 text-paybancx-action font-bold text-base tracking-wide">
                  <span>Choose Method</span>
                  <MdArrowRightAlt
                    className={`w-5 h-5 transition-transform duration-300 ${
                      hoveredId === option.id ? 'translate-x-2' : ''
                    }`}
                  />
                </div>
              </div>

              {/* Bottom Accent Line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-paybancx-action to-paybancx-action/50 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </button>
          ))}
        </div>

        {/* Info Section */}
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-4 shadow-sm md:p-5 lg:p-6">
          <div className="max-w-3xl">
            <h2 className="text-lg xs:text-xl sm:text-xl md:text-lg font-bold text-paybancx-text-dark mb-6">
              Why PayBancX Transfer?
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-paybancx-success/20 flex items-center justify-center">
                    <span className="text-paybancx-success font-bold">✓</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-paybancx-text-dark mb-1">Instant Transfers</h4>
                  <p className="text-paybancx-text-muted">Get your money to the recipient in seconds</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-paybancx-success/20 flex items-center justify-center">
                    <span className="text-paybancx-success font-bold">✓</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-paybancx-text-dark mb-1">Multiple Options</h4>
                  <p className="text-paybancx-text-muted">Transfer via bank account or QR code - choose what works best for you</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-paybancx-success/20 flex items-center justify-center">
                    <span className="text-paybancx-success font-bold">✓</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-paybancx-text-dark mb-1">Secure & Encrypted</h4>
                  <p className="text-paybancx-text-muted">Your transactions are protected with bank-level encryption</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <TransferToBankModal isOpen={isTransferToBankOpen} onClose={() => setIsTransferToBankOpen(false)} />
      <TransferToQRModal isOpen={isTransferToQROpen} onClose={() => setIsTransferToQROpen(false)} />
    </div>
  );
}

