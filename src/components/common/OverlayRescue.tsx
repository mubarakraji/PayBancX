'use client';

import { useEffect } from 'react';

/**
 * Emergency overlay rescue component
 * Fixes frozen pages by resetting body overflow and removing overlays
 */
export function OverlayRescue() {
  useEffect(() => {
    // Expose rescue function globally
    (window as any).rescueOverlay = () => {
      console.log('🆘 Rescuing overlay...');
      document.body.style.overflow = 'unset';
      document.body.style.pointerEvents = 'auto';
      
      // Remove any stuck modals
      const modals = document.querySelectorAll('[role="dialog"]');
      modals.forEach(modal => {
        (modal as HTMLElement).style.display = 'none';
      });
      
      // Remove any stuck overlays
      const overlays = document.querySelectorAll('[class*="fixed"][class*="inset"][class*="bg-black"]');
      overlays.forEach(overlay => {
        (overlay as HTMLElement).remove();
      });
      
      console.log('✅ Overlay rescued! Page should be clickable now.');
    };

    // Also call it on mount if page is already frozen
    if (document.body.style.overflow === 'hidden') {
      console.warn('⚠️ Page detected as frozen. Running rescue...');
      (window as any).rescueOverlay();
    }

    // Listen for stuck state
    const checkInterval = setInterval(() => {
      if (document.body.style.overflow === 'hidden' && !document.querySelector('[role="dialog"]')) {
        console.warn('⚠️ Detected frozen state without modal. Rescuing...');
        (window as any).rescueOverlay();
        clearInterval(checkInterval);
      }
    }, 2000);

    return () => {
      clearInterval(checkInterval);
    };
  }, []);

  return null;
}
