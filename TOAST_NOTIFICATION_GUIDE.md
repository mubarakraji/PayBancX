# Toast Notification System

## Overview

The application now uses **Sonner** for toast notifications displayed at the **left-center** of the browser, replacing traditional error displays and alerts.

## Setup

The toast system is already configured in:
- **Provider**: `src/context/ToastContext.tsx` - Wraps the app with Sonner provider
- **Root Layout**: `src/app/layout.tsx` - Includes ToastProvider
- **Hook**: `src/hooks/useToast.ts` - Easy-to-use API for toasts

## Usage

### Method 1: Using the Hook (In Client Components)

```tsx
'use client';
import { useToast } from '@/hooks/useToast';

export function MyComponent() {
  const { showToast } = useToast();
  
  const handleClick = () => {
    showToast('Success!', 'success');
    showToast('Error occurred', 'error');
  };
  
  return <button onClick={handleClick}>Show Toast</button>;
}
```

### Method 2: Direct Function Calls (No Hook Needed)

```tsx
import { toastSuccess, toastError, toastWarning, toastInfo, toastLoading } from '@/hooks/useToast';

// Success toast
toastSuccess('Operation completed successfully');

// Error toast
toastError('Something went wrong');

// Warning toast
toastWarning('Please be careful');

// Info toast
toastInfo('FYI: Check your settings');

// Loading toast
toastLoading('Processing...');
```

### Method 3: With Options

```tsx
import { showToast } from '@/hooks/useToast';

showToast('Payment successful', 'success', {
  description: 'Your payment of ₦5,000 has been processed',
  duration: 5000, // Custom duration in ms
});
```

## API Error Handling

Use the `handleApiError` utility for consistent error handling:

```tsx
import { handleApiError } from '@/utils/apiErrorHandler';

try {
  const result = await fetchData();
} catch (err) {
  handleApiError(err, 'Failed to load data');
}
```

### Error Handling Utilities

**apiErrorHandler.ts** provides these functions:

- `handleApiError(error, defaultMessage, customMessage?)` - Extracts error and shows toast
- `handleApiSuccess(message, showToast?)` - Shows success toast
- `handleApiLoading(message?)` - Shows loading toast
- `extractErrorMessage(error, defaultMessage?)` - Just extracts message without showing toast
- `validateApiResponse(response, successMessage?)` - Validates response and shows appropriate toast

## Toast Types

| Type | Use Case |
|------|----------|
| `success` | Operation completed successfully |
| `error` | Something went wrong |
| `warning` | User should be aware of something |
| `info` | General information |
| `loading` | Long-running operation |

## Current Implementation Status

✅ **Completed:**
- Toast provider setup with left-center positioning
- AuthContext authentication toasts
- Home page balance and refresh toasts
- DepositModal error and success toasts
- Transactions page toasts
- Login page validation and error toasts
- API error handler utility

⏳ **To Complete (Follow Same Pattern):**
- Payment pages (airtime, data, electricity, TV, games, betting)
- Transfer pages (to-bank, to-qr)
- Settings pages
- Profile pages
- Other dashboard pages

## Pattern for Updating Pages

1. Import toast functions at the top:
```tsx
import { toastError, toastSuccess } from '@/hooks/useToast';
```

2. Remove error state if only used for display:
```tsx
// Before
const [error, setError] = useState<string | null>(null);

// After (optional - keep if validation needed)
```

3. Update API calls:
```tsx
// Before
try {
  const data = await fetchData();
} catch (err) {
  setError(err.message);
}

// After
try {
  const data = await fetchData();
  toastSuccess('Data loaded');
} catch (err) {
  toastError(err instanceof Error ? err.message : 'Failed to load');
}
```

4. Remove error display from JSX:
```tsx
// Remove these
{error && <div className="..."><p>{error}</p></div>}
```

## Toast Positioning

All toasts are configured to display at **top-right** of the browser:
- Position: `top-right` 
- Theme: `dark`
- Max visible: 5 toasts
- Auto-dismiss: 4 seconds (customizable per toast)

## Example: Complete Component Update

```tsx
'use client';

import { useState } from 'react';
import { toastError, toastSuccess } from '@/hooks/useToast';
import { fetchUserData } from '@/services/userService';

export function UserProfile() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadProfile = async () => {
    setIsLoading(true);
    try {
      const data = await fetchUserData();
      setUser(data);
      toastSuccess('Profile loaded successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load profile';
      toastError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleLoadProfile} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Load Profile'}
      </button>
    </div>
  );
}
```

## Troubleshooting

**Toasts not showing?**
- Ensure `ToastProvider` is in the root layout
- Component must be a client component (`'use client'`)
- Check browser console for errors

**Want to customize positioning?**
- Edit `src/context/ToastContext.tsx` and change `position` prop
- Available positions: `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right`, `center-left`, `center-center`, `center-right`

## Files Reference

- **Provider**: `src/context/ToastContext.tsx`
- **Hook**: `src/hooks/useToast.ts`
- **Error Handler**: `src/utils/apiErrorHandler.ts`
- **Root Layout**: `src/app/layout.tsx`
