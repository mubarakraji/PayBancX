'use client';

import { ReactNode } from 'react';
import { Toaster, type ToastT } from 'sonner';

export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="bottom-center"
        theme="dark"
        richColors
        closeButton
        expand={true}
        visibleToasts={3}
        style={{
          '--toast-background': '#1C3F3B',
          '--toast-text-color': '#ffffff',
          marginBottom: '1rem',
        } as React.CSSProperties}
      />
    </>
  );
}

