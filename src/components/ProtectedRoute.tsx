'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

/**
 * Protected Route Component
 * 
 * Wraps pages that require authentication.
 * Redirects unauthenticated users to login page.
 */
export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  // Only run auth checks after component has mounted (hydration complete)
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    // Wait until component is mounted and auth has finished loading
    if (!mounted || isLoading) {
      return;
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router, mounted]);

  // Show loading state while checking authentication
  if (!mounted || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5F6F8]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#1C3F3B] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#888888] text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

