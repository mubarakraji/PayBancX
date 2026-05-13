'use client';

import { useState, useRef, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { MdQrCode2, MdLabel, MdCameraAlt } from 'react-icons/md';
import { toastError, toastSuccess } from '@/hooks/useToast';
import { getAuthHeaders } from '@/config/apiConfig';

interface TransferToQRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TransferToQRModal({ isOpen, onClose }: TransferToQRModalProps) {
  const [activeTab, setActiveTab] = useState<'qr' | 'tag'>('qr');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [scannedData, setScannedData] = useState('');
  const [paymentTag, setPaymentTag] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

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

  const initCamera = async () => {
    try {
      const constraints = {
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
        toastSuccess('Camera active');
      }
    } catch (err) {
      toastError('Camera access denied. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleProceedWithQR = async () => {
    if (!scannedData) {
      toastError('Please scan a QR code first');
      return;
    }
    
    setIsProcessing(true);
    try {
      const headers = getAuthHeaders();
      const response = await fetch('/api/v1/wallet/transfer-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify({
          qr_data: scannedData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toastError(data.message || 'Failed to process QR code');
        setIsProcessing(false);
        return;
      }

      toastSuccess('QR code verified!');
      onClose();
    } catch (err) {
      toastError('Error processing QR code. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleTagTransfer = async () => {
    if (!paymentTag.trim()) {
      toastError('Please enter a payment tag');
      return;
    }

    setIsProcessing(true);
    try {
      const headers = getAuthHeaders();
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

      if (!response.ok) {
        toastError(data.message || 'Failed to verify payment tag');
        setIsProcessing(false);
        return;
      }

      toastSuccess('Payment tag verified!');
      onClose();
    } catch (err) {
      toastError('Error processing payment tag. Please try again.');
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-white/20 z-40 cursor-pointer"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:justify-center animate-slide-up md:animate-slide-in pointer-events-none">
        <div 
          className="relative bg-white rounded-t-2xl md:rounded-2xl w-full md:w-full md:max-w-md lg:max-w-lg px-4 sm:px-6 pt-6 pb-8 md:pb-8 max-h-[90vh] overflow-y-auto md:shadow-2xl pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-center mb-6 md:hidden">
            <div className="w-12 h-1 bg-[#1C3F3B]/30 rounded-full"></div>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-[#1C3F3B]/10 rounded-lg transition-all duration-300 hover:scale-[1.1] text-[#1C3F3B] hover:text-[#1C3F3B] z-10"
            title="Close (or press Escape)"
            aria-label="Close modal"
          >
            <FaTimes size={24} />
          </button>

          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold text-[#1C3F3B] font-[family-name:Syne]">
                QR Payment
              </h2>
              <p className="text-[#5a9894] text-sm md:text-base">
                Scan QR or enter payment tag
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setActiveTab('qr');
                  if (!isCameraActive) initCamera();
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === 'qr'
                    ? 'bg-[#1C3F3B] text-white'
                    : 'bg-[#f5f5f5] text-[#1C3F3B] border border-[#e0e0e0]'
                }`}
              >
                <MdQrCode2 size={18} />
                <span>Scan QR</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('tag');
                  stopCamera();
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === 'tag'
                    ? 'bg-[#1C3F3B] text-white'
                    : 'bg-[#f5f5f5] text-[#1C3F3B] border border-[#e0e0e0]'
                }`}
              >
                <MdLabel size={18} />
                <span>Enter Tag</span>
              </button>
            </div>

            {/* QR Tab */}
            {activeTab === 'qr' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-[#1C3F3B] mb-2">Scan QR Code</h3>
                  <p className="text-sm text-[#5a9894]">Position the QR code within the frame</p>
                </div>

                {/* Camera Container */}
                <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center border-2 border-[#1C3F3B]">
                  <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover"
                    muted
                    playsInline
                  />

                  {!isCameraActive && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-20 gap-4">
                      <MdCameraAlt size={48} className="text-white" />
                      <button
                        onClick={initCamera}
                        className="px-6 py-3 bg-[#1C3F3B] text-white rounded-lg font-semibold hover:bg-[#152d2a] transition-all duration-300 hover:scale-[1.01] shadow-sm"
                      >
                        Start Camera
                      </button>
                    </div>
                  )}

                  {/* Scan Frame */}
                  {isCameraActive && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="relative w-56 h-56">
                        <div className="absolute -top-2 -left-2 w-6 h-6 border-t-4 border-l-4 border-[#4db3a8]"></div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 border-t-4 border-r-4 border-[#4db3a8]"></div>
                        <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-4 border-l-4 border-[#4db3a8]"></div>
                        <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-4 border-r-4 border-[#4db3a8]"></div>
                      </div>
                    </div>
                  )}
                </div>

                {scannedData && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700 font-medium">✓ QR code detected</p>
                  </div>
                )}

                <button
                  onClick={handleProceedWithQR}
                  disabled={isProcessing || !scannedData}
                  className="w-full py-3 bg-gradient-to-r from-[#1C3F3B] to-[#2d5d59] text-white rounded-lg font-bold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.01] active:scale-95 shadow-md"
                >
                  {isProcessing ? 'Processing...' : 'Proceed with Transfer'}
                </button>
              </div>
            )}

            {/* Tag Tab */}
            {activeTab === 'tag' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-[#1C3F3B] mb-2">Enter Payment Tag</h3>
                  <p className="text-sm text-[#5a9894]">Enter the recipient's payment tag</p>
                </div>

                <input
                  type="text"
                  placeholder="Enter payment tag"
                  value={paymentTag}
                  onChange={(e) => setPaymentTag(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[#d0e8e4] rounded-lg focus:outline-none focus:border-[#1C3F3B] focus:ring-2 focus:ring-[#1C3F3B]/10 text-[#1C3F3B] bg-white transition-all duration-300 font-medium disabled:opacity-50"
                  disabled={isProcessing}
                />

                <button
                  onClick={handleTagTransfer}
                  disabled={isProcessing || !paymentTag.trim()}
                  className="w-full py-3 bg-gradient-to-r from-[#1C3F3B] to-[#2d5d59] text-white rounded-lg font-bold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.01] active:scale-95 shadow-md"
                >
                  {isProcessing ? 'Processing...' : 'Proceed with Transfer'}
                </button>
              </div>
            )}

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
