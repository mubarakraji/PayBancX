/* eslint-disable @next/next/no-style-component-with-dynamic-styles */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MdArrowBack, MdCheckCircle, MdVerified, MdExpandMore } from 'react-icons/md';
import { getElectricityDISCOs, buyElectricity, verifyElectricityMeter } from '@/services/paymentService';
import { useAuth } from '@/hooks/useAuth';
import { toastError, toastSuccess } from '@/hooks/useToast';

// All 11 Nigerian Distribution Companies (DISCOs) with image paths
const NIGERIAN_DISCOS = [
  { id: 'aedc', code: 'AEDC', name: 'Abuja Electric', region: 'Abuja, Niger, Nasarawa, Kogi', image: '/e1.png', discoCode: 'abuja-electric' },
  { id: 'bedc', code: 'BEDC', name: 'Benin Electric', region: 'Edo, Delta', image: '/e2.png', discoCode: 'benin-electric' },
  { id: 'ekedc', code: 'EKEDC', name: 'Eko Electric', region: 'Lagos Mainland', image: '/e3.png', discoCode: 'eko-electric' },
  { id: 'eedc', code: 'EEDC', name: 'Enugu Electric', region: 'Enugu, Ebonyi, Abia', image: '/e4.png', discoCode: 'enugu-electric' },
  { id: 'ibedc', code: 'IBEDC', name: 'Ibadan Electric', region: 'Oyo, Osun, Ekiti, Kwara', image: '/e5.png', discoCode: 'ibadan-electric' },
  { id: 'ikedc', code: 'IKEDC', name: 'Ikeja Electric', region: 'Lagos Island, Ikeja', image: '/e6.png', discoCode: 'ikeja-electric' },
  { id: 'jedc', code: 'JEDC', name: 'Jos Electric', region: 'Plateau, Bauchi', image: '/e7.png', discoCode: 'jos-electric' },
  { id: 'kadc', code: 'KADC', name: 'Kaduna Electric', region: 'Kaduna, Katsina', image: '/e8.png', discoCode: 'kaduna-electric' },
  { id: 'kedc', code: 'KEDC', name: 'Kano Electric', region: 'Kano, Jigawa', image: '/e9.png', discoCode: 'kano-electric' },
  { id: 'phed', code: 'PHED', name: 'Port Harcourt Electric', region: 'Rivers, Bayelsa', image: '/e10.png', discoCode: 'portharcourt-electric' },
  { id: 'yedc', code: 'YEDC', name: 'Yola Electric', region: 'Adamawa, Taraba', image: '/e11.png', discoCode: 'yola-electric' },
];

// Fallback plans with common amounts
const FALLBACK_AMOUNTS = [
  { id: '1', amount: 1000, label: '₦1,000' },
  { id: '2', amount: 2500, label: '₦2,500' },
  { id: '3', amount: 5000, label: '₦5,000' },
  { id: '4', amount: 10000, label: '₦10,000' },
];

export default function ElectricityPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  
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
      console.log('[ElectricityPage] ℹ Using fallback DISCOs');
      console.warn('[ElectricityPage] Using fallback DISCOs');
      setDiscos(NIGERIAN_DISCOS);
    } finally {
      setIsLoadingDiscos(false);
    }
  };

  const finalAmount = customAmount ? parseInt(customAmount) : selectedAmount;
  const isComplete = selectedDisco && meterNumber && finalAmount && verifiedCustomer;

  const handleMeterNumberChange = async (value: string) => {
    setMeterNumber(value);
    setVerifiedCustomer(null);
    
    if (value.trim().length >= 10 && selectedDisco) {
      setIsVerifying(true);
      try {
        const discoValue = selectedDisco.discoCode || selectedDisco.code || selectedDisco.name;
        console.log('[ElectricityPage] 📋 Calling verification with:');
        console.log('[ElectricityPage] - DISCO:', discoValue, `(from selectedDisco.discoCode)`);
        console.log('[ElectricityPage] - Meter Number:', value);
        console.log('[ElectricityPage] - Meter Type:', meterType);
        console.log('[ElectricityPage] - Full selectedDisco object:', selectedDisco);

        const response = await verifyElectricityMeter(discoValue, value, meterType);
        
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
        
        // Show detailed error to user
        console.error('[ElectricityPage] Full error:', err);
        
        // Provide helpful error messages
        if (errorMessage.includes('not correct') || errorMessage.includes('not valid')) {
          toastError(`Invalid meter number for ${selectedDisco.name}. Please check and try again.`);
        } else if (errorMessage.includes('not found')) {
          toastError('Meter number not found. Please verify it matches your ${selectedDisco.name} account.');
        } else {
          toastError(errorMessage);
        }
      } finally {
        setIsVerifying(false);
      }
    }
  };

  const handleBuyElectricity = async () => {
    if (!isComplete) return;
    
    setIsBuying(true);

    try {
      console.log('[ElectricityPage] Processing electricity purchase');
      console.log('[ElectricityPage] DISCO:', selectedDisco.name);
      console.log('[ElectricityPage] Meter Type:', meterType);
      console.log('[ElectricityPage] Meter Number:', meterNumber);
      console.log('[ElectricityPage] Amount:', finalAmount);

      const response = await buyElectricity({
        disco: selectedDisco.discoCode || selectedDisco.code || selectedDisco.name,
        meterType,
        meterNumber,
        amount: finalAmount,
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
    <div className="min-h-screen bg-gradient-to-b from-paybancx-bg to-white pb-16 md:pb-6">
      {/* Header */}
      <header className="bg-white border-b border-paybancx-border">
        <div className="max-w-5xl mx-auto px-3 xs:px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 md:py-3 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            title="Go back"
            className="p-1 hover:bg-paybancx-primary/5 rounded-lg transition hover:scale-[1.02]"
          >
            <MdArrowBack className="w-5 h-5" style={{ color: '#204541' }} />
          </button>
          <div>
            <h1 className="text-lg md:text-2xl font-bold text-paybancx-text-dark">Buy Electricity</h1>
            <p className="text-paybancx-text-muted text-xs md:text-sm mt-0.5">Pay your electricity bills</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-3 xs:px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 md:py-3">
        {/* Select DISCO */}
        <section className="mb-3">
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

