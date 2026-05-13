'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MdArrowBack, MdContentCopy, MdCheckCircle } from 'react-icons/md';
import { getVirtualAccount, checkKYCStatus } from '@/services/walletService';
import { toastError, toastSuccess } from '@/hooks/useToast';

export default function AddFundsPage() {
  const router = useRouter();
  const [virtualAccount, setVirtualAccount] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    fetchVirtualAccount();
  }, []);

  const fetchVirtualAccount = async () => {
    setIsLoading(true);
    try {
      const kycStatus = await checkKYCStatus();
      // KYC status fetched

      if (!kycStatus.verified) {
        toastError('Please complete KYC verification to access your virtual account');
        setTimeout(() => {
          router.push('/settings/kyc-verification');
        }, 1500);
        return;
      }

      const account = await getVirtualAccount();
      setVirtualAccount(account);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load account details';

      if (
        errorMessage.toLowerCase().includes('bvn') ||
        errorMessage.toLowerCase().includes('kyc') ||
        errorMessage.toLowerCase().includes('verify')
      ) {
        toastError('Please complete KYC verification to access your virtual account');
        setTimeout(() => {
          router.push('/settings/kyc-verification');
        }, 1500);
      } else {
        toastError(errorMessage);
      }

      console.error('Virtual account fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toastSuccess('Copied to clipboard!');

    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-paybancx-border sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-5 md:px-6 py-2.5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-1 hover:bg-paybancx-primary/5 rounded-lg transition-all"
              title="Go back"
            >
              <MdArrowBack size={20} className="text-paybancx-action" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-paybancx-text-dark">Add Funds</h1>
              <p className="text-paybancx-text-muted text-xs">Transfer money to your wallet</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Centered */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-5 md:px-6">
        {isLoading ? (
          // Loading State
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-14 h-14 mb-3">
              <div className="absolute inset-0 border-3 border-paybancx-border rounded-full"></div>
              <div className="absolute inset-0 border-3 border-transparent border-t-paybancx-action rounded-full animate-spin"></div>
            </div>
            <p className="text-paybancx-text-muted text-sm">Loading account details...</p>
          </div>
        ) : virtualAccount ? (
          <div className="w-full sm:w-96">
              <div className="bg-white rounded-lg p-3.5 border border-paybancx-border">
                <div className="space-y-2.5">
                  {/* Badge */}
                  <div className="inline-block bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-xs font-bold">
                    ✓ Verified Account
                  </div>

                  {/* Bank Name */}
                  <div className="space-y-0.5 pb-2.5 border-b border-paybancx-border">
                    <p className="text-xs text-paybancx-text-muted font-semibold uppercase">Bank</p>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-bold text-paybancx-text-dark">{virtualAccount.bankName || 'N/A'}</p>
                      <button
                        onClick={() => handleCopyToClipboard(virtualAccount.bankName || '', 'bankName')}
                        className="p-0.5 hover:bg-paybancx-bg rounded transition-all"
                        title="Copy"
                      >
                        {copiedField === 'bankName' ? (
                          <MdCheckCircle className="text-green-500" size={14} />
                        ) : (
                          <MdContentCopy className="text-paybancx-text-muted" size={14} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Account Number */}
                  <div className="space-y-0.5 pb-2.5 border-b border-paybancx-border">
                    <p className="text-xs text-paybancx-text-muted font-semibold uppercase">Account Number</p>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-base font-bold text-paybancx-action tracking-wider">
                        {virtualAccount.accountNumber || 'N/A'}
                      </p>
                      <button
                        onClick={() => handleCopyToClipboard(virtualAccount.accountNumber || '', 'accountNumber')}
                        className="p-0.5 hover:bg-paybancx-bg rounded transition-all"
                        title="Copy"
                      >
                        {copiedField === 'accountNumber' ? (
                          <MdCheckCircle className="text-green-500" size={14} />
                        ) : (
                          <MdContentCopy className="text-paybancx-text-muted" size={14} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Account Name */}
                  <div className="space-y-0.5">
                    <p className="text-xs text-paybancx-text-muted font-semibold uppercase">Account Name</p>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-paybancx-text-dark">
                        {virtualAccount.accountName || 'N/A'}
                      </p>
                      <button
                        onClick={() => handleCopyToClipboard(virtualAccount.accountName || '', 'accountName')}
                        className="p-0.5 hover:bg-paybancx-bg rounded transition-all"
                        title="Copy"
                      >
                        {copiedField === 'accountName' ? (
                          <MdCheckCircle className="text-green-500" size={14} />
                        ) : (
                          <MdContentCopy className="text-paybancx-text-muted" size={14} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-700 font-semibold text-sm">Failed to load account details</p>
            
          </div>
        )}
      </main>
    </div>
  );
}

