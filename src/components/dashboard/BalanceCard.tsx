'use client';

import Link from 'next/link';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { useState } from 'react';

interface BalanceCardProps {
  balance: number;
}

export default function BalanceCard({ balance }: BalanceCardProps) {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  const formattedBalance = balance.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#2f746b] bg-[#123c37] p-3 shadow-[0_18px_40px_rgba(18,60,55,0.18)] xs:p-4 sm:p-5">
      {/* Glow effect */}
      <div className="absolute -top-20 -right-20 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-[#f5c84b]/10 blur-3xl"></div>

      <div className="relative z-10">
        {/* Top Section */}
        <div className="flex justify-between items-start mb-2 xs:mb-3 sm:mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-3 w-3 items-center justify-center rounded-full border border-[#f5c84b]/70 xs:h-4 xs:w-4">
              <div className="h-1.5 w-1.5 rounded-full bg-[#f5c84b] xs:h-2 xs:w-2"></div>
            </div>
            <span className="text-[10px] xs:text-xs text-white/70 font-medium tracking-wide">Total Balance</span>
          </div>
          <button
            onClick={() => setIsBalanceVisible(!isBalanceVisible)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-[1.05]"
            title={isBalanceVisible ? 'Hide balance' : 'Show balance'}
          >
            {isBalanceVisible ? (
              <MdVisibility size={16} className="text-white/70 hover:text-white" />
            ) : (
              <MdVisibilityOff size={16} className="text-white/70 hover:text-white" />
            )}
          </button>
        </div>

        {/* Balance Amount */}
        <div className="font-sans text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-3 xs:mb-4 sm:mb-6 text-white transition-all duration-300">
          {isBalanceVisible ? `₦${formattedBalance}` : '••••••••'}
        </div>
      </div>
    </div>
  );
}

