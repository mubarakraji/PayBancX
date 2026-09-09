'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  FaHome,
  FaReceipt,
  FaCreditCard,
  FaComments,
  FaUser,
  FaSignOutAlt,
} from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';
import { toastSuccess } from '@/hooks/useToast';

const navItems = [
  { icon: FaHome, label: 'Home', href: '/home', id: 'home' },
  { icon: FaReceipt, label: 'Transactions', href: '/transactions', id: 'transactions' },
  { icon: FaCreditCard, label: 'Payment', href: '/payment', id: 'payment' },
  { icon: FaComments, label: 'AURA-X', href: '/aura', id: 'aura' },
  { icon: FaUser, label: 'Profile', href: '/settings', id: 'profile' },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, isLoading } = useAuth();

  // Hide sidebar on the first page (root page) and all auth pages
  const authRoutes = ['/login', '/signup', '/forgot-password', '/reset-password', '/otp', '/set-pin', '/reset-success', '/welcome'];
  const isAuthPage = authRoutes.some(route => pathname === route || pathname.startsWith(route + '/'));
  
  if (pathname === '/' || isAuthPage) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      toastSuccess('Logged out successfully');
      router.push('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <>
      {/* DESKTOP SIDEBAR - Hidden on mobile/tablet, shown on desktop (lg and up) */}
      <aside className="hidden lg:flex w-56 bg-white border-r border-[#285858]/15 p-4 flex-col h-screen sticky top-0">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="font-[family-name:Syne] text-2xl font-bold text-[#285858]">PayBancX</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-[1.02] ${
                  isActive
                    ? 'bg-[#285858] text-white shadow-md'
                    : 'text-[#858585] hover:text-[#285858] hover:bg-[#285858]/5'
                }`}
              >
                <item.icon size={18} />
                <span className="font-semibold text-sm">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-white"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          disabled={isLoading}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#858585] hover:text-[#285858] hover:bg-[#285858]/5 transition-all duration-300 hover:scale-[1.02] w-full disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm"
        >
          <FaSignOutAlt size={18} />
          <span>{isLoading ? 'Logging out...' : 'Logout'}</span>
        </button>
      </aside>

      {/* TABLET SIDEBAR - Hidden on mobile, shown on tablet/iPad (md to lg) */}
      <aside className="hidden md:flex lg:hidden w-56 bg-white border-r border-[#285858]/15 p-4 flex-col h-screen sticky top-0">
        {/* Logo - Compact */}
        <div className="mb-8">
          <h1 className="font-[family-name:Syne] text-2xl font-bold text-[#285858]">PayBancX</h1>
        </div>

        {/* Navigation - Compact */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-[1.02] ${
                  isActive
                    ? 'bg-[#285858] text-white shadow-md'
                    : 'text-[#858585] hover:text-[#285858] hover:bg-[#285858]/5'
                }`}
              >
                <item.icon size={18} />
                <span className="font-semibold text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button - Compact */}
        <button 
          onClick={handleLogout}
          disabled={isLoading}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#858585] hover:text-[#285858] hover:bg-[#285858]/5 transition-all duration-300 hover:scale-[1.02] w-full disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm"
        >
          <FaSignOutAlt size={18} />
          <span>{isLoading ? 'Logging out...' : 'Logout'}</span>
        </button>
      </aside>
    </>
  );
}

