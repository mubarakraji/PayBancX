'use client';

import { useRouter } from 'next/navigation';
import { MdArrowBack, MdDescription } from 'react-icons/md';

export default function TermsPrivacyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F5F6F8] text-[#122927]">
      <div className="border-b border-[#1C3F3B]/10 bg-white">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-3 py-3 xs:px-4 sm:px-5 sm:py-4 md:px-6">
          <button
            onClick={() => router.back()}
            title="Go back"
            aria-label="Go back"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#1C3F3B] transition-all duration-200 hover:border-[#1C3F3B]/30 hover:bg-[#F8FAFA]"
          >
            <MdArrowBack size={20} />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-[#122927] sm:text-xl">Terms & Privacy</h1>
            <p className="text-sm text-[#64748B]">Review our legal documents</p>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-3 py-4 xs:px-4 sm:px-5 sm:py-5 md:px-6">
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 text-center shadow-sm sm:p-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#64748B]/10 text-[#64748B]">
            <MdDescription size={28} />
          </div>
          <p className="mb-2 text-sm font-semibold text-[#122927]">Coming Soon</p>
          <p className="text-sm text-[#64748B]">Terms and privacy policy documents will be available soon.</p>
        </div>
      </main>
    </div>
  );
}
