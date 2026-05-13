# PayBancX Authentication System - Professional Guide

## Overview

This document describes the complete authentication system for the PayBancX application. The system handles user registration, login, password reset, email/phone verification, and transaction PIN setup.

---

## Architecture

### Components

```
┌─────────────────────────────────────────────────┐
│          Authentication Pages (UI)               │
│  - Login, Signup, Forgot Password, Reset Password│
│  - OTP Verification, Set PIN                     │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│          Auth Context (State Management)         │
│  - User state, authentication status             │
│  - Login/Signup/Logout methods                   │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│          Auth Service (API Layer)                │
│  - loginUser, signupUser, resetPassword, etc.   │
│  - Handles token storage and retrieval           │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│          API Routes (Proxy Layer)                │
│  - /api/auth/login, /signup, /forgot-password   │
│  - Proxies requests to backend                  │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│          Backend API                             │
│  - pb-production-fd26.up.railway.app/api/v1     │
└─────────────────────────────────────────────────┘
```

---

## Authentication Flow

### 1. User Registration (Signup)

```
User fills signup form
    ↓
Client validates form (name, email, phone, password)
    ↓
POST /api/auth/signup
    ↓
Backend creates account, returns user + token
    ↓
Client stores token in localStorage (key: 'authToken')
    ↓
Client stores user object in localStorage (key: 'user')
    ↓
Auth Context updates: isAuthenticated = true
    ↓
useEffect detects isAuthenticated = true
    ↓
Redirect to /home (dashboard)
```

**Validation Rules:**
- Full Name: Min 3 characters
- Email: Valid email format (must be unique on backend)
- Phone: Min 10 characters
- Password: Min 8 chars, 1 number, 1 special character (!@#$%^&*)

**Files:**
- [src/app/(auth)/signup/page.tsx](src/app/(auth)/signup/page.tsx) - UI
- [src/services/authService.ts](src/services/authService.ts) - `signupUser()`
- [src/app/api/auth/signup/route.ts](src/app/api/auth/signup/route.ts) - API proxy

---

### 2. User Login

```
User enters email + password
    ↓
Client validates form
    ↓
POST /api/auth/login
    ↓
Backend verifies credentials, returns user + token
    ↓
Client stores token (localStorage key: 'authToken')
    ↓
Client stores user (localStorage key: 'user')
    ↓
Auth Context: isAuthenticated = true
    ↓
Redirect to /home
```

**Validation Rules:**
- Email: Valid email format
- Password: Min 6 characters

**Files:**
- [src/app/(auth)/login/page.tsx](src/app/(auth)/login/page.tsx) - UI
- [src/services/authService.ts](src/services/authService.ts) - `loginUser()`
- [src/app/api/auth/login/route.ts](src/app/api/auth/login/route.ts) - API proxy

---

### 3. Forgot Password

```
User enters email/phone
    ↓
POST /api/auth/forgot-password
    ↓
Backend sends reset link via email/SMS
    ↓
User receives email with reset link
    ↓
User clicks link: /reset-password?token=xyz
```

**Files:**
- [src/app/(auth)/forgot-password/page.tsx](src/app/(auth)/forgot-password/page.tsx) - UI
- [src/services/authService.ts](src/services/authService.ts) - `requestPasswordReset()`
- [src/app/api/auth/forgot-password/route.ts](src/app/api/auth/forgot-password/route.ts) - API proxy

---

### 4. Reset Password

```
User navigates to /reset-password?token=xyz
    ↓
User enters new password + confirmation
    ↓
POST /api/auth/reset-password with token
    ↓
Backend validates token, updates password
    ↓
Redirect to /login
    ↓
User logs in with new password
```

**Validation Rules:**
- New Password: Min 8 chars, 1 number, 1 special character
- Token: Must be valid (from email link)

**Files:**
- [src/app/(auth)/reset-password/page.tsx](src/app/(auth)/reset-password/page.tsx) - UI
- [src/app/api/auth/reset-password/route.ts](src/app/api/auth/reset-password/route.ts) - API proxy

---

### 5. OTP Verification (Phone/Email)

```
User enters 6 digit OTP
    ↓
POST /api/auth/verify-otp
    ↓
Backend validates OTP code
    ↓
If valid: Account verified
    ↓
Redirect to /set-pin
```

**Features:**
- Auto-focus next field on digit entry
- Numeric input only
- Resend OTP button with 45-second timer
- Backspace support for navigation

**Files:**
- [src/app/(auth)/otp/page.tsx](src/app/(auth)/otp/page.tsx) - UI
- [src/services/authService.ts](src/services/authService.ts) - `verifyOTP()`
- [src/app/api/auth/verify-otp/route.ts](src/app/api/auth/verify-otp/route.ts) - API proxy

---

### 6. Transaction PIN Setup

```
After signup/verification, user sets 4-digit PIN
    ↓
POST /api/auth/set-pin
    ↓
Backend stores PIN (hashed)
    ↓
Redirect to /home
```

**Files:**
- [src/app/(auth)/set-pin/page.tsx](src/app/(auth)/set-pin/page.tsx) - UI
- [src/services/authService.ts](src/services/authService.ts) - `setTransactionPIN()`

---

## State Management (Auth Context)

### Location
[src/context/AuthContext.tsx](src/context/AuthContext.tsx)

### State Variables
```typescript
{
  user: User | null;              // Current logged-in user
  isLoading: boolean;              // Loading state during auth operations
  isAuthenticated: boolean;        // True if user has valid token
  error: string | null;            // Error message (if any)
}
```

### Methods

#### `login(email: string, password: string): Promise<void>`
Authenticates user with credentials.

#### `signup(userData): Promise<void>`
Creates new user account.

#### `logout(): Promise<void>`
Logs out current user and clears token.

#### `resetPassword(email: string): Promise<void>`
Sends password reset link.

#### `verifyOTP(otp: string): Promise<void>`
Verifies one-time password.

#### `setTransactionPIN(pin: string): Promise<void>`
Sets user's transaction PIN.

#### `fetchProfile(): Promise<void>`
Fetches latest user profile from backend.

---

## Token Management

### Storage
- **Method:** localStorage (key: `authToken`)
- **Format:** Bearer token (JWT recommended)
- **Scope:** Accessible to all frontend code
- **Expiration:** Handled by backend (send 401 on expired)

### Usage
```typescript
// Automatic - included in all auth headers
const headers = getAuthHeaders();
// Returns: { 'Authorization': 'Bearer <token>' }
```

### Functions
- `getAuthToken()` - Retrieve token from localStorage
- `setAuthToken(token)` - Store token in localStorage
- `removeAuthToken()` - Clear token and user data

---

## Route Protection

### Protected Routes
All routes under `src/app/(dashboard)/` are protected by the `ProtectedRoute` component.

```typescript
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

### How it Works
1. Component checks `isAuthenticated` from Auth Context
2. If not authenticated: redirects to `/login`
3. If loading: shows loading spinner
4. If authenticated: renders children

**Files:**
- [src/components/ProtectedRoute.tsx](src/components/ProtectedRoute.tsx)

---

## Error Handling

### Login/Signup Errors
- Invalid credentials → "Login failed. Please check your credentials."
- Server error → Display server message
- Network error → "Network error. Please try again."

### Validation Errors
- Displayed below each form field
- Clear when user starts typing
- Block form submission until valid

### Error States
- `auth.error` - Auth context error
- `error` - Component-level error
- `validationErrors` - Form field-specific errors

---

## Password Requirements

### Signup/Reset Password
- Minimum 8 characters
- At least 1 number (0-9)
- At least 1 special character (!@#$%^&*)

### Password strength indicator
Shows visual feedback (4-point scale) during password entry.

---

## Security Considerations

### ✅ Implemented
- Password validation on client AND server
- Token-based authentication
- Protected routes with client-side checks
- Form validation before submission
- Error messages don't reveal sensitive info

### ⚠️ Future Improvements
- [ ] httpOnly cookies instead of localStorage (XSS protection)
- [ ] CSRF token validation
- [ ] Rate limiting on auth endpoints
- [ ] 2FA (Two-factor authentication)
- [ ] Account lockout after failed attempts
- [ ] Token refresh mechanism
- [ ] Server-side middleware for route protection
- [ ] Email verification before account activation

---

## API Endpoints

### Base URL
`https://pb-production-fd26.up.railway.app/api/v1`

### Authentication Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/register` | POST | Create new account |
| `/auth/login` | POST | Login with credentials |
| `/auth/forgot-password` | POST | Request password reset |
| `/auth/reset-password` | POST | Reset password with token |
| `/auth/verify-otp` | POST | Verify OTP code |
| `/auth/resend-otp` | POST | Resend OTP |
| `/auth/set-pin` | POST | Set transaction PIN |
| `/auth/profile` | GET | Get current user profile |
| `/auth/change-password` | POST | Change password |
| `/auth/refresh-token` | POST | Refresh auth token |

---

## Configuration

### Environment Variables

```bash
# .env or .env.local
NEXT_PUBLIC_API_BASE_URL=https://pb-production-fd26.up.railway.app/api/v1
```

If not set, defaults to the production URL in the code.

---

## Debugging

### Common Issues

**1. "Login successful" but not redirecting**
- Check if token is being stored: `localStorage.getItem('authToken')`
- Check if Auth Context is properly initialized
- Verify useEffect dependencies

**2. User data not loading**
- Check if user object is in localStorage: `localStorage.getItem('user')`
- Verify API response includes `data.user`
- Check browser console for errors

**3. Token inconsistency**
- Verify token key is consistent: always use 'authToken'
- Check getAuthHeaders() is used for all authenticated requests

**4. OTP not working**
- Ensure numeric input only
- Verify 6 digits entered
- Check resend timer logic

### Debug Tips
```javascript
// Check auth state
localStorage.getItem('authToken')
localStorage.getItem('user')

// Monitor auth context
const { isAuthenticated, isLoading, user, error } = useAuth();
console.log({ isAuthenticated, isLoading, user, error });

// Check network requests
// Open DevTools → Network tab → Filter by "auth"
```

---

## Testing Authentication

### Test Credentials
```
Email: test@example.com
Password: Test@12345
```

*Note: Use valid credentials from your backend*

### Manual Test Flow
1. **Signup**: Create new account → OTP verification → Set PIN → Dashboard
2. **Login**: Use existing credentials → Dashboard
3. **Forgot Password**: Request reset → Check email → Reset password → Login
4. **Protected Routes**: Try accessing `/profile` without login → Should redirect to `/login`

---

## File Structure

```
src/
├── app/
│   ├── (auth)/                    # Authentication pages
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   ├── reset-password/page.tsx
│   │   ├── otp/page.tsx
│   │   └── set-pin/page.tsx
│   │
│   ├── (dashboard)/               # Protected pages
│   │   ├── layout.tsx             # Uses ProtectedRoute
│   │   ├── home/page.tsx
│   │   ├── profile/page.tsx
│   │   └── ...
│   │
│   └── api/auth/                  # API proxy routes
│       ├── login/route.ts
│       ├── signup/route.ts
│       ├── forgot-password/route.ts
│       ├── reset-password/route.ts
│       ├── verify-otp/route.ts
│       └── profile/route.ts
│
├── components/
│   ├── auth/                      # Auth UI components
│   │   ├── AuthLayout.tsx
│   │   ├── AuthButton.tsx
│   │   ├── AuthInput.tsx
│   │   └── AuthLogo.tsx
│   │
│   └── ProtectedRoute.tsx         # Route protection
│
├── context/
│   └── AuthContext.tsx            # Auth state management
│
├── hooks/
│   └── useAuth.ts                 # Auth context hook
│
├── services/
│   └── authService.ts             # Auth API methods
│
└── config/
    └── apiConfig.ts               # API configuration
```

---

## Maintenance & Updates

### When Adding New Auth Features
1. Add endpoint to `API_ENDPOINTS.AUTH` in [apiConfig.ts](src/config/apiConfig.ts)
2. Add method to [authService.ts](src/services/authService.ts)
3. Create/update API proxy route in `src/app/api/auth/`
4. Create/update auth page in `src/app/(auth)/`
5. Update Auth Context if new state needed
6. Add tests

### Version History
- **v1.0** - Initial setup (Login, Signup, Password Reset, OTP)

---

## Support & Contact

For issues or questions about the authentication system:
1. Check this guide first
2. Review comments in [AuthContext.tsx](src/context/AuthContext.tsx)
3. Check browser console for errors
4. Contact: [your contact info]

---

**Last Updated:** April 20, 2026
**Maintained By:** Development Team
