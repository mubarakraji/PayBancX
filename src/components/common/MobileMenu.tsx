'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaHome, FaReceipt, FaWallet, FaStar, FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const menuItems = [
    { href: '/home', label: 'Home', icon: FaHome },
    { href: '/transactions', label: 'Transactions', icon: FaReceipt },
    { href: '/payment', label: 'Payment', icon: FaWallet },
    { href: '/aura', label: 'AURA-X', icon: FaStar },
    { href: '/settings', label: 'Settings', icon: FaUser },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push('/login');
  };

  return (
    <>
      {/* Hamburger Button - Only visible on mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 right-4 z-40 p-2 rounded-lg bg-[#1C3F3B] text-white hover:bg-[#2d5d59] transition-all"
        aria-label="Toggle menu"
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Full Screen Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menu Panel */}
      <div
        className={`fixed left-0 top-0 h-screen w-72 bg-gradient-to-b from-[#1C3F3B] to-[#0f2c2a] z-35 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Menu Header */}
        <div className="px-6 pt-8 pb-6 border-b border-[rgba(255,255,255,0.1)]">
          <h2 className="font-[family-name:Syne] text-2xl font-bold text-white">PayBancX</h2>
          {user && (
            <p className="text-sm text-white/70 mt-2">Welcome, {user.firstName || 'User'}</p>
          )}
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 py-6">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
                    active
                      ? 'bg-[#4db3a8] text-white shadow-lg'
                      : 'text-white/80 hover:text-white hover:bg-[rgba(77,179,168,0.1)]'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-semibold text-sm">{item.label}</span>
                  {active && <div className="ml-auto w-2 h-2 rounded-full bg-white" />}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer Section */}
        <div className="px-4 pb-8 border-t border-[rgba(255,255,255,0.1)]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-[rgba(255,0,0,0.1)] text-red-400 hover:bg-[rgba(255,0,0,0.2)] transition-all font-semibold text-sm mt-4"
          >
            <FaSignOutAlt size={18} />
            Logout
          </button>
          <p className="text-xs text-white/50 text-center mt-4">PayBancX v1.0</p>
        </div>
      </div>
    </>
  );
}
