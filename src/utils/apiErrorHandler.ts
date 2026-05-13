import { toastError, toastSuccess, toastWarning, toastLoading } from '@/hooks/useToast';

/**
 * Handles API errors and shows toast notifications
 * @param error The error object from API call
 * @param defaultMessage Default message if error message cannot be extracted
 * @param customMessage Custom message to override error message
 */
export const handleApiError = (
  error: unknown,
  defaultMessage: string = 'An error occurred',
  customMessage?: string
): string => {
  let errorMessage = customMessage || defaultMessage;

  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else if (error && typeof error === 'object') {
    if ('message' in error) {
      errorMessage = (error as any).message;
    } else if ('error' in error) {
      errorMessage = (error as any).error;
    } else if ('data' in error && typeof (error as any).data === 'object') {
      const data = (error as any).data;
      if ('message' in data) {
        errorMessage = data.message;
      }
    }
  }

  // Show toast notification
  toastError(errorMessage);

  return errorMessage;
};

/**
 * Handles API success responses and optionally shows success toast
 * @param message Success message to show
 * @param showToast Whether to show the toast notification (default: true)
 */
export const handleApiSuccess = (message: string = 'Operation successful', showToast: boolean = true): void => {
  if (showToast) {
    toastSuccess(message);
  }
};

/**
 * Creates a loading toast that can be later updated or dismissed
 * @param message Loading message
 */
export const handleApiLoading = (message: string = 'Processing...') => {
  return toastLoading(message);
};

/**
 * Extracts error message from various error formats
 * @param error The error object
 * @param defaultMessage Default message if error message cannot be extracted
 */
export const extractErrorMessage = (
  error: unknown,
  defaultMessage: string = 'An error occurred'
): string => {
  if (error instanceof Error) {
    return error.message;
  } else if (typeof error === 'string') {
    return error;
  } else if (error && typeof error === 'object') {
    if ('message' in error) {
      return (error as any).message;
    } else if ('error' in error) {
      return (error as any).error;
    } else if ('data' in error && typeof (error as any).data === 'object') {
      const data = (error as any).data;
      if ('message' in data) {
        return data.message;
      }
    }
  }
  return defaultMessage;
};

/**
 * Validates API response and handles errors
 * @param response API response object
 * @param successMessage Success message to show if operation was successful
 * @returns true if response is successful, false otherwise
 */
export const validateApiResponse = (
  response: any,
  successMessage?: string
): boolean => {
  if (!response) {
    handleApiError(new Error('No response from server'));
    return false;
  }

  // Check for error in response
  if (response.error || response.status === 'error' || !response.success) {
    const errorMsg = extractErrorMessage(response, response.message || 'Operation failed');
    toastError(errorMsg);
    return false;
  }

  if (successMessage) {
    toastSuccess(successMessage);
  }

  return true;
};
