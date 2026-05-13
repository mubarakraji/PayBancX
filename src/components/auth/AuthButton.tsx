'use client';

import React from 'react';

interface AuthButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'outline';
  className?: string;
  disabled?: boolean;
  [key: string]: any;
}

export const AuthButton: React.FC<AuthButtonProps> = ({
  children,
  variant = 'primary',
  className = '',
  disabled = false,
  ...props
}) => {
  if (variant === 'outline') {
    return (
      <button
        disabled={disabled}
        className={`w-full bg-white text-[#1C3F3B] border-2 border-[#1C3F3B] rounded-lg py-2.5 font-['DM_Sans'] font-medium text-sm cursor-pointer transition-all hover:bg-[#1C3F3B]/5 hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      disabled={disabled}
      className={`w-full bg-[#1C3F3B] text-white border-none rounded-lg py-2.5 font-['DM_Sans'] font-semibold text-sm cursor-pointer transition-all hover:bg-[#152d2a] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] shadow-sm ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

