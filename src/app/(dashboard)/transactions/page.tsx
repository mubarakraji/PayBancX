'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { MdArrowUpward, MdArrowDownward, MdSearch, MdArrowBack } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { getTransactionHistory } from '@/services/walletService';
import { useAuth } from '@/hooks/useAuth';
import { toastError } from '@/hooks/useToast';
import { normalizeAmount } from '@/utils/helpers';

type TransactionType = 'all' | 'received' | 'sent';
type TimeFilter = 'all-time' | 'today' | 'this-week' | 'this-month';

interface Transaction {
  id: string;
  type: 'received' | 'sent' | 'deposit' | 'withdrawal' | 'payment' | 'transfer';
  description: string;
  amount: number;
  date: string;
  time?: string;
  status?: string;
  recipient?: string;
}

export default function TransactionsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [transactionType, setTransactionType] = useState<TransactionType>('all');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all-time');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  // Fetch transactions on mount and when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchTransactions();
    }
  }, [isAuthenticated, page]);

  const serializeError = (value: unknown): string => {
    if (value instanceof Error) {
      return value.message || 'Failed to load transactions';
    }

    if (typeof value === 'string') {
      return value;
    }

    try {
      return JSON.stringify(value, (_, item) => typeof item === 'bigint' ? item.toString() : item) || 'Failed to load transactions';
    } catch {
      try {
        return String(value) || 'Failed to load transactions';
      } catch {
        return 'Failed to load transactions';
      }
    }
  };

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      console.log('[Transactions Page] Fetching transactions for page:', page);
      const result = await getTransactionHistory(page, 20);
      
      console.log('[Transactions Page] Received result:', {
        count: result.transactions?.length,
        total: result.total,
        page: result.page,
      });
      
      // Normalize transaction type
      const normalizedTransactions = (result.transactions || []).map((tx: any) => ({
        ...tx,
        type: normalizeTransactionType(tx.type),
      }));
      
      setTransactions(normalizedTransactions);
      console.log('[Transactions Page] Transactions loaded successfully:', normalizedTransactions.length);
    } catch (err) {
      const safeErrorMsg = serializeError(err);
      console.error('[Transactions Page] Transaction fetch error:', safeErrorMsg);
      toastError(safeErrorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const normalizeTransactionType = (type: string): TransactionType | string => {
    const typeMap: Record<string, TransactionType | string> = {
      'received': 'received',
      'received_in': 'received',
      'deposit': 'received',
      'sent': 'sent',
      'sent_out': 'sent',
      'withdrawal': 'sent',
      'transfer': 'sent',
      'payment': 'sent',
    };
    return typeMap[type.toLowerCase()] || 'sent';
  };

  const getTimeFilterDate = (filter: TimeFilter): Date | null => {
    const now = new Date();
    switch (filter) {
      case 'today':
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
      case 'this-week':
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        weekAgo.setHours(0, 0, 0, 0);
        return weekAgo;
      case 'this-month':
        const monthAgo = new Date();
        monthAgo.setMonth(now.getMonth() - 1);
        monthAgo.setHours(0, 0, 0, 0);
        return monthAgo;
      default:
        return null;
    }
  };

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tx.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = transactionType === 'all' || tx.type === transactionType;
    
    // Apply time filter
    const filterDate = getTimeFilterDate(timeFilter);
    let matchesTime = true;
    if (filterDate) {
      const txDate = new Date(tx.date);
      txDate.setHours(0, 0, 0, 0);
      matchesTime = txDate >= filterDate;
    }
    
    return matchesSearch && matchesType && matchesTime;
  });

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
            width={30}
            height={30}
            className="h-7 w-7 object-contain sm:h-8 sm:w-8"
            priority={false}
            unoptimized
          />
        );
      }
    }

    return type === 'received' ? (
      <MdArrowDownward className="h-5 w-5 text-green-600" />
    ) : (
      <MdArrowUpward className="h-5 w-5 text-red-600" />
    );
  };

  const getTransactionColor = (type: string) => {
    return type === 'received' ? 'bg-green-100' : 'bg-red-100';
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8] pb-16 text-[#122927] md:pb-6">
      <div className="border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-3 py-3 xs:px-4 sm:px-5 sm:py-4 md:px-6 lg:px-8">
          <button
            onClick={() => router.back()}
            title="Go back"
            aria-label="Go back"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#1C3F3B] transition-all duration-200 hover:border-[#1C3F3B]/30 hover:bg-[#F8FAFA]"
          >
            <MdArrowBack size={20} />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-[#122927] sm:text-xl">Transactions</h1>
            <p className="text-sm text-[#64748B]">View and manage all your transactions</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-3 py-4 xs:px-4 sm:px-5 md:px-6 lg:px-8 md:py-5">
        <div className="mb-4 rounded-3xl border border-[#E5E7EB] bg-white p-4 shadow-sm xs:mb-6 sm:p-5">
          {/* Search Bar */}
          <div className="mb-4 xs:mb-5">
            <label className="block text-[10px] xs:text-xs sm:text-sm font-semibold text-[#333333] mb-1.5 xs:mb-2">Search Transactions</label>
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2D5D59]" size={16} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 xs:py-2 sm:py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[10px] xs:text-xs sm:text-sm text-[#333333] placeholder-[#888888] focus:outline-none focus:border-[#2D5D59] focus:ring-2 focus:ring-[#2D5D59]/20 transition-all duration-300 hover:border-[#2D5D59]"
                aria-label="Search transactions"
              />
            </div>
          </div>

          {/* Filter Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 xs:gap-4 md:gap-5">
            {/* Transaction Type Filter */}
            <div>
              <label className="block text-[10px] xs:text-xs sm:text-sm font-semibold text-[#333333] mb-2 xs:mb-3">Transaction Type</label>
              <div className="flex flex-wrap gap-1.5 xs:gap-2">
                {(['all', 'received', 'sent'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setTransactionType(type)}
                    className={`px-2.5 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 rounded-lg font-semibold text-[9px] xs:text-[10px] sm:text-xs transition-all duration-300 ${
                      transactionType === type
                        ? 'bg-[#2D5D59] text-white shadow-md'
                        : 'bg-white border border-[#E2E8F0] text-[#333333] hover:border-[#2D5D59] hover:text-[#2D5D59]'
                    } hover:scale-[1.02]`}
                  >
                    {type === 'all' ? 'All' : type === 'received' ? '↓' : '↑'}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Filter */}
            <div>
              <label className="block text-[10px] xs:text-xs sm:text-sm font-semibold text-[#333333] mb-2 xs:mb-3">Time Period</label>
              <div className="flex flex-wrap gap-1.5 xs:gap-2">
                {(['all-time', 'today', 'this-week', 'this-month'] as const).map((time) => (
                  <button
                    key={time}
                    onClick={() => setTimeFilter(time)}
                    className={`px-3 xs:px-4 py-1.5 xs:py-2 rounded-lg font-semibold text-xs transition-all duration-300 ${
                      timeFilter === time
                        ? 'bg-[#2D5D59] text-white shadow-md'
                        : 'bg-white border border-[#E2E8F0] text-[#888888] hover:border-[#2D5D59]'
                    } hover:scale-[1.02]`}
                  >
                    {time === 'all-time' ? 'All' : time === 'today' ? 'Today' : time === 'this-week' ? 'Week' : 'Month'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {isLoading ? (
          <div className="bg-white rounded-xl border border-[#2D5D59]/10 p-4 xs:p-5 text-center shadow-sm">
            <div className="inline-block animate-spin mb-2 xs:mb-3">
              <MdArrowDownward size={24} className="text-[#2D5D59]" />
            </div>
            <p className="text-[#888888] text-[10px] xs:text-xs sm:text-sm">Loading transactions...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#2D5D59]/10 p-3 xs:p-4 md:p-5 text-center shadow-sm">
            <div className="w-12 h-12 xs:w-16 xs:h-16 mx-auto mb-2 xs:mb-4 rounded-lg bg-[#F5F6F8] flex items-center justify-center">
              <span className="text-2xl xs:text-3xl">🧾</span>
            </div>
            <h2 className="text-base xs:text-lg sm:text-xl font-bold text-[#333333] mb-1 xs:mb-2 font-[family-name:Syne]">No Transactions Found</h2>
            <p className="text-[#888888] text-[10px] xs:text-xs sm:text-sm max-w-lg mx-auto">Try adjusting your filters or make your first transaction</p>
          </div>
        ) : (
          <div className="space-y-2 xs:space-y-3 md:space-y-4">
            {/* Table Header - Desktop Only */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 text-sm font-semibold text-[#888888] border-b border-[#2D5D59]/10 bg-[#F5F6F8] rounded-lg">
              <div className="col-span-1">Type</div>
              <div className="col-span-4">Description</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-3">Amount</div>
              <div className="col-span-2">Status</div>
            </div>

            {/* Transaction Items */}
            {filteredTransactions.map((transaction, index) => (
              <div
                key={transaction.id}
                className="rounded-2xl border border-[#E5E7EB] bg-white p-3 shadow-sm transition-all duration-200 hover:border-[#1C3F3B]/30 hover:shadow-md xs:p-4 md:p-5 lg:p-6"
              >
                {/* Mobile Layout */}
                <div className="md:hidden">
                  <div className="flex items-start justify-between gap-2 xs:gap-3">
                    <div className="flex items-center gap-2 xs:gap-3 flex-1 min-w-0">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-transparent">
                        {getTransactionIcon(transaction.type, transaction.description, index)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[#333333] text-xs xs:text-sm truncate">{transaction.description}</h3>
                        <p className="text-[9px] xs:text-xs text-[#888888]">{new Date(transaction.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p
                        className={`font-bold text-xs xs:text-sm ${
                          transaction.type === 'received' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {transaction.type === 'received' ? '+' : '-'}₦{normalizeAmount(transaction.amount).toLocaleString()}
                      </p>
                      {transaction.status && (
                        <p className="text-[8px] xs:text-[9px] text-[#888888] mt-0.5 capitalize">{transaction.status}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-1">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-transparent">
                      {getTransactionIcon(transaction.type, transaction.description, index)}
                    </div>
                  </div>
                  <div className="col-span-4">
                    <p className="font-medium text-paybancx-text-dark">{transaction.description}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-paybancx-text-muted">{new Date(transaction.date).toLocaleDateString()}</p>
                  </div>
                  <div className="col-span-3">
                    <p
                      className={`font-bold ${
                        transaction.type === 'received' ? 'text-paybancx-success' : 'text-red-600'
                      }`}
                    >
                      {transaction.type === 'received' ? '+' : '-'}₦{normalizeAmount(transaction.amount).toLocaleString()}
                    </p>
                  </div>
                  <div className="col-span-2">
                    {transaction.status && (
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          transaction.status === 'completed' || transaction.status === 'successful'
                            ? 'bg-paybancx-success/10 text-paybancx-success'
                            : 'bg-yellow-500/10 text-yellow-700'
                        }`}
                      >
                        {transaction.status === 'completed' ? 'Successful' : transaction.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Load More Button */}
            {!isLoading && filteredTransactions.length > 0 && (
              <div className="flex justify-center mt-6 xs:mt-8 md:mt-12">
                <button
                  onClick={() => {
                    console.log('[Transactions Page] Loading more transactions, page:', page + 1);
                    setPage(page + 1);
                  }}
                  className="px-6 xs:px-8 py-2 xs:py-3 border-2 border-[#2D5D59] text-[#2D5D59] rounded-lg font-bold text-xs xs:text-base md:text-lg hover:bg-[#2D5D59] hover:text-white transition-all duration-300 hover:scale-[1.02] shadow-md"
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

