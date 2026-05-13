# Toast Notifications - Quick Reference

## 🚀 Most Common Usage Patterns

### Pattern 1: Simple Success Message
```tsx
import { toastSuccess } from '@/hooks/useToast';

toastSuccess('Operation completed!');
```

### Pattern 2: Simple Error Message
```tsx
import { toastError } from '@/hooks/useToast';

toastError('Something went wrong');
```

### Pattern 3: Async Operation with Toast
```tsx
'use client';
import { toastSuccess, toastError } from '@/hooks/useToast';

async function handleSubmit() {
  try {
    const result = await fetchData();
    toastSuccess('Data loaded successfully');
  } catch (err) {
    toastError(err instanceof Error ? err.message : 'Failed to load');
  }
}
```

### Pattern 4: API Call with Error Handling
```tsx
import { handleApiError, toastSuccess } from '@/utils/apiErrorHandler';

try {
  const result = await myApiCall();
  toastSuccess('Success!');
} catch (err) {
  handleApiError(err, 'Failed to complete operation');
}
```

### Pattern 5: Using the Hook (Alternative)
```tsx
'use client';
import { useToast } from '@/hooks/useToast';

export function MyComponent() {
  const { showToast } = useToast();
  
  return (
    <button onClick={() => showToast('Hello!', 'success')}>
      Click Me
    </button>
  );
}
```

## 📋 Toast Types

| Type | Function | When to Use |
|------|----------|------------|
| `success` | `toastSuccess()` | ✅ Operation completed |
| `error` | `toastError()` | ❌ Something failed |
| `warning` | `toastWarning()` | ⚠️ User should know about this |
| `info` | `toastInfo()` | ℹ️ General information |
| `loading` | `toastLoading()` | ⏳ Long-running operation |

## 🎯 Complete Example: Form Submission

```tsx
'use client';
import { useState } from 'react';
import { toastError, toastSuccess } from '@/hooks/useToast';
import { submitForm } from '@/services/formService';

export function MyForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const data = new FormData(e.currentTarget);
      const result = await submitForm(Object.fromEntries(data));
      
      toastSuccess('Form submitted successfully!');
      // Reset form or redirect
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit';
      toastError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
```

## 🔄 Replacing Old Error Display Code

### Before (Old Way)
```tsx
const [error, setError] = useState<string | null>(null);

try {
  const data = await fetchData();
} catch (err) {
  setError(err.message);
}

// In JSX
{error && <div className="error">{error}</div>}
```

### After (New Way with Toasts)
```tsx
import { toastError } from '@/hooks/useToast';

try {
  const data = await fetchData();
} catch (err) {
  toastError(err instanceof Error ? err.message : 'Failed');
}

// Remove error display from JSX entirely!
```

## 🎨 Options & Customization

### With Description
```tsx
toastSuccess('Payment complete', {
  description: 'Amount: ₦5,000.00'
});
```

### Custom Duration
```tsx
toastError('Connection lost', {
  duration: 5000 // 5 seconds instead of 4
});
```

### With Action Button
```tsx
toastWarning('Connection lost', {
  action: {
    label: 'Retry',
    onClick: () => retryFunction()
  }
});
```

## 📍 Toast Position

**Current**: Top-right corner
**To change**: Edit `src/context/ToastContext.tsx` line 15

Available positions:
- `top-left`, `top-center`, `top-right` (current)
- `center-left`, `center-center`, `center-right`  
- `bottom-left`, `bottom-center`, `bottom-right`

## ✅ Checklist for New Pages

When adding toasts to a new page:

- [ ] Import: `import { toastSuccess, toastError } from '@/hooks/useToast';`
- [ ] Replace `setError()` calls with `toastError()`
- [ ] Replace `setSuccess()` calls with `toastSuccess()`
- [ ] Remove error/success display JSX
- [ ] Add toasts for all user-facing operations
- [ ] Test: Try triggering error scenarios

## 🐛 Debugging

**Toasts not showing?**
1. Make sure it's a client component (`'use client'`)
2. Check that `ToastProvider` is in `src/app/layout.tsx`
3. Verify browser console for errors

**Need to see console logs too?**
- Keep `console.error()` for backend logging
- Use toasts for user-facing messages

## 📚 Full Documentation

For complete docs, see: `TOAST_NOTIFICATION_GUIDE.md`
For implementation status, see: `TOAST_IMPLEMENTATION_COMPLETE.md`
