'use client';

import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { toastSuccess, toastError } from '@/hooks/useToast';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  // Escape key handler
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
  const [isLoading, setIsLoading] = useState(false);
  const [privacy, setPrivacy] = useState({
    hideBalance: false,
    panicBalance: '',
  });

  if (!isOpen) return null;

  const handleSavePrivacy = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      toastSuccess('Privacy settings saved');
      onClose();
    } catch (err) {
      toastError('Failed to save privacy settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-white/20 z-40 cursor-pointer"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:justify-center animate-slide-up md:animate-slide-in pointer-events-none">
        <div 
          className="relative bg-white rounded-t-2xl md:rounded-2xl w-full md:w-full md:max-w-md lg:max-w-lg px-4 sm:px-6 pt-6 pb-8 md:pb-8 max-h-[90vh] overflow-y-auto md:shadow-2xl pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drag Handle */}
          <div className="flex justify-center mb-6 md:hidden">
            <div className="w-12 h-1 bg-[#1C3F3B]/30 rounded-full"></div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-[#1C3F3B]/10 rounded-lg transition-all duration-300 hover:scale-[1.1] text-[#1C3F3B] hover:text-[#1C3F3B] z-10"
            title="Close (or press Escape)"
            aria-label="Close modal"
          >
            <FaTimes size={24} />
          </button>

          {/* Content */}
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold text-[#1C3F3B] font-[family-name:Syne]">
                Privacy Settings
              </h2>
              <p className="text-[#5a9894] text-sm md:text-base">
                Manage your account visibility and security
              </p>
            </div>

            {/* Privacy Form */}
            <div className="space-y-4">
              {/* Hide Balance Toggle */}
              <div className="bg-[#f0f7f6] border border-[#d0e8e4] rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <label className="block text-[#1C3F3B] text-sm font-semibold">
                      Hide Balance
                    </label>
                    <p className="text-[#5a9894] text-xs mt-1">
                      Hide your balance on the dashboard
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    title="Hide balance toggle"
                    checked={privacy.hideBalance}
                    onChange={(e) => setPrivacy({ ...privacy, hideBalance: e.target.checked })}
                    className="w-5 h-5 accent-[#1C3F3B] rounded cursor-pointer"
                  />
                </div>
              </div>

              {/* Panic Balance */}
              <div className="space-y-2">
                <label className="block text-[#1C3F3B] text-sm font-semibold">
                  Panic Balance
                </label>
                <input
                  type="number"
                  value={privacy.panicBalance}
                  onChange={(e) => setPrivacy({ ...privacy, panicBalance: e.target.value })}
                  placeholder="Enter amount (optional)"
                  className="w-full px-4 py-3 border-2 border-[#d0e8e4] rounded-lg focus:outline-none focus:border-[#1C3F3B] focus:ring-2 focus:ring-[#1C3F3B]/10 text-[#1C3F3B] bg-white transition-all duration-300 font-medium text-sm"
                />
                <p className="text-[#5a9894] text-xs">
                  Display this amount as your balance in case of emergency. Your actual balance is always secure.
                </p>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSavePrivacy}
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-[#1C3F3B] to-[#2d5d59] text-white rounded-lg font-bold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.01] active:scale-95 shadow-md"
              >
                {isLoading ? 'Saving...' : 'Save Settings'}
              </button>

              {/* Close Button Mobile */}
              <button
                type="button"
                onClick={onClose}
                className="md:hidden w-full py-3 bg-[#f5f5f5] text-[#1C3F3B] border border-[#e0e0e0] rounded-lg font-semibold hover:bg-[#f0f0f0] transition-all duration-300 hover:scale-[1.01] active:scale-95"
              >
                Close (or click outside)
              </button>
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
