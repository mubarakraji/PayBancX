'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { MdArrowBack, MdArrowDropDown } from 'react-icons/md';
import { toastError, toastSuccess } from '@/hooks/useToast';
import { getAuthHeaders } from '@/config/apiConfig';

export default function TransferToBankPage() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [bank, setBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [description, setDescription] = useState('');
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingAccount, setIsVerifyingAccount] = useState(false);

  const banks = [
    'Access Bank',
    'GTBank',
    'First Bank',
    'Zenith Bank',
    'UBA',
    'Polaris Bank',
    'Opay',
  ];

  const handleVerifyAccount = async () => {
    if (!accountNumber || accountNumber.length !== 10 || !bank) {
      toastError('Please enter valid account number and select a bank');
      return;
    }

    setIsVerifyingAccount(true);
    try {
      const headers = getAuthHeaders();
      console.log('[TransferBank] Verifying account:', { bank, account: accountNumber.substring(0, 4) + '***' });

      const response = await fetch('/api/v1/services/bank/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify({
          account_number: accountNumber,
          bank_code: bank,
        }),
      });

      const data = await response.json();
      console.log('[TransferBank] Verification response:', data);

      if (!response.ok) {
        toastError(data.message || 'Account verification failed');
        setAccountHolder('');
        return;
      }

      setAccountHolder(data.account_name || data.name || 'Account verified');
      toastSuccess('Account verified successfully!');
    } catch (err) {
      console.error('[TransferBank] Verification error:', err);
      toastError('Error verifying account. Please try again.');
    } finally {
      setIsVerifyingAccount(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !bank || !accountNumber || !pin) {
      toastError('Please fill in all required fields');
      return;
    }

    if (accountNumber.length !== 10) {
      toastError('Account number must be 10 digits');
      return;
    }

    if (pin.length !== 4) {
      toastError('PIN must be 4 digits');
      return;
    }

    setIsLoading(true);

    try {
      const headers = getAuthHeaders();
      console.log('[TransferBank] Initiating transfer:', {
        amount,
        bank,
        account: accountNumber.substring(0, 4) + '***',
        hasDescription: !!description,
      });

      const response = await fetch('/api/v1/wallet/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          recipient: accountNumber,
          narration: description || 'Bank transfer',
          pin: pin,
          bank: bank,
        }),
      });

      const data = await response.json();
      console.log('[TransferBank] Transfer response status:', response.status);
      console.log('[TransferBank] Transfer response:', data);

      if (!response.ok) {
        const errorMsg = data.message || data.error || 'Transfer failed';
        toastError(errorMsg);
        setIsLoading(false);
        return;
      }

      toastSuccess(`Transfer successful!${data.reference ? ` Ref: ${data.reference}` : ''}`);
      console.log('[TransferBank] Transfer completed successfully');
      
      setTimeout(() => {
        router.back();
      }, 2000);
    } catch (err) {
      console.error('[TransferBank] Error:', err);
      toastError('Error processing transfer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8] pb-20 text-[#122927] md:pb-8">
      <div className="sticky top-0 z-10 border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-3 py-3 xs:px-4 sm:px-5 sm:py-4 md:px-6 lg:px-8">
          <button
            onClick={() => router.back()}
            title="Go back"
            aria-label="Go back"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#1C3F3B] transition-all duration-200 hover:border-[#1C3F3B]/30 hover:bg-[#F8FAFA]"
          >
            <MdArrowBack size={20} />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-[#122927] sm:text-xl">Transfer to Bank</h1>
            <p className="text-sm text-[#64748B]">Send money to a bank account</p>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-2xl px-3 py-4 xs:px-4 sm:px-5 md:px-6 lg:px-8 md:py-5">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-3xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-6">
          {/* Amount Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-paybancx-text-dark">
              Amount (₦)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-paybancx-primary font-bold text-lg">
                ₦
              </span>
              <input
                type="text"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-10 pr-4 py-4 bg-white border border-paybancx-border rounded-card text-paybancx-primary font-bold placeholder-paybancx-text-muted focus:outline-none focus:border-paybancx-action transition-all duration-300 hover:scale-[1.01]"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Bank Selector */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-paybancx-text-dark">
              Select Bank
            </label>
            <div className="relative">
              <select
                value={bank}
                onChange={(e) => {
                  setBank(e.target.value);
                  if (accountHolder) setAccountHolder('');
                }}
                title="Select a bank"
                aria-label="Select bank for transfer"
                className="w-full px-3.5 py-3 bg-white border border-[#1C3F3B]/20 rounded-lg text-[#333333] placeholder-[#888888] focus:outline-none focus:border-[#1C3F3B] transition-all duration-300 appearance-none cursor-pointer disabled:opacity-50"
                disabled={isLoading || isVerifyingAccount}
              >
                <option value="" disabled>
                  Select Bank
                </option>
                {banks.map((bankName) => (
                  <option key={bankName} value={bankName}>
                    {bankName}
                  </option>
                ))}
              </select>
              <MdArrowDropDown
                size={16}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-paybancx-text-muted pointer-events-none"
              />
            </div>
          </div>

          {/* Account Number Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-paybancx-text-dark">
              Account Number
            </label>
          <input
            type="text"
            placeholder="Enter 10-digit account number"
            value={accountNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 10);
              setAccountNumber(value);
              if (accountHolder) setAccountHolder('');
            }}
            maxLength={10}
            className="w-full px-4 py-4 bg-white border border-paybancx-border rounded-card text-paybancx-text-dark placeholder-paybancx-text-muted focus:outline-none focus:border-paybancx-action transition-all duration-300 disabled:opacity-50"
            disabled={isLoading || isVerifyingAccount}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-paybancx-text-dark">
            Description (Optional)
          </label>
          <textarea
            placeholder="Add a note for this transfer"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-4 bg-white border border-paybancx-border rounded-card text-paybancx-text-dark placeholder-paybancx-text-muted focus:outline-none focus:border-paybancx-action transition-all duration-300 resize-none h-24 disabled:opacity-50"
            disabled={isLoading}
          />
        </div>

        {/* Transaction PIN */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-paybancx-text-dark">
            Transaction PIN
          </label>
          <p className="text-xs text-paybancx-text-muted mb-2">4-digit PIN for transaction verification</p>
          <input
            type="password"
            placeholder="Enter 4-digit PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
            maxLength={4}
            className="w-full px-4 py-4 bg-white border border-paybancx-border rounded-card text-paybancx-text-dark placeholder-paybancx-text-muted focus:outline-none focus:border-paybancx-action transition-all duration-300 disabled:opacity-50"
            disabled={isLoading}
          />
        </div>

        {/* Verify Account Button */}
        {!accountHolder && accountNumber.length === 10 && bank && (
          <button
            type="button"
            onClick={handleVerifyAccount}
            disabled={isVerifyingAccount}
            className="w-full py-4 bg-[#2D5D59] text-white rounded-card font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#1F4440] transition-all duration-300 hover:scale-[1.02] shadow-md disabled:bg-[#D0D0D0] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
          >
            {isVerifyingAccount ? 'Verifying Account...' : 'Verify Account'}
          </button>
        )}

        {/* Account Verified Indicator */}
        {accountHolder && (
          <div className="p-4 bg-green-900/20 border border-green-500/50 rounded-lg">
            <p className="text-sm text-green-400">✓ Account verified: {accountHolder}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !amount || !bank || !accountNumber || !pin}
          className="w-full mt-8 py-4 bg-[#2D5D59] text-white rounded-card font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#1F4440] transition-all duration-300 hover:scale-[1.02] shadow-md disabled:bg-[#D0D0D0] disabled:text-white disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <span className="transform -rotate-[30deg]">→</span>
          {isLoading ? 'Processing Transfer...' : 'Confirm Transfer'}
        </button>
            </div>
        </form>
      </main>
    </div>
  );
}

