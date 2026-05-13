'use client';

import { useEffect, useState, useRef } from 'react';
import { FaTimes, FaInfoCircle, FaCamera, FaQrcode, FaDownload } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';

interface GetQRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GetQRModal({ isOpen, onClose }: GetQRModalProps) {
  const { user } = useAuth();
  const [mode, setMode] = useState<'display' | 'scan'>('display');
  const [scannedData, setScannedData] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // User's payment QR data (includes account/user identifier)
  const qrValue = user?.id 
    ? `https://paybancx.app/pay/${user.id}`
    : 'https://paybancx.app/pay'; // Fallback if user ID not available
  
  // QR code image URL using API (no dependencies needed)
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrValue)}`;

  // Handle body overflow on open/close
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = 'unset';
      if (isScanning) {
        stopScanning();
      }
      return;
    }
    document.body.style.overflow = 'hidden';
  }, [isOpen, isScanning]);

  // Escape key handler - only registered when modal is open
  useEffect(() => {
    if (!isOpen) {
      return; // No cleanup needed when not open
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        stopScanning();
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Start camera for scanning
  const startScanning = async () => {
    setScanError(null);
    setScannedData('');
    setIsScanning(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      setScanError('Unable to access camera. Please check permissions.');
      setIsScanning(false);
      console.error('Camera error:', error);
    }
  };

  // Stop camera
  const stopScanning = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  // Download QR code
  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.href = qrImageUrl;
    link.download = 'paybancx-qr-code.png';
    link.click();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay - Click anywhere to close */}
      <div
        className="fixed inset-0 bg-white/20 z-40 cursor-pointer"
        onClick={onClose}
      />

      {/* Bottom Sheet Modal */}
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
        <div className="relative bg-paybancx-bg rounded-t-card px-4 pt-3 pb-6 w-full border-t border-paybancx-action/20 max-h-[90vh] overflow-y-auto">
          {/* Drag Handle */}
          <div className="flex justify-center mb-4">
            <div className="w-10 h-1 bg-paybancx-border rounded-full"></div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 hover:bg-[#1C3F3B]/10 rounded-lg transition-all duration-300 hover:scale-[1.05] z-10"
            title="Close (or press Escape)"
            aria-label="Close QR modal"
          >
            <FaTimes size={18} className="text-[#1C3F3B]" />
          </button>

          {/* Mode Toggle */}
          <div className="flex gap-2 mb-5 bg-white p-0.5 rounded-card">
            <button
              onClick={() => {
                setMode('display');
                stopScanning();
                setScannedData('');
                setScanError(null);
              }}
              className={`flex-1 py-2 rounded-card font-bold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] ${
                mode === 'display'
                  ? 'bg-paybancx-action text-white'
                  : 'bg-white border border-paybancx-border text-paybancx-text-dark hover:border-paybancx-action'
              }`}
            >
              <FaQrcode size={14} />
              Display
            </button>
            <button
              onClick={() => {
                setMode('scan');
                setScannedData('');
                setScanError(null);
              }}
              className={`flex-1 py-2 rounded-card font-bold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] ${
                mode === 'scan'
                  ? 'bg-paybancx-action text-white'
                  : 'bg-white border border-paybancx-border text-paybancx-text-dark hover:border-paybancx-action'
              }`}
            >
              <FaCamera size={16} />
              Scan
            </button>
          </div>

          {/* Display Mode */}
          {mode === 'display' && (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-paybancx-text-dark mb-2">Your QR Code</h2>
                <p className="text-paybancx-text-muted text-sm">
                  Share this to receive payments instantly
                </p>
              </div>

              {/* QR Code Display */}
              <div className="flex justify-center mb-8">
                <div className="p-4 bg-white rounded-card shadow-soft border-2 border-paybancx-action/30">
                  <img 
                    src={qrImageUrl} 
                    alt="Payment QR Code"
                    className="w-64 h-64 object-contain"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="bg-white border border-paybancx-action/20 rounded-card px-4 py-4 flex gap-3 mb-8">
                <div className="flex-shrink-0">
                  <FaInfoCircle size={20} className="text-paybancx-action mt-0.5" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-paybancx-text-muted leading-relaxed">
                    Share this QR code with others to receive payments. They can scan it with their phone camera to send you money instantly.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={downloadQRCode}
                  className="flex-1 py-4 bg-paybancx-action text-white rounded-card font-bold text-base hover:bg-paybancx-action/90 transition-all duration-300 shadow-soft flex items-center justify-center gap-2 hover:scale-[1.02]"
                >
                  <FaDownload size={18} />
                  Download
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(qrValue);
                    alert('Payment link copied!');
                  }}
                  className="flex-1 py-4 bg-white text-paybancx-action border-2 border-paybancx-action rounded-card font-bold text-base hover:bg-paybancx-action/5 transition-all duration-300 hover:scale-[1.02]"
                >
                  Copy Link
                </button>
              </div>
            </>
          )}

          {/* Scan Mode */}
          {mode === 'scan' && (
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-paybancx-text-dark mb-2">Scan QR Code</h2>
                <p className="text-paybancx-text-muted text-sm">
                  Open your camera to scan QR codes
                </p>
              </div>

              {!isScanning && !scannedData && (
                <div className="flex justify-center mb-6">
                  <button
                    onClick={startScanning}
                    className="px-8 py-4 bg-paybancx-action text-white rounded-card font-bold text-lg hover:bg-paybancx-action/90 transition-all duration-300 shadow-soft flex items-center gap-2 hover:scale-[1.02]"
                  >
                    <FaCamera size={20} />
                    Start Camera
                  </button>
                </div>
              )}

              {isScanning && (
                <>
                  {/* Video Feed */}
                  <div className="relative mb-6 rounded-card overflow-hidden bg-black border-2 border-paybancx-action/30 aspect-square">
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      playsInline
                      autoPlay
                    />
                    {/* Scanning Frame Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-64 h-64 border-4 border-paybancx-action rounded-card shadow-[0_0_30px_rgba(3,105,161,0.3)]">
                        <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-paybancx-action"></div>
                        <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-paybancx-action"></div>
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-paybancx-action"></div>
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-paybancx-action"></div>
                      </div>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="bg-white border border-paybancx-action/20 rounded-card px-4 py-4 mb-6">
                    <p className="text-sm text-paybancx-text-muted text-center">
                      Position a QR code within the frame to scan it
                    </p>
                  </div>

                  {/* Manual Input */}
                  <div className="mb-6">
                    <label className="block text-sm text-paybancx-text-muted mb-2">Or paste QR data:</label>
                    <input
                      type="text"
                      value={scannedData}
                      onChange={(e) => setScannedData(e.target.value)}
                      placeholder="Paste QR code data here..."
                      className="w-full px-4 py-3 bg-white border border-paybancx-border rounded-card text-paybancx-text-dark placeholder-paybancx-text-muted focus:border-paybancx-action focus:outline-none transition-all duration-300"
                    />
                  </div>

                  {/* Stop Button */}
                  <button
                    onClick={() => {
                      stopScanning();
                      setScanError(null);
                    }}
                    className="w-full py-4 bg-red-600 text-white rounded-card font-bold text-base hover:bg-red-700 transition-all duration-300 mb-6 hover:scale-[1.02]"
                  >
                    Stop Scanning
                  </button>
                </>
              )}

              {scanError && (
                <div className="bg-red-900/20 border border-red-500/50 rounded-card px-4 py-4 mb-6">
                  <p className="text-sm text-red-400">{scanError}</p>
                </div>
              )}

              {scannedData && !isScanning && (
                <div className="bg-green-900/20 border border-green-500/50 rounded-card px-4 py-4 mb-6">
                  <p className="text-sm text-green-400 font-bold mb-2">Data Captured:</p>
                  <p className="text-sm text-paybancx-text-muted break-all mb-4">{scannedData}</p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(scannedData);
                      alert('Data copied!');
                    }}
                    className="w-full py-2 bg-paybancx-action text-white rounded-card font-bold text-sm hover:bg-paybancx-action/90 transition-all duration-300 hover:scale-[1.02]"
                  >
                    Copy Data
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

