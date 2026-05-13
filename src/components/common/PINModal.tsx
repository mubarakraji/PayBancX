'use client';

import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { toastSuccess, toastError } from '@/hooks/useToast';

interface PINModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PINModal({ isOpen, onClose }: PINModalProps) {
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
  const [pin, setPin] = useState(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '']);

  if (!isOpen) return null;

  const handlePinChange = (index: number, value: string, type: 'pin' | 'confirm') => {
    if (value.length > 1) return;
    const arr = type === 'pin' ? [...pin] : [...confirmPin];
    arr[index] = value;
    if (type === 'pin') setPin(arr);
    else setConfirmPin(arr);
  };

  const handleSetPin = async () => {
    if (pin.join('') !== confirmPin.join('')) {
      toastError('PINs do not match');
      return;
    }
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      toastSuccess('Transaction PIN set successfully');
      setPin(['', '', '', '']);
      setConfirmPin(['', '', '', '']);
      onClose();
    } catch (err) {
      toastError('Failed to set PIN');
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
                Set Transaction PIN
              </h2>
              <p className="text-[#5a9894] text-sm md:text-base">
                Enter a 4-digit PIN to secure your transactions
              </p>
            </div>

            {/* PIN Form */}
            <div className="space-y-4">
              {/* First PIN */}
              <div>
                <label className="block text-[#1C3F3B] text-sm font-semibold mb-3">
                  Enter 4-digit PIN
                </label>
                <div className="flex gap-2 justify-center">
                  {pin.map((digit, i) => (
                    <input
                      key={i}
                      type="password"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handlePinChange(i, e.target.value, 'pin')}
                      className="w-12 h-12 text-center text-lg font-bold border-2 border-[#d0e8e4] rounded-lg focus:outline-none focus:border-[#1C3F3B] focus:ring-2 focus:ring-[#1C3F3B]/10 transition-all duration-300"
                      placeholder="•"
                    />
                  ))}
                </div>
              </div>

              {/* Confirm PIN */}
              <div>
                <label className="block text-[#1C3F3B] text-sm font-semibold mb-3">
                  Confirm PIN
                </label>
                <div className="flex gap-2 justify-center">
                  {confirmPin.map((digit, i) => (
                    <input
                      key={i}
                      type="password"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handlePinChange(i, e.target.value, 'confirm')}
                      className="w-12 h-12 text-center text-lg font-bold border-2 border-[#d0e8e4] rounded-lg focus:outline-none focus:border-[#1C3F3B] focus:ring-2 focus:ring-[#1C3F3B]/10 transition-all duration-300"
                      placeholder="•"
                    />
                  ))}
                </div>
              </div>

              {/* Set PIN Button */}
              <button
                onClick={handleSetPin}
                disabled={isLoading || pin.join('').length < 4 || confirmPin.join('').length < 4}
                className="w-full py-3 bg-gradient-to-r from-[#1C3F3B] to-[#2d5d59] text-white rounded-lg font-bold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.01] active:scale-95 shadow-md"
              >
                {isLoading ? 'Setting PIN...' : 'Set PIN'}
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
