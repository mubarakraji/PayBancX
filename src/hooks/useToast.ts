import { useCallback } from 'react';
import { toast } from 'sonner';

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'loading';

export interface ShowToastOptions {
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const getToastId = (type: ToastType, message: string) => `${type}:${message.trim()}`;

export const useToast = () => {
  const showToast = useCallback(
    (
      message: string,
      type: ToastType = 'info',
      options?: ShowToastOptions
    ) => {
      const toastOptions = {
        id: getToastId(type, message),
        description: options?.description,
        duration: options?.duration || 4000,
        action: options?.action,
      };

      switch (type) {
        case 'success':
          toast.success(message, toastOptions);
          break;
        case 'error':
          toast.error(message, toastOptions);
          break;
        case 'warning':
          toast.warning(message, toastOptions);
          break;
        case 'loading':
          toast.loading(message, toastOptions);
          break;
        case 'info':
        default:
          toast(message, toastOptions);
          break;
      }
    },
    []
  );

  return { showToast };
};

// Convenience functions for direct usage without hook
export const showToast = (
  message: string,
  type: ToastType = 'info',
  options?: ShowToastOptions
) => {
  const toastOptions = {
    id: getToastId(type, message),
    description: options?.description,
    duration: options?.duration || 4000,
    action: options?.action,
  };

  switch (type) {
    case 'success':
      return toast.success(message, toastOptions);
    case 'error':
      return toast.error(message, toastOptions);
    case 'warning':
      return toast.warning(message, toastOptions);
    case 'loading':
      return toast.loading(message, toastOptions);
    case 'info':
    default:
      return toast(message, toastOptions);
  }
};

export const toastSuccess = (
  message: string,
  options?: ShowToastOptions
) => showToast(message, 'success', options);

export const toastError = (message: string, options?: ShowToastOptions) =>
  showToast(message, 'error', options);

export const toastWarning = (message: string, options?: ShowToastOptions) =>
  showToast(message, 'warning', options);

export const toastLoading = (message: string, options?: ShowToastOptions) =>
  showToast(message, 'loading', options);

export const toastInfo = (message: string, options?: ShowToastOptions) =>
  showToast(message, 'info', options);
