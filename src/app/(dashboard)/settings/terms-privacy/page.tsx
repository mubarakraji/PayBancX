'use client';

import { useRouter } from 'next/navigation';

export default function TermsPrivacyPage() {
  const router = useRouter();

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
              <h1 className="text-base sm:text-lg md:text-xl font-bold text-[#333333]">Terms & Privacy</h1>
              <p className="text-[#888888] text-[10px] mt-0.5">Review our legal documents</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-3 xs:px-4 sm:px-5 md:px-6 py-3 sm:py-4 md:py-4">
        <div className="bg-white rounded-lg shadow-sm border border-[#1C3F3B]/10 p-6 text-center">
          <div className="w-12 h-12 bg-[#1C3F3B]/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1C3F3B" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <p className="text-xs font-semibold text-[#333333] mb-1">Coming Soon</p>
          <p className="text-[10px] text-[#888888]">Terms and privacy policy coming soon</p>
        </div>
      </main>
    </div>
  );
}
