'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
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
import { toastError, toastSuccess } from '@/hooks/useToast';
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
  const pathname = usePathname();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      fetchBalance();
      fetchRecentTransactions();
    }
  }, [isAuthenticated, authLoading]);

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
      'mtn': { image: '/m1.png', name: 'MTN' },
      'airtel': { image: '/m2.png', name: 'Airtel' },
      'glo': { image: '/m3.png', name: 'Glo' },
      '9mobile': { image: '/m4.png', name: '9Mobile' },
    };
    
    const normalized = network?.toLowerCase() || '';
    return networks[normalized] || { image: '/m1.png', name: network || 'Network' };
  };

  const getTransactionIcon = (type: string, description: string = '', index: number = 0) => {
    // Check if it's an airtime purchase
    const isAirtime = description.toLowerCase().includes('airtime');
    
    if (isAirtime) {
      // Try to extract network from description
      const networks = ['mtn', 'airtel', 'glo', '9mobile'];
      let foundNetwork = networks.find(net => description.toLowerCase().includes(net));
      
      // If network not in description, cycle through networks based on index
      if (!foundNetwork) {
        const networkOrder = ['mtn', 'airtel', 'glo', '9mobile'];
        foundNetwork = networkOrder[index % networkOrder.length];
      }
      
      if (foundNetwork) {
        const logo = getNetworkLogo(foundNetwork);
        try {
          return (
            <Image
              src={logo.image}
              alt={logo.name}
              width={32}
              height={32}
              className="w-4 h-4 object-contain"
              priority={false}
            />
          );
        } catch (err) {
          console.error('Image load error:', err);
          return <MdArrowUpward className="w-4 h-4 text-red-600" />;
        }
      }
    }

    const typeStr = String(type).toLowerCase();
    const isIncoming = typeStr.includes('received') || typeStr.includes('deposit') || typeStr.includes('incoming');
    return isIncoming ? (
      <MdArrowDownward className="w-4 h-4 text-green-600" />
    ) : (
      <MdArrowUpward className="w-4 h-4 text-red-600" />
    );
  };

  const quickActions = [
    { icon: MdPhone, label: 'Airtime', route: '/payment/airtime' },
    { icon: MdWifi, label: 'Data', route: '/payment/data' },
    { icon: MdElectricalServices, label: 'Electricity', route: '/payment/electricity' },
    { icon: MdMoreVert, label: 'More', route: '/payment' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F6F8]">
      {/* Header */}
      <Header />
      
      <div className="max-w-6xl mx-auto px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8 py-3 xs:py-4 sm:py-5 md:py-6">
        {/* 12-Column Grid Layout for Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 xs:gap-3.5 sm:gap-4 md:gap-5">
          {/* Left Column: 8 columns - Wallet & Services */}
          <div className="lg:col-span-8 space-y-3 xs:space-y-3.5 sm:space-y-4 md:space-y-5">
            {/* Wallet Balance Card */}
            <div className="space-y-3">
              <BalanceCard balance={balance} />
              {/* Deposit Button under Balance */}
              <button
                onClick={() => setIsDepositOpen(true)}
                className="w-full bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white py-2.5 px-4 rounded-lg font-semibold text-xs xs:text-sm flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-md"
                title="Add funds to your wallet"
              >
                <MdAdd size={18} />
                <span>Add Funds</span>
              </button>
            </div>

            {/* Quick Services Grid */}
            <div className="bg-white rounded-lg shadow-sm p-3 xs:p-3.5 md:p-4 border border-[#1C3F3B]/10">
              <h3 className="text-sm xs:text-base sm:text-lg font-bold text-[#333333] mb-2.5 xs:mb-3 font-[family-name:Syne]">Quick Services</h3>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2">
                {quickActions.map((action, idx) => (
                  <Link
                    key={idx}
                    href={action.route}
                    className="flex flex-col items-center gap-1.5 p-2.5 rounded-lg bg-white border-2 border-[#1C3F3B]/15 hover:border-[#1C3F3B]/40 hover:shadow-md transition-all duration-300 hover:scale-[1.03] group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#1C3F3B]/10 flex items-center justify-center group-hover:bg-[#1C3F3B]/20 transition-all">
                      <action.icon size={16} className="text-[#1C3F3B]" />
                    </div>
                    <p className="text-[10px] xs:text-xs font-semibold text-[#333333] text-center">{action.label}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => setIsTransferOpen(true)}
                className="bg-white border-2 border-[#1C3F3B] text-[#1C3F3B] py-2 px-4 rounded-lg font-semibold text-xs xs:text-sm flex items-center justify-center gap-2 hover:bg-[#1C3F3B]/5 transition-all duration-300 hover:scale-[1.01] active:scale-95"
              >
                <MdRemove size={18} />
                <span>Transfer Money</span>
              </button>
            </div>
          </div>

          {/* Right Column: 4 columns - Recent Transactions & Upcoming Bills */}
          <div className="lg:col-span-4 space-y-3 xs:space-y-3.5 sm:space-y-4 md:space-y-5">
            {/* Recent Transactions */}
            <div className="bg-white rounded-lg shadow-sm p-3 xs:p-3.5 md:p-4 border border-[#1C3F3B]/10">
              <div className="flex justify-between items-center mb-2.5 xs:mb-3">
                <h3 className="text-sm xs:text-base font-bold text-[#333333] font-[family-name:Syne]">Recent Transactions</h3>
                <Link
                  href="/transactions"
                  className="text-[#1C3F3B] hover:text-[#152d2a] text-[10px] xs:text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>View</span>
                  <MdArrowForward size={12} />
                </Link>
              </div>
              
              {isLoadingTransactions ? (
                <div className="text-center py-3 xs:py-4">
                  <div className="w-8 h-8 rounded-lg bg-[#1C3F3B]/5 flex items-center justify-center mx-auto mb-1 animate-pulse">
                    <MdDescription size={16} className="text-[#888888]" />
                  </div>
                  <p className="text-[10px] xs:text-xs text-[#888888]">Loading transactions...</p>
                </div>
              ) : recentTransactions.length === 0 ? (
                <div className="text-center py-3 xs:py-4">
                  <div className="w-8 h-8 rounded-lg bg-[#1C3F3B]/5 flex items-center justify-center mx-auto mb-1">
                    <MdDescription size={16} className="text-[#888888]" />
                  </div>
                  <p className="text-[10px] xs:text-xs text-[#888888]">No transactions yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentTransactions.map((transaction, index) => (
                    <button
                      key={transaction.id}
                      onClick={() => router.push(`/transactions?id=${transaction.id}`)}
                      className="w-full text-left flex items-center justify-between p-2.5 rounded-lg bg-[#F5F6F8] hover:bg-[#1C3F3B]/5 transition-colors group"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          String(transaction.type).includes('received') || String(transaction.type).includes('deposit') 
                            ? 'bg-green-100' 
                            : 'bg-red-100'
                        }`}>
                          {getTransactionIcon(transaction.type, transaction.description, index)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] xs:text-xs font-semibold text-[#333333] truncate">{transaction.description}</p>
                          <p className="text-[9px] xs:text-[10px] text-[#888888]">{new Date(transaction.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className={`text-[10px] xs:text-xs font-bold ${
                          String(transaction.type).includes('received') || String(transaction.type).includes('deposit')
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {String(transaction.type).includes('received') || String(transaction.type).includes('deposit') ? '+' : '-'}₦{normalizeAmount(transaction.amount).toLocaleString()}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming Bills */}
            <div className="bg-white rounded-lg shadow-sm p-3 xs:p-3.5 md:p-4 border border-[#1C3F3B]/10">
              <div className="flex justify-between items-center mb-2.5 xs:mb-3">
                <h3 className="text-sm xs:text-base font-bold text-[#333333] font-[family-name:Syne]">Upcoming Bills</h3>
                <Link
                  href="/payment"
                  className="text-[#1C3F3B] hover:text-[#152d2a] text-[10px] xs:text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>All</span>
                  <MdArrowForward size={14} />
                </Link>
              </div>
              {/* Empty State */}
              <div className="text-center py-4 xs:py-6">
                <div className="w-8 h-8 rounded-lg bg-[#2D5D59]/5 flex items-center justify-center mx-auto mb-1.5 xs:mb-2">
                  <MdDescription size={18} className="text-[#888888]" />
                </div>
                <p className="text-[10px] xs:text-xs text-[#888888]">No upcoming bills</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <TransferModal isOpen={isTransferOpen} onClose={() => setIsTransferOpen(false)} />
      <GetQRModal isOpen={isGetQROpen} onClose={() => setIsGetQROpen(false)} />
      <DepositModal isOpen={isDepositOpen} onClose={() => setIsDepositOpen(false)} />
    </div>
  );
}

