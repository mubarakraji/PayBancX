'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './useAuth';
import { getAuthToken } from '@/config/apiConfig';

/**
 * Hook that ensures authentication is ready before making API calls
 * Handles hydration mismatches and ensures token is available in localStorage
 * 
 * @returns Object with authReady status and redirect function
 * 
 * @example
 * const { authReady, redirectToLogin } = useAuthReady();
 * 
 * useEffect(() => {
 *   if (authReady && token) {
 *     fetchData();
 *   }
 * }, [authReady, token]);
 */
export function useAuthReady() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [hasHydrated, setHasHydrated] = useState(false);
  const [tokenAvailable, setTokenAvailable] = useState(false);

  // Check if component has hydrated on client side and token is available
  useEffect(() => {
    const checkAuth = () => {
      const token = getAuthToken();
      setTokenAvailable(!!token);
      setHasHydrated(true);
    };

    // Run after a tick to ensure component is fully mounted
    const timeout = setTimeout(checkAuth, 0);
    return () => clearTimeout(timeout);
  }, []);

  const authReady = hasHydrated && isAuthenticated && !isLoading && tokenAvailable;

  const redirectToLogin = useCallback(() => {
    router.push('/login');
  }, [router]);

  return {
    authReady,
    tokenAvailable,
    hasHydrated,
    isAuthenticated,
    isLoading,
    redirectToLogin,
  };
}
