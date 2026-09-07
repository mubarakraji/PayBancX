'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaTimes } from 'react-icons/fa';
import { MdCheckCircle, MdContentCopy } from 'react-icons/md';
import { getVirtualAccount } from '@/services/walletService';
import { toastError, toastSuccess } from '@/hooks/useToast';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DepositModal({ isOpen, onClose }: DepositModalProps) {
  const router = useRouter();
  const [virtualAccount, setVirtualAccount] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAccountNumberCopied, setIsAccountNumberCopied] = useState(false);

  const copyAccountNumber = async () => {
    const accountNumber = String(virtualAccount?.accountNumber || '');
    if (!accountNumber) {
      toastError('No account number is available to copy.');
      return;
    }

    try {
      await navigator.clipboard.writeText(accountNumber);
      setIsAccountNumberCopied(true);
      toastSuccess('Account number copied!');
      setTimeout(() => setIsAccountNumberCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = accountNumber;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const copied = document.execCommand('copy');
      document.body.removeChild(textArea);

      if (copied) {
        setIsAccountNumberCopied(true);
        toastSuccess('Account number copied!');
        setTimeout(() => setIsAccountNumberCopied(false), 2000);
      } else {
        toastError('Copy was blocked. Please select the account number manually.');
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      fetchVirtualAccount();
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  // Escape key handler - only registered when modal is open
  useEffect(() => {
    if (!isOpen) {
      return; // No cleanup needed when not open
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const fetchVirtualAccount = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch virtual account - API will handle KYC validation
      const account = await getVirtualAccount();
      setVirtualAccount(account);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load account details';
      
      // Check if error is related to KYC/BVN verification
      if (errorMessage.toLowerCase().includes('bvn') || errorMessage.toLowerCase().includes('kyc') || errorMessage.toLowerCase().includes('verify')) {
        setError('KYC verification required');
      } else {
        setError(errorMessage);
      }
      
      console.error('Virtual account fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay - Click anywhere to close */}
      <div 
        className="fixed inset-0 bg-white/20 z-40 cursor-pointer"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:justify-center pointer-events-none">
        {/* Modal Content */}
        <div 
          className="relative bg-white rounded-t-3xl md:rounded-2xl w-full md:max-w-md lg:max-w-lg h-auto md:h-auto max-h-[95vh] md:max-h-none overflow-y-auto md:shadow-2xl pointer-events-auto animate-slide-up md:animate-slide-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drag Handle - Mobile Only */}
          <div className="flex justify-center mb-6 md:hidden px-4 pt-4">
            <div className="w-12 h-1 bg-[#1C3F3B]/30 rounded-full"></div>
          </div>

          {/* Close Button - Both Desktop & Mobile */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-[#1C3F3B]/10 rounded-lg transition-all duration-300 hover:scale-[1.1] text-[#1C3F3B] hover:text-[#1C3F3B] z-10"
            title="Close (or press Escape)"
            aria-label="Close modal"
          >
            <FaTimes size={24} />
          </button>

          {/* Scrollable Content Wrapper */}
          <div className="px-4 sm:px-6 pt-4 md:pt-6 pb-6 md:pb-8">
            {/* Content */}
            <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold text-[#1C3F3B] font-[family-name:Syne]">
                Add Funds
              </h2>
              <p className="text-[#5a9894] text-sm md:text-base">
                Transfer money to your wallet
              </p>
            </div>



            {isLoading ? (
              <>
                {/* Loading Spinner */}
                <div className="py-12 flex flex-col items-center justify-center">
                  <div className="relative w-16 h-16 mb-4">
                    <div className="absolute inset-0 border-4 border-[#e0f5f2] rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-transparent border-t-[#1C3F3B] rounded-full animate-spin"></div>
                  </div>
                  <p className="text-[#5a9894] text-center font-medium">
                    Loading account details...
                  </p>
                </div>
              </>
            ) : error ? (
              <>
                {/* Error State */}
                <div className="mb-8">
                  <div className="bg-red-50 border border-red-200 rounded-card p-4 mb-4">
                    <p className="text-red-600 font-semibold mb-2">Unable to Load</p>
                    <p className="text-red-500 text-sm">{error}</p>
                  </div>
                  {error === 'KYC verification required' ? (
                    <button
                      onClick={() => {
                        onClose();
                        router.push('/settings/kyc-verification');
                      }}
                      className="w-full py-3 bg-paybancx-action text-white rounded-card font-semibold hover:bg-paybancx-action/90 transition-all duration-300 hover:scale-[1.02]"
                    >
                      Complete KYC Verification
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setError(null);
                        fetchVirtualAccount();
                      }}
                      className="w-full py-3 bg-paybancx-action text-white rounded-card font-semibold hover:bg-paybancx-action/90 transition-all duration-300 hover:scale-[1.02]"
                    >
                      Retry
                    </button>
                  )}
                </div>
              </>
            ) : virtualAccount ? (
              <>
                {/* Account Details */}
                <div className="bg-paybancx-bg rounded-card p-6 mb-8 border border-paybancx-border">
                  <p className="text-paybancx-text-muted text-xs font-semibold tracking-wide uppercase mb-2">
                    Bank Details
                  </p>
                  <div className="space-y-4">
                    <div>
                      <p className="text-paybancx-text-muted text-sm mb-1">Bank Name</p>
                      <p className="text-paybancx-text-dark font-semibold">{virtualAccount.bankName || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-paybancx-text-muted text-sm mb-1">Account Number</p>
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-paybancx-text-dark font-semibold text-lg select-all">
                          {virtualAccount.accountNumber || 'N/A'}
                        </p>
                        <button
                          type="button"
                          onClick={copyAccountNumber}
                          className="flex h-9 min-w-[76px] shrink-0 items-center justify-center gap-1 rounded-md border px-2 text-xs font-semibold shadow-sm transition-opacity hover:opacity-90"
                          style={{
                            backgroundColor: '#1C3F3B',
                            borderColor: '#1C3F3B',
                            color: '#FFFFFF',
                          }}
                          title="Copy account number"
                          aria-label="Copy account number"
                        >
                          {isAccountNumberCopied ? (
                            <>
                              <MdCheckCircle size={16} />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <MdContentCopy size={16} />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="text-paybancx-text-muted text-sm mb-1">Account Name</p>
                      <p className="text-paybancx-text-dark font-semibold">{virtualAccount.accountName || 'N/A'}</p>
                    </div>
                  </div>
                </div>



                {/* Close Button - Mobile Only */}
                <button
                  onClick={onClose}
                  className="md:hidden w-full py-3 bg-[#f5f5f5] text-[#1C3F3B] border border-[#e0e0e0] rounded-lg font-semibold hover:bg-[#f0f0f0] transition-all duration-300 hover:scale-[1.01] active:scale-95"
                >
                  Close (or click outside)
                </button>
              </>
            ) : null}

            {/* Close Button - Mobile Only (Error State) */}
            {!isLoading && error && (
              <button
                onClick={onClose}
                className="md:hidden w-full py-3 bg-[#f5f5f5] text-[#1C3F3B] border border-[#e0e0e0] rounded-lg font-semibold hover:bg-[#f0f0f0] transition-all duration-300 hover:scale-[1.01] active:scale-95"
              >
                Close (or click outside)
              </button>
            )}
          </div>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-slide-up {
          animation: slideUp 0.3s ease-out forwards;
        }

        @media (min-width: 768px) {
          .animate-slide-in {
            animation: slideIn 0.3s ease-out forwards;
          }
        }

        /* Remove number input spinner buttons */
        .no-spinner::-webkit-outer-spin-button,
        .no-spinner::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        .no-spinner[type='number'] {
          -moz-appearance: textfield;
        }
      `}</style>
    </>
  );
}

