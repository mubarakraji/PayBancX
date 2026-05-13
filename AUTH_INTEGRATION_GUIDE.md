# PayBancX Authentication Integration Guide

Complete guide for integrating and using the PayBancX authentication system.

---

## Quick Setup

### 1. Wrap Your App with AuthProvider

In `src/app/layout.tsx`:

```tsx
import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

---

## Using Authentication

### Access Auth State with useAuth Hook

```tsx
'use client';

import { useAuth } from '@/hooks/useAuth';

export default function MyComponent() {
  const { 
    user,                  // Current logged-in user
    isLoading,            // Request in progress
    isAuthenticated,      // User is logged in
    error,                // Error message
    login,                // Login function
    logout,               // Logout function
    clearError,           // Clear error message
  } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.fullName}!</p>
          <button onClick={() => logout()}>Logout</button>
        </div>
      ) : (
        <p>Please log in</p>
      )}
      
      {error && (
        <div>
          <p style={{ color: 'red' }}>{error}</p>
          <button onClick={clearError}>Dismiss</button>
        </div>
      )}
    </div>
  );
}
```

---

## Authentication Methods

### 1. User Login

```tsx
const { login, isLoading, error } = useAuth();

const handleLogin = async () => {
  try {
    await login('user@example.com', 'password123');
    // User logged in, redirect to dashboard
  } catch (err) {
    // Error handled in context (check `error` state)
    console.error(err);
  }
};

<button onClick={handleLogin} disabled={isLoading}>
  {isLoading ? 'Signing in...' : 'Sign In'}
</button>
```

### 2. User Signup

```tsx
const { signup, isLoading, error } = useAuth();

const handleSignup = async () => {
  try {
    await signup({
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '+234 800 000 0000',
      password: 'SecurePassword123!',
      confirmPassword: 'SecurePassword123!',
    });
    // New account created, proceed to OTP verification
  } catch (err) {
    console.error(err);
  }
};
```

### 3. Password Reset Request

```tsx
const { resetPassword, isLoading, error } = useAuth();

const handleForgotPassword = async () => {
  try {
    await resetPassword('user@example.com');
    // Reset link sent, proceed to OTP verification
  } catch (err) {
    console.error(err);
  }
};
```

### 4. OTP Verification

```tsx
const { verifyOTP, isLoading, error } = useAuth();

const handleVerifyOTP = async (otpCode: string) => {
  try {
    await verifyOTP(otpCode);
    // OTP verified successfully
  } catch (err) {
    console.error(err);
  }
};
```

### 5. Set Transaction PIN

```tsx
const { setTransactionPIN, isLoading, error } = useAuth();

const handleSetPIN = async (pin: string) => {
  try {
    await setTransactionPIN(pin);
    // PIN set successfully
  } catch (err) {
    console.error(err);
  }
};
```

### 6. User Logout

```tsx
const { logout, isLoading } = useAuth();

const handleLogout = async () => {
  try {
    await logout();
    // User logged out, redirect to login
  } catch (err) {
    console.error(err);
  }
};

<button onClick={handleLogout} disabled={isLoading}>
  {isLoading ? 'Signing out...' : 'Logout'}
</button>
```

---

## Protected Routes

### Protect a Route Component

```tsx
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div>
      <h1>Protected Content</h1>
      {/* Your protected content here */}
    </div>
  );
}
```

### Create a Reusable ProtectedRoute Component

```tsx
// src/components/ProtectedRoute.tsx
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, redirectTo, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
```

Usage:

```tsx
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <h1>Dashboard</h1>
      {/* Dashboard content */}
    </ProtectedRoute>
  );
}
```

---

## Using Auth Service Directly (Optional)

For more control, you can use the auth service directly:

```tsx
import { loginUser, signupUser, resetPassword } from '@/services/authService';

// Direct login
const handleLogin = async () => {
  try {
    const response = await loginUser('user@example.com', 'password');
    console.log('Login successful:', response);
  } catch (error) {
    console.error('Login failed:', error);
  }
};

// Direct signup
const handleSignup = async () => {
  try {
    const response = await signupUser({
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '+234 800 000 0000',
      password: 'SecurePassword123!',
    });
    console.log('Signup successful:', response);
  } catch (error) {
    console.error('Signup failed:', error);
  }
};
```

---

## Error Handling

### Display Errors from Context

```tsx
import { useAuth } from '@/hooks/useAuth';

export default function LoginForm() {
  const { login, error, clearError, isLoading } = useAuth();

  const handleSubmit = async (formData: any) => {
    try {
      await login(formData.email, formData.password);
    } catch (err) {
      // Error already in context.error
    }
  };

  return (
    <form>
      {error && (
        <div style={{ 
          color: 'red', 
          padding: '10px', 
          marginBottom: '10px',
          backgroundColor: 'rgba(255,0,0,0.1)',
          borderRadius: '4px'
        }}>
          <p>{error}</p>
          <button type="button" onClick={clearError}>
            Dismiss
          </button>
        </div>
      )}
      
      {/* Form fields */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Submit'}
      </button>
    </form>
  );
}
```

---

## User Data

### Accessing Current User Information

```tsx
import { useAuth } from '@/hooks/useAuth';

export default function UserProfile() {
  const { user } = useAuth();

  if (!user) return <p>Not logged in</p>;

  return (
    <div>
      <h2>{user.fullName}</h2>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone}</p>
      <p>ID: {user.id}</p>
      <p>Verified: {user.verified ? '✓' : '✗'}</p>
    </div>
  );
}
```

### User Type Definition

```typescript
interface User {
  id?: string;
  fullName?: string;
  email: string;
  phone?: string;
  avatar?: string;
  verified?: boolean;
}
```

---

## Loading States

### Show Loading Indicators

```tsx
import { useAuth } from '@/hooks/useAuth';

export default function LoginButton() {
  const { login, isLoading, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <p>Already logged in</p>;
  }

  return (
    <button 
      onClick={() => login('user@example.com', 'password')}
      disabled={isLoading}
      style={{
        opacity: isLoading ? 0.6 : 1,
        cursor: isLoading ? 'not-allowed' : 'pointer',
      }}
    >
      {isLoading ? (
        <>
          <span className="spinner" /> Signing in...
        </>
      ) : (
        'Sign In'
      )}
    </button>
  );
}
```

---

## API Integration

### Backend Endpoints Required

Your backend should implement these endpoints:

#### POST `/api/auth/login`
```json
Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "user": {
    "id": "123",
    "email": "user@example.com",
    "fullName": "John Doe",
    "phone": "+234 800 0000000",
    "verified": true
  },
  "token": "jwt_token_here"
}
```

#### POST `/api/auth/signup`
```json
Request:
{
  "fullName": "John Doe",
  "email": "user@example.com",
  "phone": "+234 800 0000000",
  "password": "SecurePass123!"
}

Response:
{
  "success": true,
  "user": { ... },
  "token": "jwt_token_here"
}
```

#### POST `/api/auth/forgot-password`
```json
Request:
{
  "email": "user@example.com"
}

Response:
{
  "success": true,
  "message": "Reset link sent to email"
}
```

#### POST `/api/auth/verify-otp`
```json
Request:
{
  "otp": "123456"
}

Response:
{
  "success": true,
  "verified": true
}
```

#### POST `/api/auth/reset-password`
```json
Request:
{
  "token": "reset_token",
  "newPassword": "NewSecurePass123!"
}

Response:
{
  "success": true,
  "message": "Password reset successfully"
}
```

#### POST `/api/auth/set-pin`
```json
Request:
{
  "pin": "1234"
}

Response:
{
  "success": true,
  "message": "PIN set successfully"
}
```

#### POST `/api/auth/logout`
```json
Response:
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### GET `/api/auth/me`
```json
Response:
{
  "success": true,
  "user": { ... }
}
```

#### POST `/api/auth/refresh`
```json
Response:
{
  "success": true,
  "token": "new_jwt_token"
}
```

---

## Best Practices

### 1. Always Use useAuth in Client Components

```tsx
'use client';  // ← Required!

import { useAuth } from '@/hooks/useAuth';

export default function Component() {
  const { isAuthenticated } = useAuth();
  // ...
}
```

### 2. Handle Loading States

```tsx
if (isLoading) return <LoadingSpinner />;
```

### 3. Clear Errors After Displaying

```tsx
const handleRetry = () => {
  clearError();
  // Retry operation
};
```

### 4. Validate Form Data Before Submission

```tsx
const validateForm = (formData: any): boolean => {
  if (!formData.email || !formData.password) {
    return false;
  }
  if (!formData.email.includes('@')) {
    return false;
  }
  return true;
};
```

### 5. Redirect After Successful Auth

```tsx
const router = useRouter();

const handleLogin = async (email: string, password: string) => {
  try {
    await login(email, password);
    router.push('/dashboard/home');
  } catch (err) {
    // Error shown in UI
  }
};
```

### 6. Prevent Re-render Loops in Protected Routes

```tsx
useEffect(() => {
  if (!isLoading && !isAuthenticated) {
    router.push('/login');
  }
}, [isAuthenticated, isLoading]);  // ← Include all dependencies
```

---

## Testing Authentication Pages

### Manual Testing Checklist

- [ ] Can navigate between all auth pages
- [ ] Links work (Sign in, Sign up, Forgot password, Back buttons)
- [ ] Form validation shows errors
- [ ] Password visibility toggle works
- [ ] OTP auto-focus between fields works
- [ ] PIN entry works (4 digits, masked)
- [ ] Loading states display during requests
- [ ] Error messages appear from API
- [ ] Success pages display correctly
- [ ] Redirects after successful auth work
- [ ] Mobile responsive layout works
- [ ] Keyboard navigation works (Tab, Enter)
- [ ] Icons render correctly

---

## Common Issues & Solutions

### Issue: "useAuth must be used within AuthProvider"

**Solution**: Make sure your component tree is wrapped with `<AuthProvider>`:

```tsx
// In layout.tsx
<AuthProvider>
  {children}
</AuthProvider>
```

### Issue: User state not persisting on page refresh

**Solution**: Add localStorage/sessionStorage persistence to AuthContext:

```tsx
useEffect(() => {
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    setUser(JSON.parse(savedUser));
  }
}, []);

useEffect(() => {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  }
}, [user]);
```

### Issue: API endpoints not found (404)

**Solution**: Ensure your backend has all required `/api/auth/*` endpoints implemented.

---

## Next Steps

1. ✅ Implement auth service API endpoints in your backend
2. ✅ Test all authentication flows manually
3. ✅ Add form validation to auth pages
4. ✅ Implement error handling UI
5. ✅ Add loading spinner component
6. ✅ Protect dashboard routes
7. ✅ Set up session persistence
8. ✅ Add remember me functionality (optional)
9. ✅ Implement 2FA (optional)
10. ✅ Add biometric authentication (optional)

---

## Support

For issues or questions:
- Check the `AUTH_FLOW.md` for page flow details
- Review auth pages in `/src/app/(auth)/`
- Check auth components in `/src/components/auth/`
- Review the AuthContext in `/src/context/AuthContext.tsx`
- Check auth service in `/src/services/authService.ts`

