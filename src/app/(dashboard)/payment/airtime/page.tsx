/* eslint-disable @next/next/no-style-component-with-dynamic-styles */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { MdArrowBack, MdPhoneInTalk } from 'react-icons/md';
import { buyAirtime, getAirtimeProviders } from '@/services/paymentService';
import { useAuth } from '@/hooks/useAuth';
import { toastError, toastSuccess } from '@/hooks/useToast';

const amountChips = [100, 200, 500, 1000, 2000];

// Fallback networks if API fails
const FALLBACK_NETWORKS = [
  { id: 'mtn', name: 'MTN', code: 'MTN', bgColor: '#FFB81C', textColor: '#000' },
  { id: 'airtel', name: 'Airtel', code: 'AIRTEL', bgColor: '#FF0000', textColor: '#fff' },
  { id: 'glo', name: 'Glo', code: 'GLO', bgColor: '#22DD22', textColor: '#000' },
  { id: '9mobile', name: '9Mobile', code: '9MOBILE', bgColor: '#0066CC', textColor: '#fff' },
];

interface Provider {
  id: string;
  name: string;
  code?: string;
  bgColor?: string;
  textColor?: string;
}

export default function AirtimePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  
  const [selectedNetwork, setSelectedNetwork] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBuying, setIsBuying] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProviders();
    }
  }, [isAuthenticated]);

  const fetchProviders = async () => {
    setIsLoading(true);
    try {
      const result = await getAirtimeProviders();
      // Ensure we have at least some providers
      if (result && result.length > 0) {
        console.log('[AirtimePage] Loaded providers from API:', result);
        setProviders(result);
        setSelectedNetwork(result[0].id);
      } else {
        console.log('[AirtimePage] No providers from API, using fallback');
        setProviders(FALLBACK_NETWORKS);
        setSelectedNetwork(FALLBACK_NETWORKS[0].id);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load providers';
      console.error('[AirtimePage] Provider fetch error:', err);
      console.log('[AirtimePage] Using fallback networks due to error');
      // Use fallback networks if API fails
      setProviders(FALLBACK_NETWORKS);
      setSelectedNetwork(FALLBACK_NETWORKS[0].id);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedNetworkData = providers.find((n) => n.id === selectedNetwork);
  const total = amount ? parseFloat(amount) : 0;
  const isComplete = selectedNetwork && phoneNumber && amount;

  const handleAmountChip = (value: number) => {
    setAmount(value.toString());
  };

  const handleContinue = async () => {
    if (!isComplete) return;

    setIsBuying(true);
    try {
      const fullPhoneNumber = `+234${phoneNumber.slice(-10)}`;
      const network = selectedNetworkData?.code || selectedNetwork;
      
      const airtimePayload = {
        phoneNumber: fullPhoneNumber,
        amount: parseFloat(amount),
        network,
      };
      
      console.log('[AirtimePage] Sending airtime request:', airtimePayload);
      
      await buyAirtime(airtimePayload);

      toastSuccess('Airtime purchased successfully!');
      setTimeout(() => {
        router.push('/home');
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to purchase airtime';
      console.error('[AirtimePage] Purchase error:', err);
      toastError(errorMessage);
    } finally {
      setIsBuying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-paybancx-bg pb-16 md:pb-6">
        {/* Header */}
        <header className="bg-white border-b border-paybancx-border">
          <div className="max-w-5xl mx-auto px-3 xs:px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 md:py-3 flex items-center gap-3">
            <button
              onClick={() => router.back()}
              title="Go back"
              className="p-1 hover:bg-paybancx-primary/5 rounded-card transition hover:scale-[1.02]"
            >
              <MdArrowBack className="w-5 h-5" style={{ color: '#204541' }} />
            </button>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-paybancx-text-dark">
              Buy Airtime
            </h1>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-3 xs:px-4 sm:px-5 md:px-6 py-4 w-full">
          <div className="flex items-center justify-center py-10">
            <div className="text-center">
              <div className="inline-block animate-spin mb-4">
                <div className="w-10 h-10 border-4 border-paybancx-border border-t-paybancx-action rounded-full"></div>
              </div>
              <p className="text-paybancx-text-muted text-sm">Loading airtime providers...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-paybancx-bg to-white">
      {/* Header */}
      <header className="bg-white border-b border-paybancx-border">
        <div className="max-w-5xl mx-auto px-3 xs:px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 md:py-3 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            title="Go back"
            className="p-1 hover:bg-paybancx-primary/5 rounded-lg transition hover:scale-[1.02]"
          >
            <MdArrowBack className="w-5 h-5 text-paybancx-action" />
          </button>
          <div>
            <h1 className="text-lg md:text-2xl font-bold text-paybancx-text-dark">Buy Airtime</h1>
            <p className="text-paybancx-text-muted text-xs md:text-sm mt-0.5">Purchase airtime for all networks</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-3 xs:px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 md:py-3">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-3">
            {/* Select Network */}
            <section className="mb-3 bg-white rounded-2xl p-3 md:p-3.5 border border-paybancx-border shadow-soft">
              <label className="block font-bold text-paybancx-text-dark mb-2 text-base">
                Select Mobile Network
              </label>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {providers.map((network, idx) => {
                  const isActive = selectedNetwork === network.id;
                  const imageNumber = idx + 1;
                  
                  return (
                    <button
                      key={network.id}
                      onClick={() => setSelectedNetwork(network.id)}
                      className={`min-w-[80px] h-[80px] rounded-card flex flex-col items-center justify-center gap-2 transition border-2 relative flex-shrink-0 bg-white ${
                        isActive
                          ? 'border-paybancx-action ring-2 ring-paybancx-action ring-opacity-30 shadow-lg'
                          : 'border-paybancx-border hover:border-paybancx-action'
                      }`}
                      title={network.name}
                      disabled={isBuying}
                    >
                      <Image
                        src={`/m${imageNumber}.png`}
                        alt={network.name}
                        width={64}
                        height={64}
                        className="w-16 h-16 object-contain"
                      />
                    </button>
                  );
                })}
              </div>
            </section>

        {/* Phone Number */}
        <section className="mb-3 bg-white rounded-2xl p-3 md:p-3.5 border border-paybancx-border shadow-soft">
          <label className="block font-bold text-paybancx-text-dark mb-2 text-base">
            Phone Number
          </label>
          <div className="flex items-center border border-paybancx-border rounded-card px-3 py-2.5 bg-white hover:border-paybancx-action focus-within:border-paybancx-action transition">
            <div className="flex items-center gap-2 text-paybancx-text-dark min-w-fit">
              <span className="text-sm">🇳🇬</span>
              <span className="font-semibold text-sm">+234</span>
            </div>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
              placeholder="810 000 0000"
              className="flex-1 ml-2 bg-transparent text-paybancx-text-dark placeholder-paybancx-text-muted focus:outline-none text-sm"
              maxLength={10}
              disabled={isBuying}
            />
          </div>
        </section>

        {/* Amount */}
        <section className="mb-3 bg-white rounded-2xl p-3 md:p-3.5 border border-paybancx-border shadow-soft">
          <label className="block font-bold text-paybancx-text-dark mb-2 text-base">
            Amount
          </label>
          <div className="flex items-center border border-paybancx-border rounded-card px-3 py-2.5 bg-white hover:border-paybancx-action focus-within:border-paybancx-action transition">
              <span className="text-base font-semibold text-[#204541]">₦</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="flex-1 ml-2 bg-transparent text-paybancx-text-dark placeholder-paybancx-text-muted focus:outline-none text-sm"
              disabled={isBuying}
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {amountChips.map((chip) => (
              <button
                key={chip}
                onClick={() => handleAmountChip(chip)}
                disabled={isBuying}
                className={`px-3 py-1.5 rounded-card font-semibold text-xs transition ${
                  amount === chip.toString()
                    ? 'text-white border-0'
                    : 'bg-white text-paybancx-text-dark border border-paybancx-border hover:border-paybancx-action disabled:opacity-50'
                }`}
                style={{
                  backgroundColor: amount === chip.toString() ? '#204541' : 'transparent',
                }}
              >
                ₦{chip}
              </button>
            ))}
          </div>
        </section>

        {/* Continue Button */}
        <div className="py-4">
          <button
            onClick={handleContinue}
            disabled={!isComplete || isBuying}
            type="button"
            className={`w-full py-3 rounded-card font-bold text-sm transition flex items-center justify-center gap-2 shadow-md text-white ${
              isComplete && !isBuying
                ? 'bg-[#204541] cursor-pointer opacity-100 hover:bg-[#163631] hover:shadow-lg hover:scale-105 active:scale-95'
                : 'bg-[#D0D0D0] cursor-not-allowed opacity-60'
            }`}
          >
          {isBuying ? (
            <>
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <MdPhoneInTalk className="w-4 h-4" />
              Continue
            </>
          )}
          </button>
        </div>
        </div>

        {/* Right Column - Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-3 md:p-4 border border-paybancx-border shadow-soft sticky top-[80px]">
            <h3 className="font-bold text-paybancx-text-dark mb-3 text-base">Order Summary</h3>
            
            <div className="space-y-2.5 pb-4 border-b border-paybancx-border">
              <div className="flex justify-between text-paybancx-text-muted text-xs">
                <span>Network:</span>
                <span className="font-semibold text-paybancx-text-dark">{selectedNetworkData?.name || '-'}</span>
              </div>
              <div className="flex justify-between text-paybancx-text-muted text-xs">
                <span>Phone:</span>
                <span className="font-semibold text-paybancx-text-dark">{phoneNumber ? `+234${phoneNumber}` : '-'}</span>
              </div>
              <div className="flex justify-between text-paybancx-text-muted text-xs">
                <span>Amount:</span>
                <span className="font-bold text-paybancx-action text-base">₦{total.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-800">Your airtime will be credited immediately after payment confirmation.</p>
            </div>
          </div>
        </div>
        </div>
      </main>
    </div>
  );
}

