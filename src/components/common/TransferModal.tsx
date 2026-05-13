'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TransferModal({ isOpen, onClose }: TransferModalProps) {
  const router = useRouter();
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Directly navigate to transfer page
      router.push('/transfer');
      onClose();
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, router, onClose]);

  // Escape key handler - cleanup paired with setup
  useEffect(() => {
    if (!isOpen) {
      return; // No cleanup needed when not open
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        document.body.style.overflow = 'unset';
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  return null;
}

