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
  MdMonetizationOn
} from 'react-icons/md';

interface PaymentOption {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  bgGradient: string;
  iconBg: string;
  href: string;
}

const paymentOptions: PaymentOption[] = [
  {
    id: 'airtime',
    title: 'Airtime',
    icon: <MdPhoneInTalk className="w-8 h-8" />,
    description: 'Buy airtime for all networks',
    bgGradient: 'from-blue-600/10 to-cyan-600/10',
    iconBg: 'bg-blue-500/20',
    href: '/payment/airtime',
  },
  {
    id: 'data',
    title: 'Data Bundle',
    icon: <MdDataUsage className="w-8 h-8" />,
    description: 'Get internet data plans',
    bgGradient: 'from-purple-600/10 to-pink-600/10',
    iconBg: 'bg-purple-500/20',
    href: '/payment/data',
  },
  {
    id: 'electricity',
    title: 'Electricity',
    icon: <MdElectricBolt className="w-8 h-8" />,
    description: 'Pay your electricity bills',
    bgGradient: 'from-yellow-600/10 to-orange-600/10',
    iconBg: 'bg-yellow-500/20',
    href: '/payment/electricity',
  },
  {
    id: 'tv',
    title: 'TV Subscription',
    icon: <MdTv className="w-8 h-8" />,
    description: 'Renew your TV subscription',
    bgGradient: 'from-red-600/10 to-rose-600/10',
    iconBg: 'bg-red-500/20',
    href: '/payment/tv',
  },
  {
    id: 'games',
    title: 'Games & Betting',
    icon: <MdGamepad className="w-8 h-8" />,
    description: 'Gaming and betting credits',
    bgGradient: 'from-pink-600/10 to-fuchsia-600/10',
    iconBg: 'bg-pink-500/20',
    href: '/payment/games',
  },
];

export default function PaymentPage() {
  const router = useRouter();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F6F8] to-white pb-6">
      {/* Header */}
      <header className="bg-white border-b border-[#2D5D59]/10">
        <div className="max-w-5xl mx-auto px-3 xs:px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 md:py-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.back()}
              className="p-1 hover:bg-[#2D5D59]/5 rounded-lg transition-all duration-300 hover:scale-[1.05]"
              title="Go back"
            >
              <MdArrowBack className="w-5 h-5 text-[#2D5D59]" />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#333333] font-[family-name:Syne]">
                Pay Bills & Services
              </h1>
              <p className="text-[#888888] text-xs sm:text-xs mt-0.5">Manage your utilities and subscriptions</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-3 xs:px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 md:py-3">
        
        {/* Grid of Payment Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-4">
            {paymentOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => router.push(option.href)}
                onMouseEnter={() => setHoveredId(option.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group relative bg-white border border-[#E2E8F0] rounded-lg p-3 md:p-3.5 text-left transition-all duration-300 hover:border-[#2D5D59] hover:shadow-lg hover:scale-[1.02] overflow-hidden"
              >
                {/* Visual Gradient Background on Hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${option.bgGradient} opacity-0 group-hover:opacity-100 transition-all duration-300`}
                />

                <div className="relative z-10">
                  {/* Icon Container */}
                  <div
                    className={`${option.iconBg} w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-all duration-500 group-hover:rotate-[360deg]`}
                  >
                    <div className="text-[#2D5D59]">{option.icon}</div>
                  </div>

                  <h3 className="text-base font-bold text-[#333333] mb-1 transition-colors group-hover:text-[#2D5D59]">
                    {option.title}
                  </h3>

                  <p className="text-[#888888] text-xs mb-4 leading-snug">
                    {option.description}
                  </p>

                  <div className="flex items-center gap-2 text-[#2D5D59] font-bold text-xs tracking-wide uppercase">
                    <span>Select Service</span>
                    <MdArrowRightAlt
                      className={`w-4 h-4 transition-transform duration-300 ${
                        hoveredId === option.id ? 'translate-x-2' : ''
                      }`}
                    />
                  </div>
                </div>

                {/* Blueprint Bottom Accent Line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#2D5D59] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </button>
            ))}
          </div>

          {/* Optimized Info Section with React Icons */}
          <div className="bg-white/60 backdrop-blur-md border border-[#e2e8f0] rounded-[16px] p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-12 h-12 rounded-full bg-[#0369a1]/10 flex items-center justify-center text-xl text-[#0369a1] mb-3 group-hover:bg-[#0369a1] group-hover:text-white transition-all duration-300">
                  <MdFlashOn />
                </div>
                <h4 className="text-base font-bold text-[#0f172a] mb-1">Lightning Fast</h4>
                <p className="text-[#64748b] text-xs leading-snug">Payments processed instantly to your service provider</p>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-12 h-12 rounded-full bg-[#22c55e]/10 flex items-center justify-center text-xl text-[#22c55e] mb-3 group-hover:bg-[#22c55e] group-hover:text-white transition-all duration-300">
                  <MdShield />
                </div>
                <h4 className="text-base font-bold text-[#0f172a] mb-1">Secure & Safe</h4>
                <p className="text-[#64748b] text-xs leading-snug">All transactions encrypted with industry-standard security</p>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-12 h-12 rounded-full bg-[#0369a1]/10 flex items-center justify-center text-xl text-[#0369a1] mb-3 group-hover:bg-[#0369a1] group-hover:text-white transition-all duration-300">
                  <MdMonetizationOn />
                </div>
                <h4 className="text-base font-bold text-[#0f172a] mb-1">Best Rates</h4>
                <p className="text-[#64748b] text-xs leading-snug">Competitive rates and instant confirmation</p>
              </div>
            </div>
          </div>
        </main>
    </div>
  );
}

