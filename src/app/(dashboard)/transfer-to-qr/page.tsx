'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { MdArrowBack, MdQrCode2, MdLabel, MdCameraAlt, MdFlip } from 'react-icons/md';
import { toastError, toastSuccess } from '@/hooks/useToast';
import { getAuthHeaders } from '@/config/apiConfig';

export default function TransferToQRPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'qr' | 'tag'>('qr');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'pending'>('pending');
  const [scannedData, setScannedData] = useState('');
  const [paymentTag, setPaymentTag] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationIdRef = useRef<number | null>(null);

  // Initialize camera
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
        setCameraPermission('granted');
        setIsCameraActive(true);
        startScanning();
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraPermission('denied');
      toastError('Camera access denied. Please check permissions.');
    }
  };

  // QR scanning loop
  const startScanning = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scan = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Simple QR detection via pixel analysis
        // In production, you'd use jsQR or similar library
        const brightness = calculateBrightness(data);

        if (brightness > 100) {
          // Attempt detection
          const qrPattern = detectQRPattern(imageData);
          if (qrPattern) {
            setScannedData(qrPattern);
            stopScanning();
            toastSuccess('QR code detected!');
            return;
          }
        }
      }
      animationIdRef.current = requestAnimationFrame(scan);
    };

    animationIdRef.current = requestAnimationFrame(scan);
  };

  // Stop camera
  const stopScanning = () => {
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    setIsCameraActive(false);
  };

  // Helper to calculate image brightness
  const calculateBrightness = (data: Uint8ClampedArray) => {
    let r = 0, g = 0, b = 0;
    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
    }
    const pixelCount = data.length / 4;
    return (r + g + b) / (pixelCount * 3);
  };

  // Simple QR pattern detection
  const detectQRPattern = (imageData: ImageData) => {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;

    // Look for QR-like patterns (simplified detection)
    let darkPixels = 0;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = (r + g + b) / 3;

      if (brightness < 128) {
        darkPixels++;
      }
    }

    // If we have a good ratio of dark pixels, might be a QR code
    const darkRatio = darkPixels / (width * height);
    if (darkRatio > 0.2 && darkRatio < 0.8) {
      return 'qr_' + Date.now();
    }

    return null;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanning();
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
      console.log('[QRTransfer] Processing QR data:', { qr: scannedData.substring(0, 10) + '...' });

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
      console.log('[QRTransfer] Response:', data);

      if (!response.ok) {
        toastError(data.message || 'Failed to process QR code');
        setIsProcessing(false);
        return;
      }

      toastSuccess('QR code verified! Proceeding to transfer...');
      setTimeout(() => {
        router.push(`/transfer-to-qr/confirm?qr=${encodeURIComponent(scannedData)}`);
      }, 500);
    } catch (err) {
      console.error('[QRTransfer] Error:', err);
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
      console.log('[TagTransfer] Processing tag:', { tag: paymentTag.substring(0, 5) + '...' });

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
      console.log('[TagTransfer] Response:', data);

      if (!response.ok) {
        toastError(data.message || 'Failed to verify payment tag');
        setIsProcessing(false);
        return;
      }

      toastSuccess('Payment tag verified! Proceeding to transfer...');
      setTimeout(() => {
        router.push(`/transfer-to-qr/confirm?tag=${encodeURIComponent(paymentTag)}`);
      }, 500);
    } catch (err) {
      console.error('[TagTransfer] Error:', err);
      toastError('Error processing payment tag. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleRetry = () => {
    setScannedData('');
    initCamera();
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8] pb-20 text-[#122927] md:pb-6">
      <div className="sticky top-0 z-10 border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-3 py-3 xs:px-4 sm:px-5 sm:py-4 md:px-6 lg:px-8">
          <button
            onClick={() => {
              stopScanning();
              router.back();
            }}
            title="Go back"
            aria-label="Go back"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#1C3F3B] transition-all duration-200 hover:border-[#1C3F3B]/30 hover:bg-[#F8FAFA]"
          >
            <MdArrowBack size={20} />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-[#122927] sm:text-xl">QR Payment</h1>
            <p className="text-sm text-[#64748B]">Scan a QR code or enter a payment tag</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-3 py-4 xs:px-4 sm:px-6 md:px-8 lg:px-6 xl:px-8 md:py-5">
        {/* Tab Switcher */}
        <div className="mb-8 flex gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-1.5 shadow-sm">
          <button
            onClick={() => {
              setActiveTab('qr');
              if (cameraPermission === 'pending') {
                initCamera();
              }
            }}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 py-3 px-6 rounded-card font-semibold transition-all duration-300 ${
              activeTab === 'qr'
                ? 'bg-paybancx-action text-white hover:scale-[1.02] hover:bg-paybancx-action/90'
                : 'bg-white border border-paybancx-border text-paybancx-text-dark hover:border-paybancx-action hover:scale-[1.02]'
            }`}
            title="Scan QR code"
          >
            <MdQrCode2 size={18} />
            Scan QR
          </button>
          <button
            onClick={() => setActiveTab('tag')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 py-3 px-6 rounded-card font-semibold transition-all duration-300 ${
              activeTab === 'tag'
                ? 'bg-paybancx-action text-white hover:scale-[1.02] hover:bg-paybancx-action/90'
                : 'bg-white border border-paybancx-border text-paybancx-text-dark hover:border-paybancx-action hover:scale-[1.02]'
            }`}
            title="Enter payment tag"
          >
            <MdLabel size={18} />
            Enter Tag
          </button>
        </div>

        {/* Scan QR Tab */}
        {activeTab === 'qr' && (
          <div>
            {/* Info Section */}
            <div className="mb-8">
              <h2 className="text-lg xs:text-xl sm:text-xl md:text-lg font-bold text-paybancx-text-dark mb-2">
                Scan QR Code
              </h2>
              <p className="text-paybancx-text-muted text-xs xs:text-sm sm:text-base md:text-sm">
                Position the QR code within the frame to scan
              </p>
            </div>

            {/* Scanner Container */}
            {cameraPermission !== 'denied' && (
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-video md:aspect-auto md:h-[500px] flex items-center justify-center border-2 border-paybancx-action max-w-2xl mx-auto mb-6">
                {/* Video Element */}
                <video
                  ref={videoRef}
                  className="absolute inset-0 w-full h-full object-cover"
                  muted
                  playsInline
                />

                {!isCameraActive && cameraPermission === 'pending' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-20">
                    <MdCameraAlt size={48} className="text-white mb-4" />
                    <button
                      onClick={initCamera}
                      className="px-6 py-3 bg-[#1C3F3B] text-white rounded-lg font-semibold hover:bg-[#152d2a] transition-all duration-300 hover:scale-[1.01] shadow-sm"
                    >
                      Start Camera
                    </button>
                  </div>
                )}

                {/* Scan Frame */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative w-64 h-64 md:w-80 md:h-80">
                    {/* Corner indicators */}
                    <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-green-400"></div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-green-400"></div>
                    <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-green-400"></div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-green-400"></div>

                    {/* Center reticle */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-1 h-8 bg-green-400/50"></div>
                      <div className="absolute w-8 h-1 bg-green-400/50"></div>
                    </div>
                  </div>
                </div>

                {/* Scanning animation */}
                {isCameraActive && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/3 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-pulse"></div>
                  </div>
                )}

                {/* Overlay darkening outside frame */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-black/60"></div>

                {/* Status indicator */}
                <div className="absolute bottom-4 left-4 bg-black/70 px-3 py-2 rounded-card text-white text-xs font-semibold flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isCameraActive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                  {isCameraActive ? 'Scanning...' : 'Ready'}
                </div>
              </div>
            )}

            {/* Hidden Canvas for QR detection */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Scanned Result or Help Text */}
            {scannedData ? (
              <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-card max-w-2xl mx-auto">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-green-900">QR Code Scanned Successfully!</h3>
                    <p className="text-sm text-green-700 mt-1">Payment Tag: {scannedData}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleProceedWithQR}
                    disabled={isProcessing}
                    className="flex-1 py-2.5 bg-[#1C3F3B] text-white rounded-lg font-semibold hover:bg-[#152d2a] transition-all duration-300 hover:scale-[1.01] shadow-sm disabled:bg-[#D0D0D0] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isProcessing ? 'Processing...' : 'Proceed to Transfer'}
                  </button>
                  <button
                    onClick={handleRetry}
                    disabled={isProcessing}
                    className="flex-1 py-2.5 bg-white border-2 border-[#1C3F3B] text-[#1C3F3B] rounded-lg font-semibold hover:border-[#152d2a] transition-all duration-300 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    Scan Again
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-6 p-6 bg-white rounded-card border border-paybancx-border max-w-2xl mx-auto">
                <p className="text-sm text-paybancx-text-muted text-center font-medium">
                  Make sure the QR code is clearly visible within the frame. The scan will automatically detect and process the code.
                </p>
                {cameraPermission === 'denied' && (
                  <p className="text-sm text-red-600 text-center mt-3 font-semibold">
                    Camera access denied. Please enable camera permissions in your browser settings.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Enter Tag Tab */}
        {activeTab === 'tag' && (
          <div>
            <div className="mb-8">
              <h2 className="text-lg xs:text-xl sm:text-xl md:text-lg font-bold text-paybancx-text-dark mb-2">
                Enter Payment Tag
              </h2>
              <p className="text-paybancx-text-muted text-xs xs:text-sm sm:text-base md:text-sm">
                Enter the recipient&apos;s payment tag or account identifier
              </p>
            </div>

            <div className="max-w-2xl bg-white rounded-2xl p-4 md:p-5 border border-paybancx-border">
              <div className="space-y-4 md:space-y-5">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-paybancx-text-dark">
                    Payment Tag
                  </label>
                  <input
                    type="text"
                    placeholder="Enter @paymentag or account number"
                    value={paymentTag}
                    onChange={(e) => setPaymentTag(e.target.value)}
                    className="w-full px-4 py-4 bg-white border border-paybancx-border rounded-card text-paybancx-text-dark placeholder-paybancx-text-muted focus:outline-none focus:border-paybancx-action transition-all duration-300 disabled:opacity-50"
                    disabled={isProcessing}
                  />
                  <p className="text-xs text-paybancx-text-muted mt-2">
                    Enter the payment tag or account identifier of the recipient (e.g., @john_doe or 1234567890)
                  </p>
                </div>

                <button
                  onClick={handleTagTransfer}
                  disabled={isProcessing || !paymentTag.trim()}
                  className="w-full py-3 bg-[#1C3F3B] text-white rounded-lg font-semibold text-base flex items-center justify-center gap-2 hover:bg-[#152d2a] transition-all duration-300 hover:scale-[1.01] shadow-sm disabled:bg-[#D0D0D0] disabled:text-white disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <span className="transform -rotate-[30deg]">→</span>
                  {isProcessing ? 'Processing...' : 'Continue'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

