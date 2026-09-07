'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { MdArrowBack, MdExpandMore, MdCheckCircle, MdVerified } from 'react-icons/md';
import { getTVProviders, buyTVSubscription, verifyTVSmartcard } from '@/services/paymentService';
import { useAuth } from '@/hooks/useAuth';
import { toastError, toastSuccess } from '@/hooks/useToast';

// Fallback TV providers
const FALLBACK_PROVIDERS = [
  { id: 'dstv', name: 'DStv', code: 'DSTV', bgColor: '#1e3a8a', providerCode: 'dstv' },
  { id: 'gotv', name: 'GOtv', code: 'GOTV', bgColor: '#166534', providerCode: 'gotv' },
  { id: 'startimes', name: 'StarTimes', code: 'STARTIMES', bgColor: '#cd7f32', providerCode: 'startimes' },
];

interface Provider {
  id: string;
  name: string;
  code?: string;
  bgColor?: string;
  providerCode?: string;
}

const TVSubscription = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [smartCardNumber, setSmartCardNumber] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [showProviderSheet, setShowProviderSheet] = useState(false);
  const [providers, setProviders] = useState<Provider[]>(FALLBACK_PROVIDERS);
  const [isLoadingProviders, setIsLoadingProviders] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
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
      const result = await getTVProviders();
      
      if (result && result.length > 0) {
        console.log('[TVPage] ✓ Loaded', result.length, 'TV providers from API');
        setProviders(result as any);
      } else {
        console.log('[TVPage] ℹ Using local provider data');
        setProviders(FALLBACK_PROVIDERS);
      }
    } catch (err) {
      console.log('[TVPage] ℹ Using fallback TV providers');
      setProviders(FALLBACK_PROVIDERS);
    } finally {
      setIsLoadingProviders(false);
    }
  };

  const getProviderBgColor = (providerName: string): string => {
    const provider = providers.find(p => p.name === providerName);
    return provider?.bgColor || '#1e3a8a';
  };

  const getProviderImage = (providerName: string): string => {
    switch (providerName) {
      case 'DStv':
        return '/t1.png';
      case 'GOtv':
        return '/t2.png';
      case 'StarTimes':
        return '/t3.png';
      default:
        return '/t1.png';
    }
  };

  const handleSelectProvider = (provider: Provider) => {
    setSelectedProvider(provider);
    setShowProviderSheet(false);
  };

  const handleSmartCardChange = async (value: string) => {
    setSmartCardNumber(value);
    setVerifiedCustomer(null);

    if (value.trim().length >= 10 && selectedProvider) {
      setIsVerifying(true);
      try {
        const providerCode = selectedProvider.providerCode || selectedProvider.code || selectedProvider.name;
        console.log('[TVPage] 📋 Calling verification with:');
        console.log('[TVPage] - Smartcard Number:', value);
        console.log('[TVPage] - Provider:', providerCode);
        console.log('[TVPage] - Full selectedProvider object:', selectedProvider);
        
        const response = await verifyTVSmartcard({
          smartcardNumber: value,
          provider: providerCode,
        });
        
        console.log('[TVPage] ✅ Verification response:', response);
        
        if (response.success && response.data?.customerName) {
          setVerifiedCustomer(response.data.customerName);
          toastSuccess(`Verified: ${response.data.customerName}`);
        } else {
          console.error('Verification response:', response);
          toastError('Smart card not found. Please check the smart card number and try again.');
        }
      } catch (err) {
        console.error('Verification error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to verify smart card number';
        toastError(errorMessage);
      } finally {
        setIsVerifying(false);
      }
    }
  };

  const displayAmount = selectedAmount || (customAmount ? parseInt(customAmount) : null);
  const isFormComplete = selectedProvider && smartCardNumber && displayAmount && verifiedCustomer;

  const handleSubscribe = async () => {
    if (!isFormComplete) return;

    setIsBuying(true);

    try {
      const providerCode = selectedProvider?.providerCode || selectedProvider?.code || selectedProvider?.name;
      const tvData = {
        smartcardNumber: smartCardNumber,
        provider: providerCode,
        variationCode: `${providerCode.toLowerCase()}_${displayAmount}`,
        amount: displayAmount,
      };

      console.log('[TVPage] Subscribing:', tvData);
      const response = await buyTVSubscription(tvData);

      if (response.success) {
        toastSuccess(`✓ Subscription successful! Reference: ${response.reference || 'N/A'}`);
        setTimeout(() => {
          router.push('/transactions');
        }, 2000);
      } else {
        toastError(response.message || 'Subscription failed. Please try again.');
      }
    } catch (err: any) {
      console.error('[TVPage] Subscription error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete subscription';
      
      if (errorMessage.includes('invalid') || errorMessage.includes('not found')) {
        toastError('Invalid subscription details. Please verify and try again.');
      } else {
        toastError(errorMessage);
      }
    } finally {
      setIsBuying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8] pb-32 text-[#122927] md:pb-20">
      <header className="border-b border-[#E5E7EB] bg-white">
        <div className="mx-0 flex max-w-7xl items-center gap-3 px-3 py-3 xs:px-4 sm:px-6 sm:py-4 md:px-8">
          <button
            onClick={() => router.back()}
            title="Go back"
            aria-label="Go back"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#1C3F3B] transition-all duration-200 hover:border-[#1C3F3B]/30 hover:bg-[#F8FAFA]"
          >
            <MdArrowBack size={20} />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-[#122927] sm:text-xl">TV Subscription</h1>
            <p className="text-sm text-[#64748B]">Renew your TV subscription</p>
          </div>
        </div>
      </header>

      <main className="mx-0 max-w-7xl space-y-3 px-3 py-4 xs:px-4 sm:px-6 sm:py-5 md:px-8 md:space-y-4">
        {/* Select Provider */}
        <div className="form-group relative">
          <label className="block text-sm font-medium mb-2 text-paybancx-text-muted">Select Provider</label>
          <button
            onClick={() => setShowProviderSheet(!showProviderSheet)}
            disabled={isLoadingProviders}
            type="button"
            className={`w-full px-4 py-3 bg-white border rounded-lg flex items-center justify-between transition-all duration-200 hover:shadow-md disabled:opacity-50 ${
              showProviderSheet ? 'shadow-md' : ''
            }`}
            style={{
              borderColor: showProviderSheet ? '#204541' : '#E2E8F0',
            }}
          >
            <span className={selectedProvider ? 'text-paybancx-text-dark' : 'text-paybancx-text-muted'}>
              {selectedProvider?.name || 'Select Provider'}
            </span>
            <MdExpandMore className="transition" style={{
              color: '#204541',
              transform: showProviderSheet ? 'rotate(180deg)' : 'rotate(0deg)',
            }} />
          </button>

          {/* Dropdown Menu */}
          {showProviderSheet && (
            <>
              {/* Overlay */}
              <div
                className="fixed inset-0 z-20"
                onClick={() => setShowProviderSheet(false)}
              />
              
              {/* Dropdown List */}
              <div className="absolute z-30 w-full mt-2 bg-white border border-paybancx-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {providers.map((provider, idx) => (
                  <button
                    key={provider.id}
                    onClick={() => handleSelectProvider(provider)}
                    className={`w-full flex items-center gap-3 px-4 py-3 transition border-b border-paybancx-border last:border-b-0 hover:bg-paybancx-bg text-left ${
                      selectedProvider?.id === provider.id ? 'bg-paybancx-bg' : ''
                    }`}
                  >
                    <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <Image
                        src={getProviderImage(provider.name)}
                        alt={provider.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-contain"
                        priority
                      />
                    </div>
                    <div>
                      <p className={`font-semibold text-sm ${
                        selectedProvider?.id === provider.id ? 'text-paybancx-action' : 'text-paybancx-text-dark'
                      }`}>
                        {provider.name}
                      </p>
                      <p className="text-paybancx-text-muted text-xs mt-0.5">{provider.code || 'TV Provider'}</p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Smart Card Number */}
        <div className="form-group">
          <label className="block text-sm font-medium mb-2 text-paybancx-text-muted">Smart Card Number</label>
          <div className="relative">
            <div className="bg-white border border-paybancx-border rounded-lg px-4 py-3 focus-within:border-paybancx-action transition flex items-center justify-between">
              <input
                type="text"
                placeholder="Enter smart card number"
                value={smartCardNumber}
                onChange={(e) => handleSmartCardChange(e.target.value)}
                className="w-full bg-transparent outline-none text-paybancx-text-dark placeholder-paybancx-text-muted"
              />
              {isVerifying && (
                <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin flex-shrink-0 ml-2" style={{ borderColor: '#204541 transparent #204541 #204541' }} />
              )}
              {verifiedCustomer && !isVerifying && (
                <MdVerified size={20} className="flex-shrink-0 ml-2" style={{ color: '#204541' }} />
              )}
            </div>
            {verifiedCustomer && (
              <div className="mt-2 p-3 bg-paybancx-bg border border-paybancx-border rounded-lg">
                <p className="text-xs text-paybancx-text-muted">Verified Customer</p>
                <p className="text-sm font-medium" style={{ color: '#204541' }}>{verifiedCustomer}</p>
              </div>
            )}
          </div>
        </div>

        {/* Amount Selection */}
        <div className="form-group">
          <label className="block text-sm font-medium mb-2 text-paybancx-text-muted">Select Amount (₦)</label>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[1000, 2000, 5000, 10000].map((amount) => (
              <button
                key={amount}
                onClick={() => {
                  setSelectedAmount(amount);
                  setCustomAmount('');
                }}
                type="button"
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedAmount === amount
                    ? 'text-white shadow-md hover:shadow-lg active:scale-95'
                    : 'bg-white text-paybancx-text-dark border border-paybancx-border hover:shadow-sm active:scale-95'
                }`}
                style={selectedAmount === amount ? { backgroundColor: '#204541' } : {}}
                onMouseEnter={(e) => {
                  if (selectedAmount === amount) {
                    e.currentTarget.style.backgroundColor = '#163631';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedAmount === amount) {
                    e.currentTarget.style.backgroundColor = '#204541';
                  }
                }}
              >
                ₦{amount / 1000}k
              </button>
            ))}
          </div>
          <div className="bg-white border border-paybancx-border rounded-lg px-4 py-3 focus-within:border-paybancx-action transition">
            <input
              type="number"
              placeholder="Or enter custom amount"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setSelectedAmount(null);
              }}
              className="w-full bg-transparent outline-none text-paybancx-text-dark placeholder-paybancx-text-muted [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>

        {/* Summary Card */}
        {selectedProvider && displayAmount && (
          <div className="bg-white border border-paybancx-border rounded-lg p-4 mt-6">
            <h3 className="text-sm font-medium text-paybancx-text-muted mb-3">Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-paybancx-text-muted">Provider:</span>
                <span className="text-paybancx-text-dark font-medium">{selectedProvider?.name}</span>
              </div>
              {smartCardNumber && (
                <div className="flex justify-between">
                  <span className="text-paybancx-text-muted">Card:</span>
                  <span className="text-paybancx-text-dark font-medium">••••{smartCardNumber.slice(-4)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-paybancx-border pt-2 mt-2">
                <span className="text-paybancx-text-muted">Amount:</span>
                <span className="font-bold" style={{ color: '#204541' }}>₦{displayAmount?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Subscribe Button Container */}
        <div className="pt-6 pb-4 -mx-3 xs:-mx-4 sm:-mx-6 md:-mx-8 px-3 xs:px-4 sm:px-6 md:px-8 bg-gradient-to-b from-transparent to-white relative z-10">
          <button
            onClick={handleSubscribe}
            type="button"
            className="w-full py-4 px-4 rounded-lg font-bold text-base md:text-lg text-white flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer"
            style={{
              backgroundColor: '#204541',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#163631';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(32, 69, 65, 0.3)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#204541';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'scale(0.95)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
          >
            {isBuying ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <MdCheckCircle size={20} />
                <span>Subscribe Now</span>
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
};

export default TVSubscription;

