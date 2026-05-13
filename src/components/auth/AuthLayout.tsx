'use client';

import React from 'react';
import styles from './auth.module.css';

interface AuthLayoutProps {
  children: React.ReactNode;
  pageLabel?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, pageLabel }) => {
  return (
    <div className="min-h-screen bg-paybancx-bg flex flex-col items-center justify-center px-4 py-6">
      {/* Background grid pattern */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className={`absolute inset-0 ${styles.bgGridPattern}`}></div>
      </div>

      {/* Glow effect */}
      <div className={`fixed w-[500px] h-[500px] rounded-full pointer-events-none z-0 ${styles.glowEffect}`}></div>

      {/* Page label - visible on desktop */}
      {pageLabel && (
        <div className="hidden md:flex mb-6 z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-paybancx-action bg-paybancx-action/10 border border-paybancx-action/15 px-4 py-2 rounded-full">
            {pageLabel}
          </span>
        </div>
      )}

      {/* Phone mockup container - visible on desktop, full on mobile */}
      <div className="w-full md:w-[375px] relative z-10">
        <div className={`hidden md:block bg-paybancx-bg rounded-card border border-paybancx-border/30 overflow-hidden shadow-2xl ${styles.phoneMockup}`}>
          {/* Content */}
          <div className="px-7 py-3 pb-9">
            {children}
          </div>
        </div>

        {/* Mobile view - full screen */}
        <div className="md:hidden bg-paybancx-bg min-h-screen flex flex-col">
          {/* Mobile content */}
          <div className="px-4 py-4 overflow-y-auto flex flex-col justify-start">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

