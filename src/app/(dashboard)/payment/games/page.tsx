/* eslint-disable @next/next/no-style-component-with-dynamic-styles */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { MdArrowBack, MdExpandMore, MdCheckCircle, MdVerified } from 'react-icons/md';
import { getBettingProviders, fundBettingAccount, verifyBettingAccount } from '@/services/paymentService';
import { useAuth } from '@/hooks/useAuth';
import { toastError, toastSuccess } from '@/hooks/useToast';

// Fallback betting platforms
const FALLBACK_PLATFORMS = [
  { id: '1xbet', name: '1xBet', code: '1XBET', idType: 'Account ID', platformCode: '1XBET' },
  { id: 'bangbet', name: 'BangBet', code: 'BANGBET', idType: 'User ID', platformCode: 'BANGBET' },
  { id: 'bet9ja', name: 'Bet9ja', code: 'BET9JA', idType: 'User ID', platformCode: 'BET9JA' },
  { id: 'betking', name: 'BetKing', code: 'BETKING', idType: 'Customer ID', platformCode: 'BETKING' },
  { id: 'sportybet', name: 'SportyBet', code: 'SPORTYBET', idType: 'User ID', platformCode: 'SPORTYBET' },
];

const AMOUNT_CHIPS = [1000, 2500, 5000, 10000];

interface BettingPlatform {
  id: string;
  name: string;
  code?: string;
  idType?: string;
  platformCode?: string;
}

const getPlatformImage = (platformId: string): string => {
  const imageMap: { [key: string]: string } = {
    '1xbet': '/b1.png',
    'bangbet': '/b2.png',
    'bet9ja': '/b3.png',
    'betking': '/b4.png',
    'sportybet': '/b5.png',
  };
  return imageMap[platformId] || '/b1.png';
};

export default function GamesPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  
  const [selectedPlatform, setSelectedPlatform] = useState<BettingPlatform | null>(null);
  const [customerId, setCustomerId] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [showPlatformSheet, setShowPlatformSheet] = useState(false);
  const [platforms, setPlatforms] = useState<BettingPlatform[]>(FALLBACK_PLATFORMS);
  const [isLoadingProviders, setIsLoadingProviders] = useState(false);
  const [isFunding, setIsFunding] = useState(false);
  const [verifiedCustomer, setVerifiedCustomer] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProviders();
    }
  }, [isAuthenticated]);

  const fetchProviders = async () => {
    setIsLoadingProviders(true);
    try {
      const result = await getBettingProviders();
      
      if (result && result.length > 0) {
        console.log('[GamesPage] ✓ Loaded', result.length, 'betting providers from API');
        setPlatforms(result as any);
      } else {
        console.log('[GamesPage] ℹ Using local provider data');
        setPlatforms(FALLBACK_PLATFORMS);
      }
    } catch (err) {
      console.log('[GamesPage] ℹ Using fallback betting providers');
      setPlatforms(FALLBACK_PLATFORMS);
    } finally {
      setIsLoadingProviders(false);
    }
  };

  const selectedPlatformData = selectedPlatform;
  const displayAmount = selectedAmount || (customAmount ? parseInt(customAmount) : null);
  const isFormComplete = selectedPlatform && customerId && displayAmount && displayAmount >= 100 && verifiedCustomer;

  const handleCustomerIDChange = async (value: string) => {
    setCustomerId(value);
    setVerifiedCustomer(null);

    if (value.trim().length >= 6 && selectedPlatform) {
      setIsVerifying(true);
      try {
        const providerCode = selectedPlatform.platformCode || selectedPlatform.code || selectedPlatform.name;
        console.log('[GamesPage] Verifying account with:');
        console.log('[GamesPage] - Customer ID:', value);
        console.log('[GamesPage] - Provider:', providerCode);
        
        const response = await verifyBettingAccount({
          customerId: value,
          provider: providerCode,
        });
        
        console.log('[GamesPage] ✅ Verification response:', response);
        
        if (response.success && response.data?.customerName) {
          setVerifiedCustomer(response.data.customerName);
          toastSuccess(`Verified: ${response.data.customerName}`);
        } else {
          console.error('Verification response:', response);
          toastError('Account ID not found. Please check the account ID and try again.');
        }
      } catch (err) {
        console.error('Verification error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to verify account ID';
        
        console.error('[GamesPage] Full error:', err);
        
        if (errorMessage.includes('not found') || errorMessage.includes('invalid')) {
          toastError(`Invalid account for ${selectedPlatform.name}. Please verify the ID.`);
        } else {
          toastError(errorMessage);
        }
      } finally {
        setIsVerifying(false);
      }
    }
  };

  const handleFundAccount = async () => {
    if (!isFormComplete) return;

    setIsFunding(true);

    try {
      const providerCode = selectedPlatform.platformCode || selectedPlatform.code || selectedPlatform.name;
      const bettingData = {
        customerId: customerId,
        provider: providerCode,
        amount: displayAmount,
      };

      console.log('[GamesPage] Funding account:', bettingData);
      const response = await fundBettingAccount(bettingData);

      if (response.success) {
        toastSuccess(`✓ Funding successful! Reference: ${response.reference || 'N/A'}`);
        setTimeout(() => {
          router.push('/transactions');
        }, 2000);
      } else {
        toastError(response.message || 'Funding failed. Please try again.');
      }
    } catch (err: any) {
      console.error('[GamesPage] Funding error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fund account';
      
      if (errorMessage.includes('invalid') || errorMessage.includes('not found')) {
        toastError('Invalid account details. Please verify and try again.');
      } else {
        toastError(errorMessage);
      }
    } finally {
      setIsFunding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-paybancx-bg to-white pb-20 md:pb-8">
      {/* Header */}
      <header className="bg-white border-b border-paybancx-border">
        <div className="max-w-6xl mx-auto px-3 xs:px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            title="Go back"
            className="p-2 hover:bg-paybancx-primary/5 rounded-lg transition hover:scale-[1.02]"
          >
            <MdArrowBack className="w-6 h-6" style={{ color: '#204541' }} />
          </button>
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-paybancx-text-dark">Games & Betting</h1>
            <p className="text-paybancx-text-muted text-sm md:text-base mt-1">Fund your betting account</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-3 xs:px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-4">
        {/* Select Betting Platform */}
        <section className="mb-5 relative">
          <label className="block font-semibold text-paybancx-text-dark mb-3 text-sm md:text-base">
            Select Betting Platform
          </label>
          <button
            onClick={() => setShowPlatformSheet(!showPlatformSheet)}
            disabled={isLoadingProviders}
            className={`w-full flex items-center justify-between px-4 py-4 border border-paybancx-border rounded-lg bg-white hover:border-paybancx-action transition text-paybancx-text-dark disabled:opacity-50 ${
              showPlatformSheet ? 'border-paybancx-action' : ''
            }`}
          >
            <span className={selectedPlatform ? 'text-paybancx-text-dark' : 'text-paybancx-text-muted'}>
              {selectedPlatformData?.name || 'Select Platform'}
            </span>
            <MdExpandMore className={`transition ${
              showPlatformSheet ? 'rotate-180' : ''
            }`} style={{ color: '#204541' }} />
          </button>

          {/* Dropdown Menu */}
          {showPlatformSheet && (
            <>
              {/* Overlay */}
              <div
                className="fixed inset-0 z-20"
                onClick={() => setShowPlatformSheet(false)}
              />
              
              {/* Dropdown List */}
              <div className="absolute z-30 w-full mt-2 bg-white border border-paybancx-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {platforms.map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => {
                      setSelectedPlatform(platform);
                      setShowPlatformSheet(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 transition border-b border-paybancx-border last:border-b-0 hover:bg-paybancx-bg text-left ${
                      selectedPlatform?.id === platform.id ? 'bg-paybancx-bg' : ''
                    }`}
                  >
                    <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <Image
                        src={getPlatformImage(platform.id)}
                        alt={platform.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-contain"
                        priority
                      />
                    </div>
                    <div>
                      <p className={`font-semibold text-sm ${
                        selectedPlatform?.id === platform.id ? 'text-paybancx-text-dark' : 'text-paybancx-text-dark'
                      }`} style={selectedPlatform?.id === platform.id ? { color: '#204541' } : {}}>
                        {platform.name}
                      </p>
                      <p className="text-paybancx-text-muted text-xs mt-0.5">{platform.idType || 'Betting Platform'}</p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </section>

        {/* Customer ID */}
        <section className="mb-5">
          <label className="block font-semibold text-paybancx-text-dark mb-2 text-sm md:text-base">
            {selectedPlatformData?.idType || 'Customer ID'}
          </label>
          <div className="relative">
            <div className="flex items-center border border-paybancx-border rounded-2xl px-4 py-3 bg-white hover:border-paybancx-action focus-within:border-paybancx-action transition">
              <input
                type="text"
                value={customerId}
                onChange={(e) => handleCustomerIDChange(e.target.value)}
                placeholder={`Enter ${selectedPlatformData?.idType?.toLowerCase() || 'customer id'}`}
                className="flex-1 bg-transparent text-paybancx-text-dark placeholder-paybancx-text-muted focus:outline-none text-base"
                maxLength={50}
              />
              {verifiedCustomer && !isVerifying && (
                <MdVerified size={20} className="text-paybancx-action flex-shrink-0 ml-2" />
              )}
            </div>
            {verifiedCustomer && (
              <div className="mt-2 p-3 bg-white border border-paybancx-border rounded-lg">
                <p className="text-xs text-paybancx-text-muted">Verified Account</p>
                <p className="text-sm font-medium text-paybancx-action">{verifiedCustomer}</p>
              </div>
            )}
          </div>
        </section>

        {/* Amount Selection */}
        <section className="mb-5">
          <label className="block font-semibold text-paybancx-text-dark mb-2 text-sm md:text-base">
            Amount (₦)
          </label>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {AMOUNT_CHIPS.map((amount) => (
              <button
                key={amount}
                onClick={() => {
                  setSelectedAmount(amount);
                  setCustomAmount('');
                }}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition ${
                  selectedAmount === amount
                    ? 'bg-paybancx-action text-white'
                    : 'bg-white text-paybancx-text-dark border border-paybancx-border hover:border-paybancx-action'
                }`}
              >
                ₦{amount / 1000}k
              </button>
            ))}
          </div>
          <div className="flex items-center border border-[rgba(45,93,89,0.2)] rounded-2xl px-4 py-3 bg-[#FFFFFF] hover:border-[#2D5D59] focus-within:border-[#2D5D59] transition">
            <span className="text-[#2D5D59] text-xl font-semibold">₦</span>
            <input
              type="number"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setSelectedAmount(null);
              }}
              placeholder="Or enter custom amount"
              className="flex-1 ml-3 bg-transparent text-white placeholder-[#888888] focus:outline-none text-base"
              min="100"
            />
          </div>
          {displayAmount && displayAmount < 100 && (
            <p className="text-red-500 text-xs mt-2">Minimum amount is ₦100</p>
          )}
        </section>

        {/* Summary */}
        {selectedPlatform && displayAmount && (
          <section className="mb-5 p-4 bg-[#FFFFFF] border border-[rgba(45,93,89,0.2)] rounded-2xl">
            <h3 className="text-sm font-semibold text-[#888888] mb-3">Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#888888]">Platform:</span>
                <span className="text-white font-medium">{selectedPlatformData?.name}</span>
              </div>
              {customerId && (
                <div className="flex justify-between">
                  <span className="text-[#888888]">ID:</span>
                  <span className="text-white font-medium">••••{customerId.slice(-4)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-[rgba(45,93,89,0.1)] pt-2 mt-2">
                <span className="text-[#888888]">Amount:</span>
                <span className="text-[#2D5D59] font-bold">₦{displayAmount?.toLocaleString()}</span>
              </div>
            </div>
          </section>
        )}

        {/* Fund Button */}
        <div style={{ backgroundColor: 'transparent', paddingTop: '1.5rem', paddingBottom: '2rem' }}>
          <button
            onClick={handleFundAccount}
            disabled={!isFormComplete || isFunding}
            type="button"
            className="w-full py-4 rounded-full font-bold text-base transition flex items-center justify-center gap-2 shadow-md text-white"
            style={{
              backgroundColor: isFormComplete && !isFunding ? '#204541' : '#D0D0D0',
              cursor: isFormComplete && !isFunding ? 'pointer' : 'not-allowed',
              opacity: isFormComplete && !isFunding ? 1 : 0.6,
            }}
            onMouseEnter={(e) => {
              if (isFormComplete && !isFunding) {
                e.currentTarget.style.backgroundColor = '#163631';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(32, 69, 65, 0.3)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }
            }}
            onMouseLeave={(e) => {
              if (isFormComplete && !isFunding) {
                e.currentTarget.style.backgroundColor = '#204541';
                e.currentTarget.style.boxShadow = 'md';
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          >
          {isFunding ? (
            <>
              <div className="w-5 h-5 border-2 border-[#F5F6F8] border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <MdCheckCircle size={20} />
              Fund Account
            </>
          )}
          </button>
        </div>
      </main>
    </div>
  );
}

