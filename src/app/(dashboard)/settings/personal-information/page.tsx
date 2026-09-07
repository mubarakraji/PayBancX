'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MdArrowBack, MdPerson } from 'react-icons/md';
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
    <div className="min-h-screen bg-[#F5F6F8] text-[#122927]">
      <div className="border-b border-[#1C3F3B]/10 bg-white">
        <div className="mx-0 flex max-w-7xl items-center gap-3 px-3 py-3 xs:px-4 sm:px-5 sm:py-4 md:px-6">
          <button
            onClick={() => router.back()}
            title="Go back"
            aria-label="Go back"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#1C3F3B] transition-all duration-200 hover:border-[#1C3F3B]/30 hover:bg-[#F8FAFA]"
          >
            <MdArrowBack size={20} />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-[#122927] sm:text-xl">Personal Information</h1>
            <p className="text-sm text-[#64748B]">Update your account details</p>
          </div>
        </div>
      </div>

      <main className="mx-0 max-w-7xl px-3 py-4 xs:px-4 sm:px-5 sm:py-5 md:px-6">
        <form onSubmit={handleSubmit} className="rounded-3xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center gap-3 rounded-2xl bg-[#F8FAFA] p-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1C3F3B]/10 text-[#1C3F3B]">
              <MdPerson size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#122927]">Profile details</p>
              <p className="text-sm text-[#64748B]">Keep your profile accurate and current</p>
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-semibold text-[#122927]">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full rounded-2xl border border-[#E5E7EB] bg-white px-3 py-3 text-sm text-[#122927] placeholder:text-[#94A3B8] focus:border-[#1C3F3B] focus:outline-none"
              placeholder="Enter your full name"
            />
          </div>

          <div className="mb-5">
            <label className="mb-1.5 block text-sm font-semibold text-[#122927]">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-2xl border border-[#E5E7EB] bg-white px-3 py-3 text-sm text-[#122927] placeholder:text-[#94A3B8] focus:border-[#1C3F3B] focus:outline-none"
              placeholder="Enter your email"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-2xl bg-[#1C3F3B] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#152d2a] disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </main>
    </div>
  );
}
