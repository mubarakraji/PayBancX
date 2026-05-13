// Auth Service - Complete Authentication Methods
import { API_BASE_URL, API_ENDPOINTS, buildApiUrl, getAuthHeaders, setAuthToken, removeAuthToken } from '@/config/apiConfig';

export interface Logincredentials {
  email: string;
  password: string;
}

export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export interface ResetPasswordData {
  email: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    token?: string;
    user?: any;
    accessToken?: string;
    refreshToken?: string;
  };
}

// Login User
export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log('[Auth] Complete login response:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Store token and user data - handle multiple response formats
    let token: string | null = null;
    let refreshToken: string | null = null;
    let user: any = null;

    // Recursively search for token in the response
    const findToken = (obj: any): string | null => {
      if (!obj || typeof obj !== 'object') return null;
      
      // Check common token field names
      if (obj.token) return obj.token;
      if (obj.accessToken) return obj.accessToken;
      if (obj.access_token) return obj.access_token;
      if (obj.authToken) return obj.authToken;
      if (obj.auth_token) return obj.auth_token;
      
      // Search nested objects
      for (const key in obj) {
        const result = findToken(obj[key]);
        if (result) return result;
      }
      
      return null;
    };

    // Search for refresh token
    const findRefreshToken = (obj: any): string | null => {
      if (!obj || typeof obj !== 'object') return null;
      
      if (obj.refreshToken) return obj.refreshToken;
      if (obj.refresh_token) return obj.refresh_token;
      if (obj.refreshToken) return obj.refreshToken;
      
      for (const key in obj) {
        const result = findRefreshToken(obj[key]);
        if (result) return result;
      }
      
      return null;
    };

    token = findToken(data);
    refreshToken = findRefreshToken(data);
    user = data.user || data.data?.user || data.userData;

    if (token) {
      console.log('[Auth] Found token:', token.substring(0, 30) + '...');
      setAuthToken(token);
      
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
        console.log('[Auth] Refresh token saved');
      }
      
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        console.log('[Auth] Saved user data:', user);
      }
      console.log('[Auth] Token saved. Verification:', localStorage.getItem('authToken') ? 'SUCCESS' : 'FAILED');
    } else {
      console.warn('[Auth] No token found in response. Full response:', data);
      console.warn('[Auth] Response keys:', Object.keys(data));
      if (data.data) console.warn('[Auth] data.data keys:', Object.keys(data.data));
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

// Create New Account (Register)
export async function signupUser(data: SignupData): Promise<AuthResponse> {
  try {
    const response = await fetch('/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log('[Auth] Complete signup response:', JSON.stringify(result, null, 2));

    if (!response.ok) {
      // Extract detailed error information
      let errorMessage = result.message || 'Signup failed';
      
      // Handle validation errors
      if (result.errors) {
        console.log('[Auth] Validation errors:', result.errors);
        if (typeof result.errors === 'object') {
          const errorDetails = Object.entries(result.errors)
            .map(([field, messages]: any) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('; ');
          errorMessage = errorDetails || errorMessage;
        }
      }
      
      // Handle error data object
      if (result.data?.message) {
        errorMessage = result.data.message;
      }
      
      console.error('[Auth] Error details:', { message: errorMessage, fullResponse: result });
      throw new Error(errorMessage);
    }

    // Store token and user data after successful signup - handle multiple response formats
    let token: string | null = null;
    let refreshToken: string | null = null;
    let user: any = null;

    // Recursively search for token in the response
    const findToken = (obj: any): string | null => {
      if (!obj || typeof obj !== 'object') return null;
      
      // Check common token field names
      if (obj.token) return obj.token;
      if (obj.accessToken) return obj.accessToken;
      if (obj.access_token) return obj.access_token;
      if (obj.authToken) return obj.authToken;
      if (obj.auth_token) return obj.auth_token;
      
      // Search nested objects
      for (const key in obj) {
        const result = findToken(obj[key]);
        if (result) return result;
      }
      
      return null;
    };

    // Search for refresh token
    const findRefreshToken = (obj: any): string | null => {
      if (!obj || typeof obj !== 'object') return null;
      
      if (obj.refreshToken) return obj.refreshToken;
      if (obj.refresh_token) return obj.refresh_token;
      if (obj.refreshToken) return obj.refreshToken;
      
      for (const key in obj) {
        const result = findRefreshToken(obj[key]);
        if (result) return result;
      }
      
      return null;
    };

    token = findToken(result);
    refreshToken = findRefreshToken(result);
    user = result.user || result.data?.user || result.userData;

    if (token) {
      console.log('[Auth] Found token:', token.substring(0, 30) + '...');
      setAuthToken(token);
      
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
        console.log('[Auth] Refresh token saved');
      }
      
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        console.log('[Auth] Saved user data:', user);
      }
      console.log('[Auth] Token saved. Verification:', localStorage.getItem('authToken') ? 'SUCCESS' : 'FAILED');
    } else {
      console.warn('[Auth] No token found in response. Full response:', result);
      console.warn('[Auth] Response keys:', Object.keys(result));
      if (result.data) console.warn('[Auth] result.data keys:', Object.keys(result.data));
    }

    return result;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
}

// Request Password Reset
export async function requestPasswordReset(email: string): Promise<AuthResponse> {
  try {
    const response = await fetch('/api/v1/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    console.log('[Auth] Forgot password response:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Password reset request failed');
    }

    return data;
  } catch (error) {
    console.error('Password reset request error:', error);
    throw error;
  }
}

// Verify OTP
export async function verifyOTP(otp: string): Promise<AuthResponse> {
  try {
    const response = await fetch('/api/v1/auth/verify-otp', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ otp }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'OTP verification failed');
    }

    return data;
  } catch (error) {
    console.error('OTP verification error:', error);
    throw error;
  }
}

// Resend OTP
export async function resendOTP(email: string): Promise<AuthResponse> {
  try {
    const response = await fetch('/api/v1/auth/resend-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Resend OTP failed');
    }

    return data;
  } catch (error) {
    console.error('Resend OTP error:', error);
    throw error;
  }
}

// Reset Password with Token
export async function resetPassword(token: string, passwords: { newPassword: string; confirmPassword: string }): Promise<AuthResponse> {
  try {
    if (passwords.newPassword !== passwords.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    const response = await fetch('/api/v1/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword: passwords.newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Password reset failed');
    }

    return data;
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
}

// Change Password
export async function changePassword(oldPassword: string, newPassword: string): Promise<AuthResponse> {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch('/api/v1/auth/change-password', {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Change password failed');
    }

    return data;
  } catch (error) {
    console.error('Change password error:', error);
    throw error;
  }
}

// Get User Profile
export async function getUserProfile(): Promise<AuthResponse> {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch('/api/v1/auth/profile', {
      method: 'GET',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch profile');
    }

    // Update stored user data
    if (data.data?.user) {
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }

    return data;
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
}

// Refresh Token
export async function refreshToken(): Promise<AuthResponse> {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch('/api/v1/auth/refresh-token', {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      removeAuthToken();
      throw new Error(data.message || 'Token refresh failed');
    }

    // Update token if returned
    if (data.data?.token || data.data?.accessToken) {
      const token = data.data.token || data.data.accessToken;
      setAuthToken(token);
    }

    return data;
  } catch (error) {
    console.error('Token refresh error:', error);
    throw error;
  }
}

// Set Transaction PIN
export async function setTransactionPIN(pin: string): Promise<AuthResponse> {
  try {
    if (pin.length !== 4 || !/^\d+$/.test(pin)) {
      throw new Error('PIN must be 4 digits');
    }

    const token = localStorage.getItem('authToken');
    const response = await fetch('/api/v1/auth/transaction-pin', {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pin }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'PIN setup failed');
    }

    return data;
  } catch (error) {
    console.error('PIN setup error:', error);
    throw error;
  }
}

// Logout User
export async function logoutUser(): Promise<void> {
  try {
    removeAuthToken();
    // Clear all auth-related storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    console.log('[Auth] Logged out - all tokens and user data cleared');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}
