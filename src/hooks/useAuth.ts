'use client';

import { useContext } from 'react';
import { AuthContext, AuthContextType } from '@/context/AuthContext';

/**
 * Custom hook to use Auth Context
 * 
 * @returns {AuthContextType} Auth context with user data and auth methods
 * 
 * @example
 * const { user, isAuthenticated, login, logout } = useAuth();
 * 
 * @throws Error if used outside AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
