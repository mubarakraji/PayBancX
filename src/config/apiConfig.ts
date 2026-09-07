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

// Track if token refresh is in progress to avoid multiple simultaneous refresh attempts
let isRefreshingToken = false;
let tokenRefreshPromise: Promise<boolean> | null = null;

// Perform token refresh
const performTokenRefresh = async (): Promise<boolean> => {
  if (isRefreshingToken) {
    // Wait for the current refresh to complete
    return await tokenRefreshPromise!;
  }

  isRefreshingToken = true;
  
  try {
    tokenRefreshPromise = (async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          console.warn('[TokenRefresh] No token available to refresh');
          removeAuthToken();
          return false;
        }

        const response = await fetch('/api/v1/auth/refresh-token', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (!response.ok) {
          console.error('[TokenRefresh] Token refresh failed:', data.message);
          removeAuthToken();
          return false;
        }

        // Update token if returned
        const newToken = data.data?.token || data.data?.accessToken || data.token;
        if (newToken) {
          setAuthToken(newToken);
          console.log('[TokenRefresh] Token successfully refreshed');
          return true;
        } else {
          console.warn('[TokenRefresh] No new token in refresh response');
          return false;
        }
      } catch (error) {
        console.error('[TokenRefresh] Token refresh error:', error);
        removeAuthToken();
        return false;
      } finally {
        isRefreshingToken = false;
        tokenRefreshPromise = null;
      }
    })();

    return await tokenRefreshPromise;
  } catch (error) {
    isRefreshingToken = false;
    tokenRefreshPromise = null;
    throw error;
  }
};

// Authenticated fetch wrapper with automatic token refresh on 401
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {},
  retryCount = 0
): Promise<Response> => {
  try {
    // Add auth headers if not already present
    const headers = new Headers(options.headers || {});
    
    if (!headers.has('Authorization')) {
      const token = getAuthToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }
    
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // If response is 401 and we haven't retried yet, try to refresh token
    if (response.status === 401 && retryCount < 1) {
      console.log('[API] Received 401, attempting token refresh...');
      
      const refreshed = await performTokenRefresh();
      
      if (refreshed) {
        console.log('[API] Token refreshed, retrying request...');
        // Retry the request with the new token
        return authenticatedFetch(url, options, retryCount + 1);
      } else {
        console.warn('[API] Token refresh failed, returning 401 response');
        return response;
      }
    }

    return response;
  } catch (error) {
    console.error('[API] Authenticated fetch error:', error);
    throw error;
  }
};
