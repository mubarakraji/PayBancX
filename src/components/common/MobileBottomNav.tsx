'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  FaHome,
  FaReceipt,
  FaCreditCard,
  FaComments,
  FaUser,
} from 'react-icons/fa';

const navItems = [
  { icon: FaHome, label: 'Home', href: '/home', id: 'home' },
  { icon: FaReceipt, label: 'Transactions', href: '/transactions', id: 'transactions' },
  { icon: FaCreditCard, label: 'Payment', href: '/payment', id: 'payment' },
  { icon: FaComments, label: 'AURA-X', href: '/aura', id: 'aura' },
  { icon: FaUser, label: 'Profile', href: '/settings', id: 'profile' },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  // Hide on auth pages
  const authRoutes = ['/login', '/signup', '/forgot-password', '/reset-password', '/otp', '/set-pin', '/reset-success', '/welcome'];
  const isAuthPage = authRoutes.some(route => pathname === route || pathname.startsWith(route + '/'));
  
  if (pathname === '/' || isAuthPage) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-[#1C3F3B]/10 px-2 py-1.5 flex items-center justify-between z-50 h-16 sm:h-14">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.id}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 rounded-lg flex-1 transition-all duration-300 ${
              isActive
                ? 'text-[#1C3F3B] bg-[#1C3F3B]/5'
                : 'text-[#888888] hover:text-[#1C3F3B]'
            }`}
            title={item.label}
          >
            <item.icon size={20} className="sm:w-5 sm:h-5" />
            <span className={`text-[9px] sm:text-[10px] font-semibold whitespace-nowrap ${
              isActive ? 'text-[#1C3F3B]' : 'text-[#666666]'
            }`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
