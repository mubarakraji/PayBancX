'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { MdArrowBack, MdQrCode2, MdLabel } from 'react-icons/md';
import { toastError, toastSuccess } from '@/hooks/useToast';
import { getAuthHeaders } from '@/config/apiConfig';

export default function EnterTagPage() {
  const router = useRouter();
  const [paymentTag, setPaymentTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentTag.trim()) {
      toastError('Please enter a payment tag');
      return;
    }

    setIsLoading(true);
    try {
      const headers = getAuthHeaders();
      console.log('[EnterTag] Processing tag:', { tag: paymentTag.substring(0, 5) + '...' });

      const response = await fetch('/api/v1/wallet/transfer-tag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify({
          payment_tag: paymentTag,
        }),
      });

      const data = await response.json();
      console.log('[EnterTag] Response:', data);

      if (!response.ok) {
        toastError(data.message || 'Failed to verify payment tag');
        setIsLoading(false);
        return;
      }

      toastSuccess('Payment tag verified! Proceeding to transfer...');
      setTimeout(() => {
        router.push(`/transfer-to-qr/confirm?tag=${encodeURIComponent(paymentTag)}`);
      }, 500);
    } catch (err) {
      console.error('[EnterTag] Error:', err);
      toastError('Error processing payment tag. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paybancx-bg pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-white border-b border-paybancx-border sticky top-0 z-10">
        <div className="max-w-7xl mx-0 px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8 py-3 sm:py-4 md:py-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-paybancx-primary/5 rounded-card transition-all duration-300 hover:scale-[1.02]"
              title="Go back"
              aria-label="Go back"
            >
              <MdArrowBack size={20} className="text-paybancx-action" />
            </button>
            <h1 className="text-lg xs:text-xl sm:text-2xl font-bold text-paybancx-text-dark">Enter Payment Tag</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-0 px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8 py-4 md:py-5">
        {/* Tab Switcher */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => router.push('/transfer-to-qr')}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 py-3 px-6 rounded-card font-semibold transition-all duration-300 bg-white border-2 border-paybancx-border text-paybancx-text-dark hover:border-paybancx-action hover:scale-[1.02]"
            title="Scan QR code"
          >
            <MdQrCode2 size={18} />
            Scan QR
          </button>
          <button
            className="flex-1 md:flex-none flex items-center justify-center gap-2 py-3 px-6 rounded-card font-semibold transition-all duration-300 bg-paybancx-action text-white hover:scale-[1.02] hover:bg-paybancx-action/90"
            title="Enter payment tag"
            disabled
          >
            <MdLabel size={18} />
            Enter Tag
          </button>
        </div>

        {/* Main Content */}
        <div className="max-w-lg">
          {/* Section Title */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-paybancx-text-dark mb-2">
              Enter Payment Tag
            </h2>
            <p className="text-paybancx-text-muted text-base md:text-lg">
              Enter the recipient&apos;s payment tag to send money
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
            {/* Payment Tag Input */}
            <div className="space-y-3">
              <label htmlFor="payment-tag" className="block text-sm font-semibold text-paybancx-text-dark">
                Payment Tag
              </label>
              <div className="relative">
                <input
                  id="payment-tag"
                  type="text"
                  placeholder="PAYBANCX-XXXXXXXX"
                  value={paymentTag}
                  onChange={(e) => setPaymentTag(e.target.value)}
                  maxLength={20}
                  className="w-full px-4 py-4 border border-paybancx-border rounded-card text-paybancx-text-dark placeholder-paybancx-text-muted bg-white focus:outline-none focus:border-paybancx-action focus:shadow-lg focus:shadow-paybancx-action/10 transition-all duration-300 font-mono tracking-wide hover:scale-[1.01]"
                  title="Enter payment tag"
                />
              </div>
              <p className="text-xs text-paybancx-text-muted mt-2">
                Enter the recipient&apos;s payment tag (e.g., PAYBANCX-A3B7C9D2)
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !paymentTag.trim()}
              className="w-full mt-6 py-3 bg-[#1C3F3B] text-white rounded-lg font-bold text-sm hover:bg-[#1F4440] transition-all duration-300 hover:scale-[1.02] shadow-md disabled:bg-[#D0D0D0] disabled:text-white disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              title="Continue to confirmation"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                'Continue'
              )}
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-10 p-4 bg-white rounded-card border border-paybancx-border w-full">
            <p className="text-xs text-paybancx-text-muted text-center leading-relaxed">
               Payment tags are unique identifiers that make transferring money easy. Recipients can share their tag instead of account details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

