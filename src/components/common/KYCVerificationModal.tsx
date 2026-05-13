'use client';

import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { toastSuccess, toastError } from '@/hooks/useToast';

interface KYCVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KYCVerificationModal({ isOpen, onClose }: KYCVerificationModalProps) {
  const [bvn, setBvn] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // Escape key handler
  useEffect(() => {
    if (!isOpen) {
      return; // No cleanup needed when not open
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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
      setTimeout(() => {
        onClose();
        setBvn('');
        setIsVerified(false);
      }, 1500);
    } catch (err) {
      toastError('Failed to verify BVN');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setBvn('');
    setIsVerified(false);
    onClose();
  };

  return (
    <>
      {/* Overlay - Click anywhere to close */}
      <div 
        className="fixed inset-0 bg-white/20 z-40 cursor-pointer"
        onClick={handleClose}
      />

      {/* Responsive Modal Container */}
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:justify-center animate-slide-up md:animate-slide-in pointer-events-none">
        {/* Modal Content */}
        <div 
          className="relative bg-white rounded-t-2xl md:rounded-2xl w-full md:w-full md:max-w-md lg:max-w-lg px-4 sm:px-6 pt-6 pb-8 md:pb-8 max-h-[90vh] overflow-y-auto md:shadow-2xl pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drag Handle - Mobile Only */}
          <div className="flex justify-center mb-6 md:hidden">
            <div className="w-12 h-1 bg-[#1C3F3B]/30 rounded-full"></div>
          </div>

          {/* Close Button - Both Desktop & Mobile */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 hover:bg-[#1C3F3B]/10 rounded-lg transition-all duration-300 hover:scale-[1.1] text-[#1C3F3B] hover:text-[#1C3F3B] z-10"
            title="Close (or press Escape)"
            aria-label="Close modal"
          >
            <FaTimes size={24} />
          </button>

          {/* Content */}
          <div className="space-y-6">
            {!isVerified ? (
              <>
                {/* Header */}
                <div className="text-center space-y-2">
                  <h2 className="text-2xl md:text-3xl font-bold text-[#1C3F3B] font-[family-name:Syne]">
                    KYC Verification
                  </h2>
                  <p className="text-[#5a9894] text-sm md:text-base">
                    Verify your identity with your BVN
                  </p>
                </div>

                {/* Description */}
                <div className="bg-[#f0f7f6] border border-[#d0e8e4] rounded-xl p-4">
                  <p className="text-[#1C3F3B] font-semibold text-sm mb-1">Verify Your Identity</p>
                  <p className="text-[#5a9894] text-xs">
                    Complete your KYC verification to unlock higher transaction limits and access more features.
                  </p>
                </div>

                {/* BVN Input */}
                <div className="space-y-2">
                  <label className="block text-[#1C3F3B] text-sm font-semibold">
                    BVN (11 digits)
                  </label>
                  <input
                    type="text"
                    maxLength={11}
                    value={bvn}
                    onChange={(e) => setBvn(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter your 11-digit BVN"
                    className="w-full px-4 py-3 border-2 border-[#d0e8e4] rounded-lg focus:outline-none focus:border-[#1C3F3B] focus:ring-2 focus:ring-[#1C3F3B]/10 text-[#1C3F3B] bg-white transition-all duration-300 font-medium text-sm"
                  />
                  <p className="text-[#5a9894] text-xs font-medium">{bvn.length}/11 digits</p>
                </div>

                {/* Verify Button */}
                <button
                  onClick={handleVerify}
                  disabled={isLoading || bvn.length !== 11}
                  className="w-full py-3 bg-gradient-to-r from-[#1C3F3B] to-[#2d5d59] text-white rounded-lg font-bold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.01] active:scale-95 shadow-md"
                >
                  {isLoading ? 'Verifying...' : 'Verify BVN'}
                </button>

                {/* Close Button - Mobile Only */}
                <button
                  type="button"
                  onClick={handleClose}
                  className="md:hidden w-full py-3 bg-[#f5f5f5] text-[#1C3F3B] border border-[#e0e0e0] rounded-lg font-semibold hover:bg-[#f0f0f0] transition-all duration-300 hover:scale-[1.01] active:scale-95"
                >
                  Close (or click outside)
                </button>
              </>
            ) : (
              <>
                {/* Success State */}
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-[#1C3F3B]/10 rounded-full flex items-center justify-center mx-auto">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1C3F3B" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-[#1C3F3B] mb-1">Verification Successful!</h2>
                    <p className="text-[#5a9894] text-sm md:text-base">
                      Your KYC verification has been completed. Your transaction limits have been increased.
                    </p>
                  </div>

                  <button
                    onClick={handleClose}
                    className="w-full py-3 bg-gradient-to-r from-[#1C3F3B] to-[#2d5d59] text-white rounded-lg font-bold hover:shadow-lg transition-all duration-300 hover:scale-[1.01] active:scale-95 shadow-md"
                  >
                    Back to Settings
                  </button>
                </div>
              </>
            )}
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
          animation: slideUp 0.3s ease-out;
        }

        @media (min-width: 768px) {
          .animate-slide-in {
            animation: slideIn 0.3s ease-out;
          }
        }
      `}</style>
    </>
  );
}
