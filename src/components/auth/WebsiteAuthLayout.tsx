'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { MdArrowBack } from 'react-icons/md';

interface WebsiteAuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
}

export const WebsiteAuthLayout: React.FC<WebsiteAuthLayoutProps> = ({ 
  children, 
  title, 
  subtitle,
  showBackButton = true 
}) => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F6F8] to-white pb-20 md:pb-8">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#1C3F3B] via-[#1F4440] to-[#1C3F3B] border-b border-[#1C3F3B]/10 shadow-lg">
        <div className="max-w-6xl mx-auto px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8 py-4 md:py-5 flex items-center gap-3">
          {showBackButton && (
            <button
              onClick={() => router.back()}
              title="Go back"
              className="p-2 hover:bg-white/10 rounded-lg transition hover:scale-[1.05]"
            >
              <MdArrowBack className="w-6 h-6 text-white" />
            </button>
          )}
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-[family-name:Syne]">{title}</h1>
            {subtitle && (
              <p className="text-white/80 text-sm sm:text-base md:text-base mt-2">{subtitle}</p>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8 py-4 md:py-5">
        <div className="max-w-md mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

