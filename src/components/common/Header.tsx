'use client';

import { useState } from 'react';
import { FiSearch, FiBell, FiChevronDown } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Get display name from user data
  const getDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.fullName) {
      return user.fullName;
    }
    if (user?.firstName) {
      return user.firstName;
    }
    return 'User';
  };

  const getInitial = () => {
    const name = getDisplayName();
    return name[0]?.toUpperCase() || 'U';
  };

  return (
    <div className="hidden md:flex items-center justify-between px-4 sm:px-5 md:px-6 lg:px-8 py-3 sm:py-3 md:py-4 border-b border-[#1C3F3B]/10 bg-gradient-to-r from-white to-white sticky top-0 z-40 shadow-sm">
      {/* Left: Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#888888]" size={18} />
          <input
            type="text"
            placeholder="Search transactions, cards..."
            className="w-full pl-10 pr-4 py-2 bg-[#F5F6F8] border border-[#1C3F3B]/10 rounded-lg text-xs sm:text-sm text-[#333333] placeholder-[#888888] focus:outline-none focus:ring-2 focus:ring-[#1C3F3B]/20 focus:bg-white transition-all duration-300"
          />
        </div>
      </div>

      {/* Right: Notifications & Profile */}
      <div className="flex items-center gap-6 ml-8">
        {/* Notification Bell */}
        <button 
          onClick={() => router.push('/settings/notifications')}
          className="relative p-2 hover:bg-[#1C3F3B]/5 rounded-lg transition-all duration-300 hover:scale-[1.05]"
          title="View notifications"
        >
          <FiBell size={18} className="text-[#333333]" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#22C55E] rounded-full"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 px-4 py-2 hover:bg-[#1C3F3B]/5 rounded-lg transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1C3F3B] to-[#1F4440] flex items-center justify-center text-white text-xs sm:text-sm font-bold">
              {getInitial()}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-semibold text-[#333333]">
                {getDisplayName()}
              </p>
              <p className="text-xs text-[#888888] leading-tight">{user?.email}</p>
            </div>
            <FiChevronDown
              size={18}
              className={`text-[#888888] transition-transform duration-300 ${
                isProfileOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-[#1C3F3B]/10 rounded-lg shadow-lg py-1 z-50">
              <a
                href="/settings"
                className="block px-4 py-2.5 text-sm text-[#333333] hover:bg-[#2D5D59]/5 transition-colors font-medium"
              >
                Settings
              </a>
              <a
                href="/settings/personal-information"
                className="block px-4 py-2.5 text-sm text-[#333333] hover:bg-[#2D5D59]/5 transition-colors font-medium"
              >
                Profile
              </a>
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-[#333333] hover:bg-[#1C3F3B]/5 transition-colors border-t border-[#1C3F3B]/10 mt-1 pt-1 font-medium"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

