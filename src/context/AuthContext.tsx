'use client';

import { createContext, ReactNode, useState, useCallback, useEffect } from 'react';
import {
  loginUser,
  signupUser,
  logoutUser,
  requestPasswordReset,
  verifyOTP,
  setTransactionPIN as setTransactionPINService,
  getUserProfile,
} from '@/services/authService';
import { getAuthToken, removeAuthToken } from '@/config/apiConfig';
import { toastError, toastSuccess } from '@/hooks/useToast';

export interface User {
  id?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email: string;
  phone?: string;
  avatar?: string;
  verified?: boolean;
  [key: string]: any;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  
  // Auth methods
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: { firstName: string; lastName: string; email: string; phone: string; password: string; confirmPassword: string }) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<any>;
  verifyOTP: (otp: string) => Promise<void>;
  setTransactionPIN: (pin: string) => Promise<void>;
  fetchProfile: () => Promise<void>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize authentication on mount and set up listener for storage changes
  useEffect(() => {
    const initializeAuth = () => {
      try {
        // Use a small delay to ensure localStorage is available on client side
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('authToken');
          const storedUser = localStorage.getItem('user');

          if (token) {
            setIsAuthenticated(true);
            if (storedUser) {
              try {
                setUser(JSON.parse(storedUser));
              } catch (e) {
                console.error('Failed to parse stored user:', e);
                // Clear invalid stored user
                localStorage.removeItem('user');
              }
            }
          } else {
            setIsAuthenticated(false);
            setUser(null);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Initialize auth on mount
    initializeAuth();

    // Listen for storage changes (e.g., token changes in other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken') {
        if (e.newValue) {
          setIsAuthenticated(true);
          // Also check for user data in storage
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
            } catch (e) {
              console.error('Failed to parse stored user:', e);
            }
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      }
      
      // Sync user data changes across tabs
      if (e.key === 'user' && e.newValue) {
        try {
          setUser(JSON.parse(e.newValue));
        } catch (e) {
          console.error('Failed to parse user data from storage:', e);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await loginUser(email, password);
      const userData = response.data?.user;

      if (userData) {
        setUser(userData);
      }

      // If loginUser didn't throw, token was saved. Mark as authenticated.
      setIsAuthenticated(true);
      toastSuccess('Login successful! Welcome back.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login error occurred';
      setError(errorMessage);
      setIsAuthenticated(false);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(
    async (userData: Omit<User, 'id'> & { password: string; confirmPassword: string }) => {
      setIsLoading(true);
      setError(null);
      try {
        if (userData.password !== userData.confirmPassword) {
          throw new Error('Passwords do not match');
        }

        const response = await signupUser({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phone: userData.phone,
          password: userData.password,
        });

        const newUser = response.data?.user;
        if (newUser) {
          setUser(newUser);
        }

        // If signupUser didn't throw, token was saved. Mark as authenticated.
        setIsAuthenticated(true);
        toastSuccess('Account created successfully!');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Signup error occurred';
        setError(errorMessage);
        setIsAuthenticated(false);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await logoutUser();
      setUser(null);
      setIsAuthenticated(false);
      removeAuthToken();
      // Don't show toast here - let the page handle it
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Logout error occurred';
      setError(errorMessage);
      // Don't show error toast here - let the page handle it
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await requestPasswordReset(email);
      return data; // Return the response with expiresAt
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Reset error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyOTPHandler = useCallback(async (otp: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await verifyOTP(otp);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'OTP verification error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setTransactionPIN = useCallback(async (pin: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await setTransactionPINService(pin);
      toastSuccess('Transaction PIN set successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'PIN setup error occurred';
      setError(errorMessage);
      toastError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getUserProfile();
      const userData = response.data?.user;
      if (userData) {
        setUser(userData);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch profile';
      setError(errorMessage);
      toastError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    error,
    login,
    signup,
    logout,
    resetPassword,
    verifyOTP: verifyOTPHandler,
    setTransactionPIN,
    fetchProfile,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

