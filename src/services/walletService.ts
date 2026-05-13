// Wallet Service - Balance, Transactions, Deposits, Transfers
import { API_ENDPOINTS, buildApiUrl, getAuthHeaders } from '@/config/apiConfig';

export interface WalletBalance {
  balance: number;
  currency: string;
  accountNumber?: string;
  bankName?: string;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'payment';
  description: string;
  amount: number;
  status: string;
  date: string;
  time?: string;
  recipient?: string;
  reference?: string;
}

export interface VirtualAccount {
  accountNumber: string;
  accountName: string;
  bankName: string;
  bankCode: string;
}

export interface DepositInitiateResponse {
  reference: string;
  paymentUrl?: string;
  amount: number;
}

export interface WalletResponse {
  success: boolean;
  message?: string;
  data?: any;
}

// Transform BigInt values to strings recursively
function transformBigIntToString(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj === 'bigint') {
    return obj.toString();
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => transformBigIntToString(item));
  }
  
  if (typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        transformBigIntToString(value),
      ])
    );
  }
  
  return obj;
}

// Safely stringify objects that might contain BigInt
function safeStringify(obj: any): string {
  try {
    const transformed = transformBigIntToString(obj);
    return typeof transformed === 'string' ? transformed : JSON.stringify(transformed);
  } catch (e) {
    return String(obj);
  }
}

// Get Wallet Balance
export async function getWalletBalance(): Promise<WalletBalance> {
  try {
    const headers = getAuthHeaders();
    
    console.log('[Wallet] Fetching balance...');

    const response = await fetch('/api/v1/wallet/balance', {
      method: 'GET',
      headers: headers,
    });

    const data = await response.json();
    
    // Transform BigInt values to strings FIRST
    const transformedData = transformBigIntToString(data);
    
    console.log('[Wallet] Response status:', response.status);
    console.log('[Wallet] Response data:', transformedData);

    if (!response.ok) {
      if (response.status === 401) {
        console.error('[Wallet] 401 Unauthorized - token may be invalid or missing');
        throw new Error('Authentication required. Please login again.');
      }
      
      const candidate1 = transformedData?.message;
      const candidate2 = transformedData?.error;
      
      let errorMsg = '';
      if (typeof candidate1 === 'string' && candidate1.length > 0) {
        errorMsg = candidate1.substring(0, 500);
      } else if (typeof candidate2 === 'string' && candidate2.length > 0) {
        errorMsg = candidate2.substring(0, 500);
      } else {
        errorMsg = 'Failed to fetch wallet balance';
      }
      
      throw new Error('' + errorMsg);
    }

    return transformBigIntToString(transformedData?.data || transformedData);
  } catch (error) {
    console.error('Get balance error:', error);
    throw error;
  }
}

// Get Virtual Account Details
export async function getVirtualAccount(): Promise<VirtualAccount> {
  try {
    const response = await fetch('/api/v1/wallet/virtual-account', {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    
    // Transform BigInt values to strings FIRST, before any checks
    const transformedData = transformBigIntToString(data);

    if (!response.ok) {
      const candidate1 = transformedData?.message;
      const candidate2 = transformedData?.error;
      
      let errorMsg = '';
      if (typeof candidate1 === 'string' && candidate1.length > 0) {
        errorMsg = candidate1.substring(0, 500);
      } else if (typeof candidate2 === 'string' && candidate2.length > 0) {
        errorMsg = candidate2.substring(0, 500);
      } else {
        errorMsg = 'Failed to fetch virtual account';
      }
      
      throw new Error('' + errorMsg);
    }

    return transformedData?.data || transformedData;
  } catch (error) {
    console.error('Get virtual account error:', error);
    throw error;
  }
}

// Initiate Deposit
export async function initiateDeposit(amount: number): Promise<DepositInitiateResponse> {
  try {
    const response = await fetch('/api/v1/wallet/deposit/initiate', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ amount }),
    });

    const data = await response.json();
    const transformedData = transformBigIntToString(data);

    if (!response.ok) {
      const candidate1 = transformedData?.message;
      const candidate2 = transformedData?.error;
      
      let errorMsg = '';
      if (typeof candidate1 === 'string' && candidate1.length > 0) {
        errorMsg = candidate1.substring(0, 500);
      } else if (typeof candidate2 === 'string' && candidate2.length > 0) {
        errorMsg = candidate2.substring(0, 500);
      } else {
        errorMsg = 'Failed to initiate deposit';
      }
      
      throw new Error('' + errorMsg);
    }

    return transformBigIntToString(transformedData?.data || transformedData);
  } catch (error) {
    console.error('Initiate deposit error:', error);
    throw error;
  }
}

// Verify Deposit
export async function verifyDeposit(reference: string): Promise<WalletResponse> {
  try {
    const response = await fetch(`/api/v1/wallet/deposit/verify/${reference}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    const transformedData = transformBigIntToString(data);

    if (!response.ok) {
      const errorMsg = transformedData?.message || transformedData?.error || 'Failed to verify deposit';
      throw new Error(String(errorMsg).substring(0, 500));
    }

    return transformedData;
  } catch (error) {
    console.error('Verify deposit error:', error);
    throw error;
  }
}

// Withdraw Funds
export async function withdrawFunds(amount: number, bankCode: string, accountNumber: string, pin: string): Promise<WalletResponse> {
  try {
    const response = await fetch('/api/v1/wallet/withdraw', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ amount, bankCode, accountNumber, pin }),
    });

    const data = await response.json();
    const transformedData = transformBigIntToString(data);

    if (!response.ok) {
      const errorMsg = transformedData?.message || transformedData?.error || 'Failed to process withdrawal';
      throw new Error(String(errorMsg).substring(0, 500));
    }

    return transformedData;
  } catch (error) {
    console.error('Withdraw error:', error);
    throw error;
  }
}

// Transfer to Another User
export async function transferFunds(amount: number, recipientIdentifier: string, narration: string, pin: string): Promise<WalletResponse> {
  try {
    const response = await fetch('/api/v1/wallet/transfer', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ amount, recipient: recipientIdentifier, narration, pin }),
    });

    const data = await response.json();
    const transformedData = transformBigIntToString(data);

    if (!response.ok) {
      const errorMsg = transformedData?.message || transformedData?.error || 'Failed to process transfer';
      throw new Error(String(errorMsg).substring(0, 500));
    }

    return transformedData;
  } catch (error) {
    console.error('Transfer error:', error);
    throw error;
  }
}

// Get Transaction History
export async function getTransactionHistory(
  page: number = 1,
  limit: number = 20,
  type?: string,
  status?: string
): Promise<{ transactions: Transaction[]; total: number; page: number }> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (type) params.append('type', type);
    if (status) params.append('status', status);

    const url = `/api/v1/wallet/transactions?${params.toString()}`;
    
    console.log('[Wallet] Fetching transactions from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    
    // Transform BigInt values to strings FIRST, before any checks or processing
    const transformedData = transformBigIntToString(data);

    if (!response.ok) {
      // Extract potential error messages - be extremely defensive
      // Only work with string primitives to avoid BigInt serialization issues
      let errorMsg = 'Failed to fetch transactions';
      
      try {
        const candidates = [
          transformedData?.error,
          transformedData?.message,
          transformedData?.data?.error,
          transformedData?.data?.message,
        ];
        
        for (const candidate of candidates) {
          if (typeof candidate === 'string' && candidate.trim().length > 0) {
            errorMsg = candidate.substring(0, 500);
            break;
          }
        }
      } catch (extractError) {
        // If extraction fails, use default message
        console.warn('[Wallet] Error extraction failed, using default message');
        errorMsg = 'Failed to fetch transactions';
      }
      
      // Final conversion ensures we have a safe string primitive
      const safeErrorMsg = String(errorMsg).trim() || 'Failed to fetch transactions';
      // Throw without logging the message to avoid serialization issues
      throw new Error(safeErrorMsg);
    }

    // Get transactions from the nested data structure
    const transactions = transformedData?.data?.transactions || [];
    const total = transformedData?.data?.total || 0;
    const currentPage = transformedData?.data?.pagination?.page || page;

    console.log('[Wallet] Transactions received:', {
      count: transactions.length,
      total,
      page: currentPage,
    });

    // Ensure all nested data is also transformed
    return {
      transactions: transactions.map((tx: any) => transformBigIntToString(tx)),
      total,
      page: currentPage,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    const safeErrorMsg = typeof errorMsg === 'string' ? errorMsg : 'Unknown error';
    console.error('[Wallet] Get transactions error:', safeErrorMsg);
    throw new Error(safeErrorMsg);
  }
}

// Get Single Transaction Details
export async function getTransactionDetail(transactionId: string): Promise<Transaction> {
  try {
    const response = await fetch(buildApiUrl(`${API_ENDPOINTS.WALLET.TRANSACTION_DETAIL}/${transactionId}`), {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    
    // Transform BigInt values to strings FIRST
    const transformedData = transformBigIntToString(data);

    if (!response.ok) {
      const errorMsg = transformedData?.message || transformedData?.error || 'Failed to fetch transaction details';
      throw new Error(String(errorMsg).substring(0, 500));
    }

    return transformBigIntToString(transformedData?.data || transformedData);
  } catch (error) {
    console.error('Get transaction detail error:', error);
    throw error;
  }
}

// Stream Wallet Events (WebSocket or polling)
export async function getWalletStream(): Promise<WalletResponse> {
  try {
    const response = await fetch(buildApiUrl(API_ENDPOINTS.WALLET.STREAM), {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get wallet stream');
    }

    return data;
  } catch (error) {
    console.error('Get wallet stream error:', error);
    throw error;
  }
}

// Check KYC Verification Status
export async function checkKYCStatus(): Promise<{ verified: boolean; message?: string }> {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch('/api/v1/auth/kyc-status', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    // KYC status retrieved

    if (!response.ok) {
      // Default to not verified if endpoint fails
      return { verified: false, message: 'Unable to verify KYC status' };
    }

    return {
      verified: data.verified || false,
      message: data.message,
    };
  } catch (error) {
    // KYC status check failed
    // Default to not verified if there's an error
    return { verified: false, message: 'KYC verification check failed' };
  }
}
