'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  MdQrCode2,
  MdPhone,
  MdWifi,
  MdElectricalServices,
  MdMoreVert,
  MdAdd,
  MdDescription,
  MdArrowForward,
  MdRemove,
  MdArrowUpward,
  MdArrowDownward,
} from 'react-icons/md';
import BalanceCard from '@/components/dashboard/BalanceCard';
import { TransferModal } from '@/components/common/TransferModal';
import { GetQRModal } from '@/components/common/GetQRModal';
import { DepositModal } from '@/components/common/DepositModal';
import { Header } from '@/components/common/Header';
import { getWalletBalance, getTransactionHistory } from '@/services/walletService';
import { useAuth } from '@/hooks/useAuth';
import { toastError } from '@/hooks/useToast';
import { normalizeAmount } from '@/utils/helpers';

interface Transaction {
  id: string;
  type: string;
  description: string;
  amount: number;
  date: string;
  status?: string;
}

export default function HomePage() {
  const router = useRouter();
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isGetQROpen, setIsGetQROpen] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [balance, setBalance] = useState<number>(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
  const [activePromoIndex, setActivePromoIndex] = useState(0);
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      fetchBalance();
      fetchRecentTransactions();
    }
  }, [isAuthenticated, authLoading]);

  useEffect(() => {
    const promoImages = [
      'https://app.yangaplug.com/storage/banners/1864763958693092.png',
      'https://app.yangaplug.com/storage/banners/1864764005801572.png',
      'https://app.yangaplug.com/storage/banners/1864764034449434.jpeg',
    ];

    const interval = window.setInterval(() => {
      setActivePromoIndex((prev) => (prev + 1) % promoImages.length);
    }, 4000);

    return () => window.clearInterval(interval);
  }, []);

  const fetchBalance = async () => {
    setIsLoadingBalance(true);
    try {
      console.log('[HomePage] Fetching balance...');
      const balanceData = await getWalletBalance();
      // Balance data fetched successfully
      const actualBalance = typeof balanceData === 'number' ? balanceData : (balanceData.balance || 0);
      setBalance(actualBalance);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load balance';
      console.error('[HomePage] Balance fetch error:', err);
      setBalance(0);
      toastError(errorMessage);
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const fetchRecentTransactions = async () => {
    setIsLoadingTransactions(true);
    try {
      console.log('[HomePage] Fetching recent transactions...');
      const result = await getTransactionHistory(1, 5);
      
      console.log('[HomePage] Transactions fetched:', {
        count: result?.transactions?.length || 0,
        total: result?.total || 0,
      });
      
      const transactions = (result?.transactions || []).map((tx: any) => ({
        id: tx.id,
        type: tx.type?.toLowerCase() || 'transfer',
        description: tx.description || 'Transaction',
        amount: tx.amount || 0,
        date: tx.date || new Date().toISOString(),
        status: tx.status || 'completed',
      }));
      
      setRecentTransactions(transactions.slice(0, 5));
      console.log('[HomePage] Recent transactions loaded:', transactions.length);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load transactions';
      const safeErrorMsg = typeof errorMessage === 'string' ? errorMessage : 'Failed to load transactions';
      console.warn('[HomePage] Transactions fetch error (non-critical):', safeErrorMsg);
      // Don't show error toast for transactions as it's not critical
      setRecentTransactions([]);
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  const getNetworkLogo = (network: string) => {
    const networks: Record<string, { image: string; name: string }> = {
      'mtn': { image: '/s1.png', name: 'MTN' },
      'airtel': { image: '/s2.png', name: 'Airtel' },
      'glo': { image: '/s3.png', name: 'Glo' },
      '9mobile': { image: '/s4.png', name: '9Mobile' },
    };

    const normalized = network?.toLowerCase() || '';
    return networks[normalized] || { image: '/s1.png', name: network || 'Network' };
  };

  const getTransactionIcon = (type: string, description: string = '', index: number = 0) => {
    const isAirtime = description.toLowerCase().includes('airtime');

    if (isAirtime) {
      const networks = ['mtn', 'airtel', 'glo', '9mobile'];
      let foundNetwork = networks.find((net) => description.toLowerCase().includes(net));

      if (!foundNetwork) {
        const networkOrder = ['mtn', 'airtel', 'glo', '9mobile'];
        foundNetwork = networkOrder[index % networkOrder.length];
      }

      if (foundNetwork) {
        const logo = getNetworkLogo(foundNetwork);

        return (
          <Image
            src={logo.image}
            alt={logo.name}
            width={28}
            height={28}
            className="h-6 w-6 object-contain sm:h-7 sm:w-7"
            priority={false}
            unoptimized
          />
        );
      }
    }

    const typeStr = String(type).toLowerCase();
    const isIncoming = typeStr.includes('received') || typeStr.includes('deposit') || typeStr.includes('incoming');
    return isIncoming ? (
      <MdArrowDownward className="h-4 w-4 text-green-600" />
    ) : (
      <MdArrowUpward className="h-4 w-4 text-red-600" />
    );
  };

  const quickActions = [
    { icon: MdPhone, label: 'Airtime', route: '/payment/airtime' },
    { icon: MdWifi, label: 'Data', route: '/payment/data' },
    { icon: MdElectricalServices, label: 'Electricity', route: '/payment/electricity' },
    { icon: MdMoreVert, label: 'More', route: '/payment' },
  ];

  return (
    <div className="min-h-screen bg-[#F4F3F9] text-[#171717]">
      <Header />

      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-3 py-3 sm:px-5 sm:py-4 lg:px-6 lg:py-6">
        <div className="flex items-start justify-between gap-3 rounded-2xl border border-[#285858]/15 bg-white/80 px-3 py-3 shadow-sm backdrop-blur sm:px-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#285858]/70">Good day</p>
            <h2 className="mt-1 text-lg font-semibold text-[#171717] sm:text-xl">Welcome back</h2>
            <p className="mt-1 text-sm text-[#5f6b6a]">Everything you need to pay, transfer, and stay on top of bills.</p>
          </div>
          <div className="rounded-full border border-[#285858]/15 bg-[#E8F5E8] px-3 py-1.5 text-[11px] font-semibold text-[#285858]">
            Secure • Fast
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <BalanceCard balance={balance} />

            <div className="grid gap-3 md:grid-cols-[1.2fr_0.8fr]">
              <button
                onClick={() => setIsDepositOpen(true)}
                className="flex items-center justify-between rounded-2xl border border-[#22C55E]/20 bg-gradient-to-r from-[#22C55E] to-[#16A34A] p-4 text-left text-white shadow-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-md"
                title="Add funds to your wallet"
              >
                <div>
                  <p className="text-sm font-semibold">Add funds</p>
                  <p className="mt-1 text-xs text-white/80">Top up your wallet instantly</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
                  <MdAdd size={20} />
                </div>
              </button>

              <button
                onClick={() => setIsTransferOpen(true)}
                className="flex items-center justify-between rounded-2xl border border-[#1C3F3B]/10 bg-white p-4 text-left shadow-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-md"
              >
                <div>
                  <p className="text-sm font-semibold text-[#122927]">Transfer money</p>
                  <p className="mt-1 text-xs text-[#5f6b6a]">Send to anyone securely</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1C3F3B]/5 text-[#1C3F3B]">
                  <MdRemove size={20} />
                </div>
              </button>
            </div>

            <div className="rounded-2xl border border-[#1C3F3B]/10 bg-white p-3 shadow-sm sm:p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-semibold text-[#122927]">Quick services</h3>
                <span className="text-xs font-medium text-[#1C3F3B]/70">Pay in seconds</span>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {quickActions.map((action, idx) => (
                  <Link
                    key={idx}
                    href={action.route}
                    className="flex flex-col items-center gap-2 rounded-xl border border-[#1C3F3B]/10 bg-[#F8FAFA] p-3 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-[#1C3F3B]/30 hover:bg-white hover:shadow-sm"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1C3F3B]/10 text-[#1C3F3B]">
                      <action.icon size={16} />
                    </div>
                    <p className="text-[11px] font-semibold text-[#333333]">{action.label}</p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-[#1C3F3B]/10 bg-white p-2 shadow-sm sm:p-3">
              <div className="relative w-full" role="region" aria-roledescription="carousel">
                <div className="overflow-hidden rounded-xl">
                  <div
                    className={`flex transition-transform duration-500 ease-in-out ${activePromoIndex === 0 ? '-translate-x-0' : activePromoIndex === 1 ? '-translate-x-full' : '-translate-x-[200%]'}`}
                  >
                    {[
                      'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80',
                      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80',
                      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
                    ].map((image, index) => (
                      <div key={index} className="min-w-full shrink-0 grow-0 basis-full">
                        <div className="relative overflow-hidden rounded-xl">
                          <img alt={`promo-${index + 1}`} className="h-40 w-full object-cover sm:h-48 md:h-56" src={image} />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0f2c2a]/80 via-[#0f2c2a]/20 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-4 text-white sm:p-5">
                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#FFF4C8]">PayBancX spotlight</p>
                            <h3 className="mt-1 text-lg font-semibold sm:text-xl">Smart payments that feel effortless</h3>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-2 flex justify-center gap-1.5">
                {[0, 1, 2].map((dotIndex) => (
                  <div
                    key={dotIndex}
                    className={`h-1.5 rounded-full transition-all duration-300 ${activePromoIndex === dotIndex ? 'w-4 bg-[#285858]' : 'w-1.5 bg-[#285858]/30'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-[#1C3F3B]/10 bg-white p-3 shadow-sm sm:p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-semibold text-[#122927]">Recent transactions</h3>
                <Link href="/transactions" className="text-sm font-semibold text-[#1C3F3B] transition-colors hover:text-[#152d2a]">
                  View all
                </Link>
              </div>

              {isLoadingTransactions ? (
                <div className="rounded-xl bg-[#F8FAFA] py-4 text-center">
                  <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-[#1C3F3B]/5">
                    <MdDescription size={16} className="text-[#888888]" />
                  </div>
                  <p className="text-sm text-[#888888]">Loading transactions...</p>
                </div>
              ) : recentTransactions.length === 0 ? (
                <div className="rounded-xl bg-[#F8FAFA] py-4 text-center">
                  <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-[#1C3F3B]/5">
                    <MdDescription size={16} className="text-[#888888]" />
                  </div>
                  <p className="text-sm text-[#888888]">No transactions yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentTransactions.map((transaction, index) => (
                    <button
                      key={transaction.id}
                      onClick={() => router.push(`/transactions?id=${transaction.id}`)}
                      className="flex w-full items-center justify-between rounded-xl bg-[#F8FAFA] p-3 text-left transition-colors hover:bg-[#1C3F3B]/5"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-transparent">
                          {getTransactionIcon(transaction.type, transaction.description, index)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[#333333]">{transaction.description}</p>
                          <p className="text-xs text-[#888888]">{new Date(transaction.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <p className={`text-sm font-semibold ${
                        String(transaction.type).includes('received') || String(transaction.type).includes('deposit')
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}>
                        {String(transaction.type).includes('received') || String(transaction.type).includes('deposit') ? '+' : '-'}₦{normalizeAmount(transaction.amount).toLocaleString()}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-[#1C3F3B]/10 bg-white p-3 shadow-sm sm:p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-semibold text-[#122927]">Upcoming bills</h3>
                <Link href="/payment" className="text-sm font-semibold text-[#1C3F3B] transition-colors hover:text-[#152d2a]">
                  All bills
                </Link>
              </div>
              <div className="rounded-xl bg-[#F8FAFA] py-5 text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-[#2D5D59]/5">
                  <MdDescription size={18} className="text-[#888888]" />
                </div>
                <p className="text-sm text-[#888888]">No upcoming bills</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TransferModal isOpen={isTransferOpen} onClose={() => setIsTransferOpen(false)} />
      <GetQRModal isOpen={isGetQROpen} onClose={() => setIsGetQROpen(false)} />
      <DepositModal isOpen={isDepositOpen} onClose={() => setIsDepositOpen(false)} />
    </div>
  );
}

