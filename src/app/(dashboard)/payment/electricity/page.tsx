'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MdArrowBack, MdCheckCircle, MdVerified, MdExpandMore } from 'react-icons/md';
import { getElectricityDISCOs, buyElectricity, verifyElectricityMeter } from '@/services/paymentService';
import { useAuth } from '@/hooks/useAuth';
import { toastError, toastSuccess } from '@/hooks/useToast';

// All 11 Nigerian Distribution Companies (DISCOs) with image paths
const DISCO_SERVICE_ID_MAP: Record<string, string> = {
  aedc: 'AEDC',
  abujaelectric: 'AEDC',
  'abuja-electric': 'AEDC',
  bedc: 'BEDC',
  beninelectric: 'BEDC',
  'benin-electric': 'BEDC',
  ekedc: 'EKEDC',
  ekoelectric: 'EKEDC',
  'eko-electric': 'EKEDC',
  eedc: 'EEDC',
  enuguelectric: 'EEDC',
  'enugu-electric': 'EEDC',
  ibedc: 'IBEDC',
  ibadanelectric: 'IBEDC',
  'ibadan-electric': 'IBEDC',
  ikedc: 'IKEDC',
  ikejaelectric: 'IKEDC',
  'ikeja-electric': 'IKEDC',
  jedc: 'JEDC',
  joselectric: 'JEDC',
  'jos-electric': 'JEDC',
  kadc: 'KADC',
  kadunaelectric: 'KADC',
  'kaduna-electric': 'KADC',
  kedc: 'KEDC',
  kanoelectric: 'KEDC',
  'kano-electric': 'KEDC',
  phed: 'PHED',
  portharcourtelectric: 'PHED',
  'portharcourt-electric': 'PHED',
  yedc: 'YEDC',
  yolaelectric: 'YEDC',
  'yola-electric': 'YEDC',
};

const NIGERIAN_DISCOS = [
  { id: 'aedc', code: 'AEDC', service_id: 'AEDC', name: 'Abuja Electric', region: 'Abuja, Niger, Nasarawa, Kogi', image: '/e1.png', discoCode: 'abuja-electric' },
  { id: 'bedc', code: 'BEDC', service_id: 'BEDC', name: 'Benin Electric', region: 'Edo, Delta', image: '/e2.png', discoCode: 'benin-electric' },
  { id: 'ekedc', code: 'EKEDC', service_id: 'EKEDC', name: 'Eko Electric', region: 'Lagos Mainland', image: '/e3.png', discoCode: 'eko-electric' },
  { id: 'eedc', code: 'EEDC', service_id: 'EEDC', name: 'Enugu Electric', region: 'Enugu, Ebonyi, Abia', image: '/e4.png', discoCode: 'enugu-electric' },
  { id: 'ibedc', code: 'IBEDC', service_id: 'IBEDC', name: 'Ibadan Electric', region: 'Oyo, Osun, Ekiti, Kwara', image: '/e5.png', discoCode: 'ibadan-electric' },
  { id: 'ikedc', code: 'IKEDC', service_id: 'IKEDC', name: 'Ikeja Electric', region: 'Lagos Island, Ikeja', image: '/e6.png', discoCode: 'ikeja-electric' },
  { id: 'jedc', code: 'JEDC', service_id: 'JEDC', name: 'Jos Electric', region: 'Plateau, Bauchi', image: '/e7.png', discoCode: 'jos-electric' },
  { id: 'kadc', code: 'KADC', service_id: 'KADC', name: 'Kaduna Electric', region: 'Kaduna, Katsina', image: '/e8.png', discoCode: 'kaduna-electric' },
  { id: 'kedc', code: 'KEDC', service_id: 'KEDC', name: 'Kano Electric', region: 'Kano, Jigawa', image: '/e9.png', discoCode: 'kano-electric' },
  { id: 'phed', code: 'PHED', service_id: 'PHED', name: 'Port Harcourt Electric', region: 'Rivers, Bayelsa', image: '/e10.png', discoCode: 'portharcourt-electric' },
  { id: 'yedc', code: 'YEDC', service_id: 'YEDC', name: 'Yola Electric', region: 'Adamawa, Taraba', image: '/e11.png', discoCode: 'yola-electric' },
];

// Fallback plans with common amounts
const FALLBACK_AMOUNTS = [
  { id: '1', amount: 1000, label: '₦1,000' },
  { id: '2', amount: 2500, label: '₦2,500' },
  { id: '3', amount: 5000, label: '₦5,000' },
  { id: '4', amount: 10000, label: '₦10,000' },
];

const normalizeElectricityServiceIdValue = (value?: string): string => {
  if (!value) return '';
  const cleanedValue = value.toString().trim();
  if (!cleanedValue) return '';
  const lookupKey = cleanedValue.toLowerCase().replace(/[^a-z]/g, '');
  const fromMap = DISCO_SERVICE_ID_MAP[lookupKey];
  if (fromMap) return fromMap;
  const upper = cleanedValue.toUpperCase();
  return upper.length > 0 ? upper : '';
};

const resolveElectricityServiceId = (disco: any): string => {
  const candidate = disco?.service_id || disco?.serviceId || disco?.code || disco?.discoCode || disco?.id || disco?.name || '';
  return normalizeElectricityServiceIdValue(candidate);
};

export default function ElectricityPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  
  const [selectedDisco, setSelectedDisco] = useState<any | null>(null);
  const [meterType, setMeterType] = useState<'prepaid' | 'postpaid'>('prepaid');
  const [meterNumber, setMeterNumber] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [discos, setDiscos] = useState<any[]>(NIGERIAN_DISCOS);
  const [isLoadingDiscos, setIsLoadingDiscos] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [verifiedCustomer, setVerifiedCustomer] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showDiscoDropdown, setShowDiscoDropdown] = useState(false);
  const lastVerificationKeyRef = useRef<string>('');

  // Fetch DISCOs from API on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchDiscos();
    }
  }, [isAuthenticated]);

  const fetchDiscos = async () => {
    setIsLoadingDiscos(true);
    try {
      const result = await getElectricityDISCOs();
      
      if (result && result.length > 0) {
        console.log('[ElectricityPage] ✓ Loaded', result.length, 'DISCOs from API');
        setDiscos(result);
      } else {
        console.log('[ElectricityPage] ℹ Using local DISCO data');
        setDiscos(NIGERIAN_DISCOS);
      }
    } catch (err) {
      console.debug('[ElectricityPage] Using fallback DISCOs');
      setDiscos(NIGERIAN_DISCOS);
    } finally {
      setIsLoadingDiscos(false);
    }
  };

  const finalAmount = customAmount ? parseInt(customAmount) : selectedAmount;
  const isComplete = selectedDisco && meterNumber && finalAmount && verifiedCustomer;

  const handleMeterNumberChange = async (value: string) => {
    const sanitizedValue = value.replace(/\D/g, '');
    setMeterNumber(sanitizedValue);
    setVerifiedCustomer(null);

    if (!selectedDisco || sanitizedValue.trim().length < 10) {
      lastVerificationKeyRef.current = '';
      return;
    }

    const verificationKey = `${selectedDisco?.id || selectedDisco?.code || selectedDisco?.name || 'disco'}|${sanitizedValue}|${meterType}`;

    if (verificationKey === lastVerificationKeyRef.current || isVerifying) {
      return;
    }

    lastVerificationKeyRef.current = verificationKey;
    setIsVerifying(true);

    try {
      const serviceId = normalizeElectricityServiceIdValue(
        selectedDisco?.service_id || selectedDisco?.serviceId || selectedDisco?.code || selectedDisco?.discoCode || selectedDisco?.id || selectedDisco?.name || ''
      );
      const discoValue = normalizeElectricityServiceIdValue(
        selectedDisco?.discoCode || selectedDisco?.code || selectedDisco?.service_id || selectedDisco?.serviceId || selectedDisco?.id || selectedDisco?.name || ''
      );
      console.log('[ElectricityPage] 📋 Calling verification with:');
      console.log('[ElectricityPage] - SERVICE_ID:', serviceId, `(preferred value for backend validation)`);
      console.log('[ElectricityPage] - DISCO:', discoValue, `(preferred value for backend lookup)`);
      console.log('[ElectricityPage] - Meter Number:', sanitizedValue);
      console.log('[ElectricityPage] - Meter Type:', meterType);
      console.log('[ElectricityPage] - Full selectedDisco object:', selectedDisco);

      const response = await verifyElectricityMeter(discoValue, sanitizedValue, meterType, serviceId);

      console.log('[ElectricityPage] ✅ Verification response:', response);

      if (response.success && response.data?.customerName) {
        setVerifiedCustomer(response.data.customerName);
        toastSuccess(`Verified: ${response.data.customerName}`);
      } else {
        console.error('Verification response:', response);
        toastError('Meter not found. Please verify the meter number, DISCO, and type.');
      }
    } catch (err) {
      console.error('Verification error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify meter number';

      console.error('[ElectricityPage] Full error:', err);

      if (errorMessage.includes('not correct') || errorMessage.includes('not valid')) {
        toastError(`Invalid meter number for ${selectedDisco.name}. Please check and try again.`);
      } else if (errorMessage.includes('not found')) {
        toastError(`Meter number not found. Please verify it matches your ${selectedDisco?.name || 'selected DISCO'} account.`);
      } else {
        toastError(errorMessage);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleBuyElectricity = async () => {
    if (!isComplete) return;

    const normalizedPhoneNumber = (user?.phone || '').replace(/\D/g, '');
    if (!normalizedPhoneNumber) {
      toastError('Please add your phone number in your profile before buying electricity.');
      return;
    }
    
    setIsBuying(true);

    try {
      console.log('[ElectricityPage] Processing electricity purchase');
      console.log('[ElectricityPage] DISCO:', selectedDisco.name);
      console.log('[ElectricityPage] Meter Type:', meterType);
      console.log('[ElectricityPage] Meter Number:', meterNumber);
      console.log('[ElectricityPage] Amount:', finalAmount);
      console.log('[ElectricityPage] Phone Number:', normalizedPhoneNumber);

      const response = await buyElectricity({
        disco: resolveElectricityServiceId(selectedDisco),
        service_id: selectedDisco?.service_id || selectedDisco?.serviceId || resolveElectricityServiceId(selectedDisco),
        meterType,
        meterNumber,
        amount: finalAmount,
        phoneNumber: normalizedPhoneNumber,
      });

      console.log('[ElectricityPage] ✅ Purchase successful:', response);
      toastSuccess('Electricity purchased successfully! ✓');
      
      // Reset form
      setTimeout(() => {
        router.push('/home');
      }, 2000);
    } catch (err) {
      console.error('[ElectricityPage] ❌ Purchase error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to purchase electricity';
      
      // Provide context-specific error messages
      if (errorMessage.includes('BVN') || errorMessage.includes('verification')) {
        toastError('Please verify your BVN in Settings → Security before purchasing electricity.');
      } else if (errorMessage.includes('not correct') || errorMessage.includes('not valid')) {
        toastError('Invalid meter details. Please verify your DISCO and meter number.');
      } else {
        toastError(errorMessage);
      }
    } finally {
      setIsBuying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8] pb-16 text-[#122927] md:pb-6">
      <header className="border-b border-[#E5E7EB] bg-white">
        <div className="mx-0 flex max-w-7xl items-center gap-3 px-3 py-3 xs:px-4 sm:px-5 sm:py-4 md:px-6">
          <button
            onClick={() => router.back()}
            title="Go back"
            aria-label="Go back"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#1C3F3B] transition-all duration-200 hover:border-[#1C3F3B]/30 hover:bg-[#F8FAFA]"
          >
            <MdArrowBack size={20} />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-[#122927] sm:text-xl">Buy Electricity</h1>
            <p className="text-sm text-[#64748B]">Pay your electricity bills</p>
          </div>
        </div>
      </header>

      <main className="mx-0 max-w-7xl px-3 py-4 xs:px-4 sm:px-5 sm:py-5 md:px-6">
        {/* Select DISCO */}
        <section className="relative mb-3">
          <label className="block font-semibold text-paybancx-text-dark mb-2 text-sm">
            Select DISCO (Distribution Company)
          </label>
          
          {/* Dropdown Button */}
          <button
            onClick={() => setShowDiscoDropdown(!showDiscoDropdown)}
            disabled={isBuying || isLoadingDiscos}
            className={`w-full px-4 py-3 bg-white border rounded-lg flex items-center justify-between transition-all duration-200 hover:shadow-md disabled:opacity-50 ${
              showDiscoDropdown ? 'shadow-md' : ''
            }`}
            style={{
              borderColor: showDiscoDropdown ? '#204541' : '#E2E8F0',
            }}
          >
            <div className="text-left flex items-center gap-3 flex-1">
              {selectedDisco && (
                <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
                  <img
                    src={selectedDisco.image}
                    alt={selectedDisco.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
              <div>
                <p className={selectedDisco ? 'text-paybancx-text-dark font-semibold' : 'text-paybancx-text-muted'}>
                  {selectedDisco ? selectedDisco.name : 'Select DISCO'}
                </p>
                {selectedDisco && (
                  <p className="text-paybancx-text-muted text-xs mt-0.5">{selectedDisco.region}</p>
                )}
              </div>
            </div>
            <MdExpandMore 
              className="w-6 h-6 flex-shrink-0 transition"
              style={{
                color: '#204541',
                transform: showDiscoDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            />
          </button>

          {/* Dropdown Menu */}
          {showDiscoDropdown && (
            <>
              {/* Overlay */}
              <div
                className="fixed inset-0 z-20"
                onClick={() => setShowDiscoDropdown(false)}
              />
              
              {/* Dropdown List */}
              <div className="absolute z-30 w-full mt-2 bg-white border border-paybancx-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {discos.map((disco, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedDisco(disco);
                      setShowDiscoDropdown(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 transition border-b border-paybancx-border last:border-b-0 hover:bg-paybancx-bg text-left ${
                      selectedDisco?.id === disco.id ? 'bg-paybancx-bg' : ''
                    }`}
                  >
                    <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
                      <img
                        src={disco.image}
                        alt={disco.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div>
                      <p className={`font-semibold text-sm ${
                        selectedDisco?.id === disco.id ? 'text-paybancx-action' : 'text-paybancx-text-dark'
                      }`}>
                        {disco.name}
                      </p>
                      <p className="text-paybancx-text-muted text-xs mt-0.5">{disco.region}</p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </section>

        {/* Meter Type */}
        <section className="mb-3">
          <label className="block font-semibold text-paybancx-text-dark mb-2 text-sm">
            Meter Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'prepaid', label: 'Prepaid', icon: '💳' },
              { id: 'postpaid', label: 'Postpaid', icon: '🧾' },
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setMeterType(type.id as 'prepaid' | 'postpaid')}
                disabled={isBuying}
                className={`flex flex-col items-center gap-2 px-4 py-5 rounded-xl border-2 transition ${
                  meterType === type.id
                    ? 'border-[#2D5D59] bg-[rgba(45,93,89,0.15)]'
                    : 'border-[rgba(45,93,89,0.1)] bg-[#FFFFFF] hover:border-[rgba(45,93,89,0.2)]'
                } disabled:opacity-50`}
              >
                <span className="text-2xl">{type.icon}</span>
                <span
                  className={`text-sm font-semibold ${
                    meterType === type.id ? 'text-[#2D5D59]' : 'text-paybancx-text-dark'
                  }`}
                >
                  {type.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Meter Number */}
        <section className="mb-5">
          <label className="block font-semibold text-paybancx-text-dark mb-2 text-sm md:text-base">
            Meter Number
          </label>
          <div className="relative">
            <div className="flex items-center border border-[rgba(45,93,89,0.2)] rounded-2xl px-4 py-3 bg-[#FFFFFF] hover:border-[#2D5D59] focus-within:border-[#2D5D59] transition">
              <input
                type="text"
                value={meterNumber}
                onChange={(e) => handleMeterNumberChange(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 11-digit meter number"
                className="flex-1 bg-transparent text-paybancx-text-dark placeholder-paybancx-text-muted focus:outline-none text-base"
                maxLength={20}
                disabled={isBuying}
              />
              {isVerifying && (
                <div className="w-4 h-4 border-2 border-[#2D5D59] border-t-transparent rounded-full animate-spin flex-shrink-0 ml-2" />
              )}
              {verifiedCustomer && !isVerifying && (
                <MdVerified size={20} className="text-[#2D5D59] flex-shrink-0 ml-2" />
              )}
            </div>
            {verifiedCustomer && (
              <div className="mt-2 p-3 bg-white border border-paybancx-border rounded-lg">
                <p className="text-xs text-paybancx-text-muted">Verified Customer</p>
                <p className="text-sm font-medium text-[#2D5D59]">{verifiedCustomer}</p>
              </div>
            )}
          </div>
        </section>

        {/* Select Amount */}
        <section className="mb-5">
          <label className="block font-semibold text-paybancx-text-dark mb-2 text-sm md:text-base">
            Select Amount
          </label>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {FALLBACK_AMOUNTS.map((amt) => (
              <button
                key={amt.id}
                onClick={() => {
                  setSelectedAmount(amt.amount);
                  setCustomAmount('');
                }}
                disabled={isBuying}
                className={`py-4 rounded-xl border-2 font-semibold transition flex items-center justify-center ${
                  selectedAmount === amt.amount && !customAmount
                    ? 'border-[#2D5D59] bg-[rgba(45,93,89,0.15)] text-[#2D5D59]'
                    : 'border-[rgba(45,93,89,0.1)] bg-[#FFFFFF] text-paybancx-text-dark hover:border-[#2D5D59]'
                } disabled:opacity-50`}
              >
                {amt.label}
              </button>
            ))}
          </div>

          {/* Custom Amount */}
          <div className="flex items-center border border-[rgba(45,93,89,0.2)] rounded-2xl px-4 py-3 bg-[#FFFFFF] hover:border-[#2D5D59] focus-within:border-[#2D5D59] transition">
            <span className="text-[#2D5D59] font-semibold">₦</span>
            <input
              type="text"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value.replace(/\D/g, ''));
                setSelectedAmount(null);
              }}
              placeholder="Or enter custom amount"
              className="flex-1 ml-3 bg-transparent text-paybancx-text-dark placeholder-paybancx-text-muted focus:outline-none text-base"
              disabled={isBuying}
            />
          </div>
        </section>

        {/* Summary */}
        {isComplete && (
          <div className="bg-[#FFFFFF] border border-[rgba(45,93,89,0.1)] rounded-2xl p-4 mb-5">
            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-[#888888] text-xs font-semibold uppercase tracking-wider">DISCO</span>
                <span className="text-paybancx-text-dark font-medium text-sm">{selectedDisco.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#888888] text-xs font-semibold uppercase tracking-wider">Meter Number</span>
                <span className="text-paybancx-text-dark font-medium text-sm">{meterNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#888888] text-xs font-semibold uppercase tracking-wider">Meter Type</span>
                <span className="text-paybancx-text-dark font-medium text-sm capitalize">{meterType}</span>
              </div>
              <div className="h-px bg-[rgba(45,93,89,0.1)] my-2"></div>
              <div className="flex justify-between items-center">
                <span className="text-[#888888] text-xs font-semibold uppercase tracking-wider">Total Amount</span>
                <span className="text-[#2D5D59] font-bold text-lg">₦{finalAmount?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Buy Button */}
        <div style={{ backgroundColor: 'transparent', paddingTop: '1.5rem', paddingBottom: '2rem' }}>
          <button
            onClick={handleBuyElectricity}
            disabled={!isComplete || isBuying}
            type="button"
            className="w-full py-4 rounded-full font-bold text-base transition flex items-center justify-center gap-2 shadow-md text-white"
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
              <MdCheckCircle className="w-5 h-5" />
              Buy Electricity
            </>
          )}
          </button>
        </div>
      </main>
    </div>
  );
}

