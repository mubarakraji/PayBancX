'use client';

import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { MdArrowDropDown } from 'react-icons/md';
import { toastError, toastSuccess } from '@/hooks/useToast';
import { getAuthHeaders } from '@/config/apiConfig';

interface TransferToBankModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TransferToBankModal({ isOpen, onClose }: TransferToBankModalProps) {
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

  if (!isOpen) return null;

  const handleVerifyAccount = async () => {
    if (!accountNumber || accountNumber.length !== 10 || !bank) {
      toastError('Please enter valid account number and select a bank');
      return;
    }

    setIsVerifyingAccount(true);
    try {
      const headers = getAuthHeaders();
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

      if (!response.ok) {
        toastError(data.message || 'Account verification failed');
        setAccountHolder('');
        return;
      }

      setAccountHolder(data.account_name || data.name || 'Account verified');
      toastSuccess('Account verified successfully!');
    } catch (err) {
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

      if (!response.ok) {
        const errorMsg = data.message || data.error || 'Transfer failed';
        toastError(errorMsg);
        setIsLoading(false);
        return;
      }

      toastSuccess(`Transfer successful!${data.reference ? ` Ref: ${data.reference}` : ''}`);
      setAmount('');
      setBank('');
      setAccountNumber('');
      setPin('');
      setDescription('');
      setAccountHolder('');
      onClose();
    } catch (err) {
      toastError('Error processing transfer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
                Transfer to Bank
              </h2>
              <p className="text-[#5a9894] text-sm md:text-base">
                Send money to any bank account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Amount */}
              <div className="space-y-2">
                <label className="block text-[#1C3F3B] text-sm font-semibold">Amount (₦)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#1C3F3B] font-bold text-lg">₦</span>
                  <input
                    type="text"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-[#d0e8e4] rounded-lg focus:outline-none focus:border-[#1C3F3B] focus:ring-2 focus:ring-[#1C3F3B]/10 text-[#1C3F3B] bg-white transition-all duration-300 font-medium"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Bank */}
              <div className="space-y-2">
                <label className="block text-[#1C3F3B] text-sm font-semibold">Select Bank</label>
                <div className="relative">
                  <select
                    title="Select a bank"
                    value={bank}
                    onChange={(e) => {
                      setBank(e.target.value);
                      if (accountHolder) setAccountHolder('');
                    }}
                    className="w-full px-3.5 py-3 bg-white border-2 border-[#d0e8e4] rounded-lg text-[#1C3F3B] focus:outline-none focus:border-[#1C3F3B] focus:ring-2 focus:ring-[#1C3F3B]/10 transition-all duration-300 appearance-none cursor-pointer disabled:opacity-50 font-medium"
                    disabled={isLoading || isVerifyingAccount}
                  >
                    <option value="" disabled>Select Bank</option>
                    {banks.map((bankName) => (
                      <option key={bankName} value={bankName}>{bankName}</option>
                    ))}
                  </select>
                  <MdArrowDropDown
                    size={16}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#1C3F3B]/50 pointer-events-none"
                  />
                </div>
              </div>

              {/* Account Number */}
              <div className="space-y-2">
                <label className="block text-[#1C3F3B] text-sm font-semibold">Account Number</label>
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
                  className="w-full px-4 py-3 border-2 border-[#d0e8e4] rounded-lg focus:outline-none focus:border-[#1C3F3B] focus:ring-2 focus:ring-[#1C3F3B]/10 text-[#1C3F3B] bg-white transition-all duration-300 font-medium disabled:opacity-50"
                  disabled={isLoading || isVerifyingAccount}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="block text-[#1C3F3B] text-sm font-semibold">Description (Optional)</label>
                <textarea
                  placeholder="Add a note for this transfer"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[#d0e8e4] rounded-lg focus:outline-none focus:border-[#1C3F3B] focus:ring-2 focus:ring-[#1C3F3B]/10 text-[#1C3F3B] bg-white transition-all duration-300 resize-none h-20 disabled:opacity-50 font-medium"
                  disabled={isLoading}
                />
              </div>

              {/* PIN */}
              <div className="space-y-2">
                <label className="block text-[#1C3F3B] text-sm font-semibold">Transaction PIN</label>
                <input
                  type="password"
                  placeholder="Enter 4-digit PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  maxLength={4}
                  className="w-full px-4 py-3 border-2 border-[#d0e8e4] rounded-lg focus:outline-none focus:border-[#1C3F3B] focus:ring-2 focus:ring-[#1C3F3B]/10 text-[#1C3F3B] bg-white transition-all duration-300 disabled:opacity-50 font-medium"
                  disabled={isLoading}
                />
              </div>

              {!accountHolder && accountNumber.length === 10 && bank && (
                <button
                  type="button"
                  onClick={handleVerifyAccount}
                  disabled={isVerifyingAccount || isLoading}
                  className="w-full py-3 bg-[#4db3a8] text-white rounded-lg font-semibold hover:bg-[#3d9890] transition-all duration-300 hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isVerifyingAccount ? 'Verifying...' : 'Verify Account'}
                </button>
              )}

              {accountHolder && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700 font-medium">✓ Account verified: {accountHolder}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !amount || !bank || !accountNumber || !pin}
                className="w-full py-3 bg-gradient-to-r from-[#1C3F3B] to-[#2d5d59] text-white rounded-lg font-bold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.01] active:scale-95 shadow-md"
              >
                {isLoading ? 'Processing...' : 'Confirm Transfer'}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="md:hidden w-full py-3 bg-[#f5f5f5] text-[#1C3F3B] border border-[#e0e0e0] rounded-lg font-semibold hover:bg-[#f0f0f0] transition-all duration-300 hover:scale-[1.01] active:scale-95"
              >
                Close (or click outside)
              </button>
            </form>
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
