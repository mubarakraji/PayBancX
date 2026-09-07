'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { toastSuccess, toastError } from '@/hooks/useToast';
import { MdArrowBack, MdLogout, MdRefresh, MdVerified, MdError, MdEdit } from 'react-icons/md';

export default function ProfilePage() {
  const { user, isLoading, fetchProfile, logout } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setProfileError(null);
        await fetchProfile();
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to load profile';
        console.error('[Profile Page] Error:', err);
        setProfileError(errorMsg);
      }
    };

    loadProfile();
  }, [fetchProfile]);

  const handleRefreshProfile = async () => {
    setIsRefreshing(true);
    setProfileError(null);
    try {
      await fetchProfile();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to refresh profile';
      setProfileError(errorMsg);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      toastSuccess('Logged out successfully');
      setTimeout(() => {
        router.push('/login');
      }, 500);
    } catch (error) {
      console.error('Logout error:', error);
      toastError('Failed to logout. Please try again.');
      setIsLoggingOut(false);
    }
  };

  if (isLoading && !user) {
    return (
      <div className="min-h-screen bg-[#F5F6F8] text-[#333333] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-block animate-spin">
            <div className="w-10 h-10 border-4 border-[#E2E8F0] border-t-[#1C3F3B] rounded-full"></div>
          </div>
          <p className="text-[#888888] mt-3 text-xs sm:text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6F8] pb-12 md:pb-6">
      {/* Header - Responsive */}
      <div className="bg-white border-b border-[#2D5D59]/10 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8 py-3 sm:py-4 md:py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="md:hidden p-1.5 hover:bg-[#2D5D59]/5 rounded-lg transition-all duration-300 hover:scale-[1.02]"
              title="Go back"
              aria-label="Go back"
            >
              <MdArrowBack className="w-5 h-5 text-[#2D5D59]" />
            </button>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#333333] font-[family-name:Syne]">Profile</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8 py-4 md:py-5">
        {/* Error Message - Responsive */}
        {profileError && (
          <div className="mb-5 bg-red-500/10 border border-red-500/20 rounded-lg p-3 sm:p-4 flex items-gap-2 gap-3">
            <MdError className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-red-400 font-medium">Profile Error</p>
              <p className="text-xs text-red-400/70">{profileError}</p>
            </div>
          </div>
        )}

        {/* Profile Header - Responsive */}
        <div className="bg-gradient-to-b from-white to-[#2D5D59]/5 -mx-4 sm:-mx-6 md:-mx-8 lg:-mx-12 px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8 py-5 sm:py-6 md:py-7 rounded-xl mb-6 border border-[#2D5D59]/10">
          {/* Avatar */}
          <div className="flex flex-col items-center mb-6 sm:mb-8">
            <div className="w-20 sm:w-24 md:w-28 h-20 sm:h-24 md:h-28 rounded-lg bg-gradient-to-br from-[#2D5D59] to-[#1F4440] flex items-center justify-center mb-4 sm:mb-5 border-4 border-white shadow-md text-2xl sm:text-3xl md:text-4xl font-bold flex-shrink-0 text-white">
              {user?.fullName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#333333] text-center break-words max-w-xs sm:max-w-sm font-[family-name:Syne]">{user?.fullName || 'User'}</h1>
            <p className="text-[#888888] mt-2 sm:mt-3 text-xs sm:text-sm text-center break-all">{user?.email}</p>
            {user?.phone && user.phone !== 'unavailable' && <p className="text-[#888888] text-xs sm:text-sm mt-1">{user.phone}</p>}
          </div>

          {/* Verification Badge - Responsive */}
          {user?.verified ? (
            <div className="flex justify-center">
              <div className="bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-full px-4 sm:px-5 py-2 sm:py-2.5 flex items-center gap-2">
                <MdVerified className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
                <span className="text-[#22C55E] font-semibold text-xs sm:text-sm">Verified Account</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-full px-4 sm:px-5 py-2 sm:py-2.5 flex items-center gap-2">
                <span className="text-yellow-500 text-xs sm:text-sm font-semibold">⚠ Not Verified</span>
              </div>
            </div>
          )}
        </div>

        {/* Profile Information - Responsive */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-paybancx-text-dark">Account Information</h2>
            <button
              onClick={() => router.push('/settings/personal-information')}
              className="p-2 hover:bg-paybancx-primary/10 rounded-card transition-all duration-300 hover:scale-[1.02]"
              title="Edit profile"
              aria-label="Edit profile"
            >
              <MdEdit className="w-5 h-5 text-paybancx-action" />
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Full Name */}
            <div className="bg-white border border-paybancx-border rounded-card p-4 sm:p-5">
              <p className="text-paybancx-text-muted text-xs sm:text-sm font-semibold mb-2">Full Name</p>
              <p className="text-paybancx-text-dark text-sm sm:text-base font-medium">{user?.fullName || 'Not provided'}</p>
            </div>

            {/* Email */}
            <div className="bg-white border border-paybancx-border rounded-card p-4 sm:p-5">
              <p className="text-paybancx-text-muted text-xs sm:text-sm font-semibold mb-2">Email Address</p>
              <p className="text-paybancx-text-dark text-sm sm:text-base font-medium break-all">{user?.email || 'Not provided'}</p>
            </div>

            {/* Phone */}
            <div className="bg-white border border-paybancx-border rounded-card p-4 sm:p-5">
              <p className="text-paybancx-text-muted text-xs sm:text-sm font-semibold mb-2">Phone Number</p>
              <p className="text-paybancx-text-dark text-sm sm:text-base font-medium">{user?.phone && user.phone !== 'unavailable' ? user.phone : 'Not provided'}</p>
            </div>

            {/* User ID */}
            {user?.id && user.id !== 'unavailable' && (
              <div className="bg-white border border-paybancx-border rounded-card p-4 sm:p-5">
                <p className="text-paybancx-text-muted text-xs sm:text-sm font-semibold mb-2">User ID</p>
                <p className="text-paybancx-text-dark text-xs sm:text-sm font-medium break-all font-mono">{user.id}</p>
              </div>
            )}
          </div>
        </div>

        {/* Account Actions */}
        <div className="border-t border-paybancx-border pt-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-paybancx-text-dark mb-6">Actions</h2>
          
          <div className="space-y-3 max-w-md">
            <button
              onClick={() => router.push('/settings')}
              className="w-full bg-paybancx-action/10 border border-paybancx-action/30 text-paybancx-action py-3 rounded-card text-base font-bold hover:bg-paybancx-action/20 transition-all duration-300 hover:scale-[1.02]"
            >
              Account Settings
            </button>
            
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full bg-red-600/20 border border-red-600/50 text-red-400 py-3 rounded-card text-base font-bold hover:bg-red-600/30 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <MdLogout className="w-5 h-5" />
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

