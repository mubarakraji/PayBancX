'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toastSuccess, toastError } from '@/hooks/useToast';

export default function KYCVerificationPage() {
  const router = useRouter();
  const [bvn, setBvn] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleVerify = async () => {
    if (bvn.length !== 11) {
      toastError('BVN must be exactly 11 digits');
      return;
    }
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsVerified(true);
      toastSuccess('BVN verified successfully');
    } catch (err) {
      toastError('Failed to verify BVN');
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
              <h1 className="text-base sm:text-lg md:text-xl font-bold text-[#333333]">KYC Verification</h1>
              <p className="text-[#888888] text-[10px] mt-0.5">Verify your identity with your BVN</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-3 xs:px-4 sm:px-5 md:px-6 py-3 sm:py-4 md:py-4">
        {!isVerified ? (
          <div className="bg-white rounded-lg shadow-sm border border-[#1C3F3B]/10 p-4">
            <div className="mb-5">
              <h2 className="text-xs font-bold text-[#333333] mb-1">Verify Your Identity</h2>
              <p className="text-[10px] text-[#888888]">Complete your KYC verification to unlock higher transaction limits and access more features.</p>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-[#1C3F3B] mb-1.5">BVN (11 digits)</label>
              <input
                type="text"
                maxLength={11}
                value={bvn}
                onChange={(e) => setBvn(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3 py-2.5 border border-[#1C3F3B]/20 rounded-lg text-xs bg-white focus:outline-none focus:border-[#1C3F3B] transition-colors"
                placeholder="Enter your 11-digit BVN"
              />
              <p className="text-[10px] text-[#888888] mt-1">{bvn.length}/11 digits</p>
            </div>

            <button
              onClick={handleVerify}
              disabled={isLoading || bvn.length !== 11}
              className="w-full py-2.5 bg-[#1C3F3B] text-white font-semibold text-xs rounded-lg hover:bg-[#152d2a] disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Verifying...' : 'Verify BVN'}
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-[#1C3F3B]/10 p-4 text-center">
            <div className="w-12 h-12 bg-[#1C3F3B]/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1C3F3B" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h2 className="text-xs font-bold text-[#333333] mb-1">Verification Successful!</h2>
            <p className="text-[10px] text-[#888888] mb-4">Your KYC verification has been completed. Your transaction limits have been increased.</p>
            <button
              onClick={() => router.back()}
              className="w-full py-2.5 bg-[#1C3F3B] text-white font-semibold text-xs rounded-lg hover:bg-[#152d2a] transition-colors"
            >
              Back to Settings
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
