// Helper utilities
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'NGN',
  }).format(amount);
}

/**
 * Normalize currency amount by removing all non-numeric characters except decimal point
 * Handles amounts that come with currency symbols, signs, or other formatting
 * Returns just the numeric value
 */
export function normalizeAmount(amount: any): number {
  if (typeof amount === 'number') {
    return Math.abs(amount);
  }
  if (typeof amount === 'string') {
    // Remove all non-numeric characters except decimal point and minus sign
    const cleaned = amount.replace(/[^\d.-]/g, '');
    const parsed = parseFloat(cleaned) || 0;
    return Math.abs(parsed); // Return absolute value (remove sign)
  }
  return 0;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Handle API errors and authentication failures
 * Redirects to login if authentication is required
 */
export function handleAuthError(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    // Check if it's an authentication error
    if (message.includes('authentication') || message.includes('unauthorized')) {
      // Redirect to login after a short delay
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      }
      return 'Authentication required. Please login again.';
    }
    
    return error.message;
  }
  
  return 'An error occurred. Please try again.';
}
