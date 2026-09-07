'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { MdArrowBack, MdExpandMore, MdDataUsage, MdCheckCircle } from 'react-icons/md';
import { getDataVariations, buyData } from '@/services/paymentService';
import { useAuth } from '@/hooks/useAuth';
import { toastError, toastSuccess } from '@/hooks/useToast';

const networks = [
  { id: 'mtn', name: 'MTN', bgColor: '#FFB81C', textColor: '#000' },
  { id: 'airtel', name: 'Airtel', bgColor: '#FF0000', textColor: '#fff' },
  { id: 'glo', name: 'Glo', bgColor: '#22DD22', textColor: '#000' },
  { id: '9mobile', name: '9mobile', bgColor: '#0066CC', textColor: '#fff' },
];

// Restructured fallback data plans with duration categories
const FALLBACK_PLANS: Record<string, Record<string, any[]>> = {
  'mtn': {
    '1 Day': [
      { id: '1', name: '500MB', calls: '1.5 mins', price: 99, variationId: 'mtn_500mb_1d', validity: '1 Day' },
      { id: '2', name: '1GB', calls: '3 mins', price: 199, variationId: 'mtn_1gb_1d', validity: '1 Day' },
    ],
    '7 Day': [
      { id: '3', name: '2GB', calls: '10 mins', price: 499, variationId: 'mtn_2gb_7d', validity: '7 Day' },
      { id: '4', name: '5GB', calls: '20 mins', price: 999, variationId: 'mtn_5gb_7d', validity: '7 Day' },
    ],
    '30 Day': [
      { id: '5', name: '20GB', calls: '60 mins', price: 2499, variationId: 'mtn_20gb_30d', validity: '30 Day' },
      { id: '6', name: '50GB', calls: 'Unlimited', price: 4999, variationId: 'mtn_50gb_30d', validity: '30 Day' },
    ],
  },
  'airtel': {
    '1 Day': [
      { id: '1', name: '500MB', calls: '1.5 mins', price: 99, variationId: 'airtel_500mb_1d', validity: '1 Day' },
      { id: '2', name: '1GB', calls: '3 mins', price: 179, variationId: 'airtel_1gb_1d', validity: '1 Day' },
    ],
    '7 Day': [
      { id: '3', name: '2GB', calls: '10 mins', price: 449, variationId: 'airtel_2gb_7d', validity: '7 Day' },
      { id: '4', name: '5GB', calls: '20 mins', price: 899, variationId: 'airtel_5gb_7d', validity: '7 Day' },
    ],
    '30 Day': [
      { id: '5', name: '20GB', calls: '60 mins', price: 2299, variationId: 'airtel_20gb_30d', validity: '30 Day' },
      { id: '6', name: '50GB', calls: 'Unlimited', price: 4799, variationId: 'airtel_50gb_30d', validity: '30 Day' },
    ],
  },
  'glo': {
    '1 Day': [
      { id: '1', name: '500MB', calls: '1.5 mins', price: 89, variationId: 'glo_500mb_1d', validity: '1 Day' },
      { id: '2', name: '1GB', calls: '3 mins', price: 169, variationId: 'glo_1gb_1d', validity: '1 Day' },
    ],
    '7 Day': [
      { id: '3', name: '2GB', calls: '10 mins', price: 429, variationId: 'glo_2gb_7d', validity: '7 Day' },
      { id: '4', name: '5GB', calls: '20 mins', price: 859, variationId: 'glo_5gb_7d', validity: '7 Day' },
    ],
    '30 Day': [
      { id: '5', name: '20GB', calls: '60 mins', price: 2099, variationId: 'glo_20gb_30d', validity: '30 Day' },
      { id: '6', name: '50GB', calls: 'Unlimited', price: 4199, variationId: 'glo_50gb_30d', validity: '30 Day' },
    ],
  },
  '9mobile': {
    '1 Day': [
      { id: '1', name: '500MB', calls: '1.5 mins', price: 79, variationId: '9m_500mb_1d', validity: '1 Day' },
      { id: '2', name: '1GB', calls: '3 mins', price: 159, variationId: '9m_1gb_1d', validity: '1 Day' },
    ],
    '7 Day': [
      { id: '3', name: '2GB', calls: '10 mins', price: 399, variationId: '9m_2gb_7d', validity: '7 Day' },
      { id: '4', name: '5GB', calls: '20 mins', price: 799, variationId: '9m_5gb_7d', validity: '7 Day' },
    ],
    '30 Day': [
      { id: '5', name: '20GB', calls: '60 mins', price: 1999, variationId: '9m_20gb_30d', validity: '30 Day' },
      { id: '6', name: '50GB', calls: 'Unlimited', price: 3999, variationId: '9m_50gb_30d', validity: '30 Day' },
    ],
  },
};

interface DataPlan {
  id: string;
  name: string;
  price: number;
  calls?: string;
  validity?: string;
  variationId?: string;
  code?: string;
  amount?: number;
}

const DURATION_TABS = ['1 Day', '7 Day', '30 Day'];

export default function DataPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  
  const [selectedNetwork, setSelectedNetwork] = useState<string>('mtn');
  const [selectedDuration, setSelectedDuration] = useState<string>('1 Day');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedPlanIdx, setSelectedPlanIdx] = useState(0);
  const [plans, setPlans] = useState<DataPlan[]>(FALLBACK_PLANS['mtn']['1 Day'] || []); // Initialize with fallback
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);
  const [isBuying, setIsBuying] = useState(false);

  // Fetch plans when network changes
  useEffect(() => {
    // Show fallback plans for selected duration
    const durationPlans = (FALLBACK_PLANS[selectedNetwork] as Record<string, any[]>)?.[selectedDuration];
    if (durationPlans) {
      setPlans(durationPlans);
    }
    setSelectedPlanIdx(0);
    
    if (isAuthenticated) {
      fetchPlans(selectedNetwork);
    }
  }, [selectedNetwork, selectedDuration, isAuthenticated]);

  const fetchPlans = async (network: string) => {
    setIsLoadingPlans(true);
    try {
      console.log('[DataPage] Fetching plans for network:', network);
      const result = await getDataVariations(network);
      
      console.log('[DataPage] getDataVariations returned:', result);
      
      if (result && result.length > 0) {
        // Get duration-based plans from fallback
        const durationPlans = (FALLBACK_PLANS[network] as Record<string, any[]>)?.[selectedDuration];
        if (durationPlans && durationPlans.length > 0) {
          console.log('[DataPage] ✅ Loaded', durationPlans.length, 'plans for duration:', selectedDuration);
          setPlans(durationPlans);
        } else {
          // Fallback if duration plans don't exist
          const allNetworkPlans = Object.values(FALLBACK_PLANS[network] as Record<string, any[]>).flat();
          console.log('[DataPage] Using all network plans:', allNetworkPlans.length);
          setPlans(allNetworkPlans);
        }
        setSelectedPlanIdx(0);
      } else {
        // Use fallback plans
        const durationPlans = (FALLBACK_PLANS[network] as Record<string, any[]>)?.[selectedDuration];
        console.warn('[DataPage] ⚠️ API returned empty, using fallback plans');
        setPlans(durationPlans || []);
        setSelectedPlanIdx(0);
      }
    } catch (err) {
      console.error('[DataPage] ❌ Error fetching plans:', err);
      // Use fallback on error
      const durationPlans = (FALLBACK_PLANS[network] as Record<string, any[]>)?.[selectedDuration];
      console.warn('[DataPage] ⚠️ Using fallback plans due to error');
      setPlans(durationPlans || []);
      setSelectedPlanIdx(0);
    } finally {
      setIsLoadingPlans(false);
    }
  };

  const selectedPlan = plans[selectedPlanIdx];
  const isComplete = selectedNetwork && phoneNumber && selectedPlan;

  const handleContinue = async () => {
    if (!isComplete) return;

    setIsBuying(true);
    try {
      const fullPhoneNumber = `+234${phoneNumber.slice(-10)}`;
      
      const dataPayload = {
        phoneNumber: fullPhoneNumber,
        variationId: selectedPlan.variationId || selectedPlan.id,
        amount: selectedPlan.price,
        network: selectedNetwork,
      };
      
      console.log('[DataPage] Sending data purchase:', dataPayload);
      
      await buyData(dataPayload);

      toastSuccess('Data purchased successfully!');
      setTimeout(() => {
        router.push('/home');
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to purchase data';
      console.error('[DataPage] Purchase error:', err);
      toastError(errorMessage);
    } finally {
      setIsBuying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8] pb-16 text-[#122927] md:pb-6">
      <header className="border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-3 py-3 xs:px-4 sm:px-5 sm:py-4 md:px-6">
          <button
            onClick={() => router.back()}
            title="Go back"
            aria-label="Go back"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#1C3F3B] transition-all duration-200 hover:border-[#1C3F3B]/30 hover:bg-[#F8FAFA]"
          >
            <MdArrowBack size={20} />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-[#122927] sm:text-xl">Buy Data</h1>
            <p className="text-sm text-[#64748B]">Purchase data plans for all networks</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-3 py-4 xs:px-4 sm:px-5 sm:py-5 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-3">
            {/* Select Network */}
            <section className="mb-3 rounded-3xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-5">
              <label className="block font-bold text-paybancx-text-dark mb-2 text-base">
                Select Network
              </label>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {networks.map((network, idx) => {
                  const isActive = selectedNetwork === network.id;
                  const logoSrc = `/s${idx + 1}.png`;

                  return (
                    <button
                      key={network.id}
                      onClick={() => setSelectedNetwork(network.id)}
                      aria-pressed={isActive}
                      className={`flex h-[88px] w-[88px] shrink-0 items-center justify-center rounded-2xl border p-2 transition-all duration-200 ${
                        isActive
                          ? 'border-[#1E5F5B] bg-[#F0F7F6] shadow-[0_0_0_2px_rgba(30,95,91,0.12)]'
                          : 'border-transparent bg-white hover:border-[#B9CFCB] hover:bg-[#F7FAF9] hover:shadow-sm'
                      }`}
                      title={network.name}
                      disabled={isBuying}
                    >
                      <Image
                        src={logoSrc}
                        alt={network.name}
                        width={72}
                        height={72}
                        className="h-[52px] w-[52px] object-contain sm:h-[58px] sm:w-[58px]"
                        priority={isActive}
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
          <div className="flex items-center border border-[rgba(45,93,89,0.2)] rounded-2xl px-3 py-2.5 bg-[#FFFFFF] hover:border-[#2D5D59] focus-within:border-[#2D5D59] transition">
            <div className="flex items-center gap-2 text-[#2D5D59] min-w-fit">
              <span className="text-sm">🇳🇬</span>
              <span className="font-semibold text-sm">+234</span>
            </div>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
              placeholder="810 000 0000"
              className="flex-1 ml-2 bg-transparent text-paybancx-text-dark placeholder-[#888888] focus:outline-none text-sm"
              maxLength={10}
              disabled={isBuying}
            />
          </div>
        </section>

        {/* Select Data Plan */}
        <section className="mb-6">
          <label className="block font-semibold text-paybancx-text-dark mb-3 text-sm md:text-base">
            Select Data Plan
          </label>

          {/* Duration Tabs */}
          <div className="flex gap-2 mb-4 bg-[#0d1111] p-1 rounded-2xl border border-[rgba(45,93,89,0.1)]">
            {DURATION_TABS.map((duration) => (
              <button
                key={duration}
                onClick={() => {
                  setSelectedDuration(duration);
                  setSelectedPlanIdx(0);
                }}
                disabled={isBuying}
                className={`flex-1 px-3 py-2 rounded-xl font-medium text-xs transition disabled:opacity-50 ${
                  selectedDuration === duration
                    ? 'text-[#F5F6F8] shadow-lg'
                    : 'text-[#888888] hover:text-white'
                }`}
                style={{
                  backgroundColor: selectedDuration === duration ? '#204541' : 'rgba(32, 69, 65, 0.1)',
                }}
              >
                {duration}
              </button>
            ))}
          </div>

          {/* Plan Cards */}
          {isLoadingPlans ? (
            <div className="text-center py-6">
              <div className="inline-block animate-spin mb-3">
                <div className="w-8 h-8 border-3 border-[#2D5D59]/20 border-t-[#2D5D59] rounded-full"></div>
              </div>
              <p className="text-[#a0a0a0] text-xs">Loading plans...</p>
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center text-[#a0a0a0] py-6">
              <p className="text-xs">No plans available</p>
            </div>
          ) : (
            <div className="space-y-2 mb-4">
              {plans.map((plan, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPlanIdx(idx)}
                  disabled={isBuying}
                  className={`w-full px-3 py-3 rounded-2xl border-2 transition text-left relative ${
                    selectedPlanIdx === idx
                      ? 'border-[#2D5D59] bg-[rgba(45,93,89,0.08)]'
                      : 'border-[rgba(45,93,89,0.2)] bg-[#FFFFFF] hover:border-[#2D5D59]/50'
                  } disabled:opacity-50`}
                >
                  <div className="flex justify-between items-center">
                    {/* Left side - Data & Calls */}
                    <div>
                      <div className="text-paybancx-text-dark font-bold text-sm">{plan.name}</div>
                      <div className="text-[#888888] text-xs mt-0.5">+ {plan.calls || 'No calls'}</div>
                    </div>

                    {/* Right side - Price */}
                    <div className="text-right">
                      <div className={`font-bold text-base ${selectedPlanIdx === idx ? 'text-[#2D5D59]' : 'text-paybancx-text-dark'}`}>
                        ₦{plan.price?.toLocaleString()}
                      </div>
                      <div className="text-[#888888] text-xs mt-0.5">{plan.validity}</div>
                    </div>
                  </div>


                </button>
              ))}
            </div>
          )}

          {/* Summary Card */}
          {selectedPlan && (
            <div className="bg-[#FFFFFF] border border-[rgba(45,93,89,0.1)] rounded-2xl p-3 mb-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[#888888] text-xs font-semibold uppercase tracking-wider">Selected</span>
                  <span className="text-paybancx-text-dark font-medium text-xs">{selectedPlan?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#888888] text-xs font-semibold uppercase tracking-wider">Calls/Mins</span>
                  <span className="text-paybancx-text-dark font-medium text-xs">{selectedPlan?.calls}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#888888] text-xs font-semibold uppercase tracking-wider">Duration</span>
                  <span className="text-paybancx-text-dark font-medium text-xs">{selectedPlan?.validity}</span>
                </div>
                <div className="h-px bg-[rgba(45,93,89,0.1)] my-1.5"></div>
                <div className="flex justify-between items-center">
                  <span className="text-[#888888] text-xs font-semibold uppercase tracking-wider">Total Amount</span>
                  <span className="text-[#2D5D59] font-bold text-base">₦{selectedPlan?.price?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </section>

            {/* Continue Button */}
            <div style={{ backgroundColor: 'transparent', paddingTop: '1rem', paddingBottom: '1rem' }}>
              <button
                onClick={handleContinue}
                disabled={!isComplete || isBuying}
                type="button"
                className="w-full py-3 rounded-card font-bold text-sm transition flex items-center justify-center gap-2 shadow-md text-white"
                style={{
                  backgroundColor: isComplete && !isBuying ? '#204541' : '#D0D0D0',
                  cursor: isComplete && !isBuying ? 'pointer' : 'not-allowed',
                  opacity: isComplete && !isBuying ? 1 : 0.6,
                }}
                onMouseEnter={(e) => {
                  if (isComplete && !isBuying) {
                    e.currentTarget.style.backgroundColor = '#163631';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(32, 69, 65, 0.3)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (isComplete && !isBuying) {
                    e.currentTarget.style.backgroundColor = '#204541';
                    e.currentTarget.style.boxShadow = 'md';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
              >
              {isBuying ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <MdDataUsage className="w-4 h-4" />
                  Continue to Payment
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
                  <span className="font-semibold text-paybancx-text-dark">{networks.find(n => n.id === selectedNetwork)?.name || '-'}</span>
                </div>
                <div className="flex justify-between text-paybancx-text-muted text-xs">
                  <span>Phone:</span>
                  <span className="font-semibold text-paybancx-text-dark">{phoneNumber ? `+234${phoneNumber}` : '-'}</span>
                </div>
                <div className="flex justify-between text-paybancx-text-muted text-xs">
                  <span>Plan:</span>
                  <span className="font-semibold text-paybancx-text-dark">{selectedPlan?.name || '-'}</span>
                </div>
                <div className="flex justify-between text-paybancx-text-muted text-xs">
                  <span>Duration:</span>
                  <span className="font-semibold text-paybancx-text-dark">{selectedPlan?.validity || '-'}</span>
                </div>
                <div className="flex justify-between text-paybancx-text-muted text-xs">
                  <span>Amount:</span>
                  <span className="font-bold text-paybancx-action text-base">₦{selectedPlan?.price?.toLocaleString() || '0'}</span>
                </div>
              </div>

              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-800">Data will be activated immediately after payment confirmation.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

