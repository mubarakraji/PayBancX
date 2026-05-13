// API Configuration
export const API_BASE_URL = 'https://pb-production-fd26.up.railway.app/api/v1';

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    VERIFY_OTP: '/auth/verify-otp',
    RESEND_OTP: '/auth/resend-otp',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    REFRESH_TOKEN: '/auth/refresh-token',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
    KYC_VERIFY: '/auth/kyc',
    TERMS: '/auth/terms',
    PRIVACY: '/auth/privacy',
  },
  // Wallet endpoints
  WALLET: {
    BALANCE: '/wallet/balance',
    VIRTUAL_ACCOUNT: '/wallet/virtual-account',
    DEPOSIT_INITIATE: '/wallet/deposit/initiate',
    DEPOSIT_VERIFY: '/wallet/deposit/verify',
    WITHDRAW: '/wallet/withdraw',
    TRANSFER: '/wallet/transfer',
    TRANSACTIONS: '/wallet/transactions',
    TRANSACTION_DETAIL: '/wallet/transaction',
    STREAM: '/wallet/stream',
  },
  // Services endpoints
  SERVICES: {
    AIRTIME: '/services/airtime',
    DATA: '/services/data',
    DATA_VARIATIONS: '/services/data/variations',
    ELECTRICITY_VERIFY: '/services/electricity/verify',
    ELECTRICITY: '/services/electricity',
    TV_VARIATIONS: '/services/tv/variations',
    TV_VERIFY: '/services/tv/verify',
    TV: '/services/tv',
    BETTING_VERIFY: '/services/betting/verify',
    BETTING: '/services/betting',
    ORDERS: '/services/orders',
    HISTORY: '/services/history',
  },
};

// Helper function to build full API URL
export const buildApiUrl = (endpoint: string, params?: Record<string, any>): string => {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  
  return url.toString();
};

// Get auth token from localStorage
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    if (token) {
      console.log('[TokenCheck] Token found in localStorage:', token.substring(0, 20) + '...');
    } else {
      console.warn('[TokenCheck] No token found in localStorage');
      console.log('[TokenCheck] Available localStorage keys:', Object.keys(localStorage));
    }
    return token;
  }
  return null;
};

// Set auth token in localStorage
export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('authToken', token);
      // Verify it was actually saved
      const saved = localStorage.getItem('authToken');
      if (saved === token) {
        console.log('[TokenSet] Token successfully saved to localStorage');
      } else {
        console.error('[TokenSet] Token verification failed - may not have been saved correctly');
      }
    } catch (error) {
      console.error('[TokenSet] Error saving token to localStorage:', error);
    }
  }
};

// Remove auth token from localStorage
export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
};

// Build headers with authentication
export const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log('[API] Auth header added with token:', token.substring(0, 20) + '...');
  } else {
    console.warn('[API] No token available for request');
  }
  
  return headers;
};
