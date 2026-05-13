'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { toastSuccess, toastError } from '@/hooks/useToast';

export default function PersonalInformationPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || user.firstName + ' ' + user.lastName || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      toastSuccess('Personal information updated successfully');
    } catch (err) {
      toastError('Failed to update information');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8]">
      {/* Header */}
      <div className="bg-white border-b border-[#1C3F3B]/10">
        <div className="max-w-5xl mx-auto px-3 xs:px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 md:py-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.back()}
              title="Go back"
              className="p-1 -ml-1 hover:bg-[#1C3F3B]/5 rounded-lg transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-base sm:text-lg md:text-xl font-bold text-[#333333]">Personal Information</h1>
              <p className="text-[#888888] text-[10px] mt-0.5">Update your account details</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-3 xs:px-4 sm:px-5 md:px-6 py-3 sm:py-4 md:py-4">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-[#1C3F3B]/10 p-4">
          {/* Full Name */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-[#1C3F3B] mb-1.5">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border border-[#1C3F3B]/20 rounded-lg text-xs bg-white focus:outline-none focus:border-[#1C3F3B] transition-colors"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-[#1C3F3B] mb-1.5">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border border-[#1C3F3B]/20 rounded-lg text-xs bg-white focus:outline-none focus:border-[#1C3F3B] transition-colors"
              placeholder="Enter your email"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-[#1C3F3B] text-white font-semibold text-xs rounded-lg hover:bg-[#152d2a] transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </main>
    </div>
  );
}
