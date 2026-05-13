'use client';

import Link from 'next/link';

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1C3F3B] to-[#0f2c2a] flex flex-col items-center justify-center px-3 xs:px-4 sm:px-6 py-8">
      <h1 className="font-[family-name:Syne] text-3xl sm:text-4xl font-bold text-white mb-4 text-center">
        PayBancX
      </h1>
      <p className="text-white/80 text-base sm:text-lg text-center mb-2">
        The smartest way to pay your bills
      </p>
      <p className="text-white/60 text-xs sm:text-sm text-center mb-10 max-w-md">
        Fast, secure, and effortless bill payments right at your fingertips.
      </p>
      <div className="flex gap-3 xs:gap-4 flex-col xs:flex-row flex-wrap justify-center">
        <Link href="/login">
          <button className="bg-white text-[#1C3F3B] px-8 py-3 rounded-lg font-semibold text-sm xs:text-base hover:bg-white/90 transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg">
            Sign In
          </button>
        </Link>
        <Link href="/signup">
          <button className="bg-[#4db3a8] text-white px-8 py-3 rounded-lg font-semibold text-sm xs:text-base hover:bg-[#3d9a8f] transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
}
