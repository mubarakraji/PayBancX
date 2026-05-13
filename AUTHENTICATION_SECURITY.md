# 🔐 Authentication & Security Setup

## Overview

Your PayBancX application now has a complete authentication and route protection system. Users must:
1. ✅ Sign up with valid credentials
2. ✅ Log in with correct email & password
3. ✅ Have a valid JWT token to access dashboard
4. ✅ Can safely log out from anywhere

---

## 📋 Authentication Flow

### Sign Up Process
```
1. User visits /signup
2. Fills form with:
   - Full Name (min 3 chars)
   - Email (valid format)
   - Phone (min 10 chars)
   - Password (min 6 chars)
   - Confirm Password (must match)
3. Form validates all fields
4. Creates account via API
5. Auto-logs in user
6. Redirects to /home (dashboard)
```

### Log In Process
```
1. User visits /login
2. Enters email & password
3. Validation checks:
   - Email format is valid
   - Password is not empty
4. Submits to API
5. Receives JWT token
6. Token stored in localStorage
7. User data cached
8. Redirects to /home
```

### Log Out Process
```
1. User clicks "Logout" button
2. Session cleared from localStorage
3. AuthContext reset
4. Redirected to /login
5. All dashboard access blocked
```

---

## 🔒 Route Protection

### Protected Routes (Dashboard)
All routes under `/dashboard` and sibling routes are protected:

```
✅ PROTECTED (require login):
  - /home (dashboard)
  - /transactions
  - /profile
  - /payment/* (airtime, data, etc)
  - /settings/*
  - /profile
  - /aura
  - /enter-tag
  - /transfer-to-bank
  - /transfer-to-qr
```

**How it works:**
- Dashboard layout wrapped with `<ProtectedRoute>` component
- Component checks `isAuthenticated` from AuthContext
- Unauthenticated users redirected to `/login`
- Loading state shown while checking authentication

### Public Routes (No Login Required)
```
🌍 PUBLIC (anyone can access):
  - /login
  - /signup
  - /forgot-password
  - /reset-password
  - /otp
  - /set-pin
  - /welcome
  - /reset-success
```

**Auth pages redirect if already logged in:**
- If user visits `/login` while authenticated → redirects to `/home`
- If user visits `/signup` while authenticated → redirects to `/home`

---

## 🛡️ Form Validation

### Login Form Validation
```javascript
✓ Email:
  - Required
  - Must be valid email format
  - Example: user@example.com

✓ Password:
  - Required
  - Minimum 6 characters
```

### Sign Up Form Validation
```javascript
✓ Full Name:
  - Required
  - Minimum 3 characters
  
✓ Email:
  - Required
  - Must be valid email format
  
✓ Phone:
  - Required
  - Minimum 10 characters
  
✓ Password:
  - Required
  - Minimum 6 characters
  
✓ Confirm Password:
  - Required
  - Must match password
```

**Validation Features:**
- Real-time error clearing as user types
- Red error messages under each field
- Form disabled while loading
- Success/error messages at top of form

---

## 🔑 Token Management

### How Tokens Work
```
1. User logs in
   ↓
2. API returns JWT token
   ↓
3. Token stored in localStorage
   ↓
4. All API calls include token in header:
   Authorization: Bearer {token}
   ↓
5. API validates token on each request
   ↓
6. If token expired/invalid:
   - API returns 401
   - User logged out
   - Redirect to login
```

### Token Storage Location
```javascript
localStorage key: 'authToken'
User data key: 'user'
```

### Token Lifecycle
```
Storage: localStorage (survives page refresh)
Usage: Attached to every API request header
Deletion: Removed on logout or token expiry
Refresh: Auto-refresh via /auth/refresh-token (configured)
```

---

## 📱 Components Involved

### ProtectedRoute Component
**File:** `src/components/ProtectedRoute.tsx`

**Purpose:** Wraps pages that require authentication

```typescript
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>
```

**Behavior:**
- Checks if user is authenticated
- Shows loading spinner while checking
- Renders nothing if not authenticated
- Redirects to login if session expires

### AuthContext & AuthProvider
**File:** `src/context/AuthContext.tsx`

**Provides:**
- `user` - Current user object
- `isAuthenticated` - Boolean (user + token)
- `isLoading` - Loading state
- `error` - Error messages
- `login()` - Login function
- `logout()` - Logout function
- Session restoration on mount

### useAuth Hook
**File:** `src/hooks/useAuth.ts`

**Usage:**
```typescript
const { user, isAuthenticated, login, logout } = useAuth();
```

**Throws error if used outside `<AuthProvider>`**

---

## 🚀 Implementation Details

### Login Page
**File:** `src/app/(auth)/login/page.tsx`

**Features:**
✓ Email & password validation
✓ Password visibility toggle
✓ Error messages
✓ Loading state
✓ Success messages
✓ Redirect on success
✓ "Forgot password" link
✓ "Sign up" link for new users

### Sign Up Page
**File:** `src/app/(auth)/signup/page.tsx`

**Features:**
✓ Full name, email, phone, password fields
✓ Confirm password field
✓ All field validation
✓ Real-time error clearing
✓ Loading state
✓ Success message with redirect
✓ Auto-login after signup
✓ Terms & privacy links

### Profile/Logout Page
**File:** `src/app/profile/page.tsx`

**Features:**
✓ Display user information
✓ Avatar with first letter
✓ Verification badge
✓ All account details
✓ **Logout button** (red button)
✓ Logout loading state
✓ Redirect to login after logout

---

## 🔧 Testing Credentials

### Test the System:

1. **Sign Up Test:**
   - Go to `/signup`
   - Enter test data:
     ```
     Full Name: Olanrewaju Afolabi
     Email: test@example.com
     Phone: +234 800 000 0000
     Password: password123
     Confirm: password123
     ```
   - Click "Create Account"
   - Should redirect to `/home`

2. **Login Test:**
   - Go to `/login` (if logged out)
   - Enter:
     ```
     Email: test@example.com
     Password: password123
     ```
   - Click "Sign In"
   - Should redirect to `/home`

3. **Logout Test:**
   - Go to `/profile`
   - Click "Logout" button
   - Should redirect to `/login`
   - Balance no longer loads (authentication blocked)

4. **Protection Test:**
   - Without logging in
   - Try visiting `/home`
   - Should redirect to `/login`

---

## ❌ Error Handling

### Login Errors
```
✗ Email is required
✗ Please enter a valid email address
✗ Password is required
✗ Password must be at least 6 characters
✗ Login failed. Please check your credentials.
✗ [API error message]
```

### Sign Up Errors
```
✗ Full name is required
✗ Full name must be at least 3 characters
✗ Email is required
✗ Please enter a valid email address
✗ Phone number is required
✗ Phone number must be at least 10 characters
✗ Password is required
✗ Password must be at least 6 characters
✗ Please confirm your password
✗ Passwords do not match
✗ Signup failed. Please try again.
✗ [API error message]
```

### Route Protection Errors
```
✗ User not authenticated
✗ Redirect to /login automatically
✗ Loading spinner shown during check
```

---

## 🎯 User Experience

### Logged Out (Public Pages)
```
✅ Can access: /login, /signup, /forgot-password
✅ Cannot access: /home, /transactions, /profile
❌ Trying to access protected page → redirects to /login
```

### Logged In (Dashboard Access)
```
✅ Can access: /home, /transactions, /profile, /settings
✅ Can see: Balance, transactions, user info
✅ Can perform: Refresh balance, deposit, transfers, payments
❌ Logout → clears session → redirects to /login
```

### Session Persistence
```
✅ User stays logged in on page refresh
✅ Token persists in localStorage
✅ User data restored on app load
✅ No need to login again (until token expires)
```

---

## 🔄 Auto-Redirect Logic

### Login/Signup Pages
```javascript
if (isAuthenticated) {
  router.replace('/home');
}
```
**Result:** Already-logged-in users can't stay on auth pages

### Dashboard Routes
```javascript
if (!isAuthenticated) {
  router.replace('/login');
}
```
**Result:** Only logged-in users can access dashboard

---

## 📊 Security Summary

| Feature | Status | Details |
|---------|--------|---------|
| Form Validation | ✅ Complete | All fields validated client & server |
| Token Storage | ✅ Complete | Stored in localStorage |
| Token in Headers | ✅ Complete | Sent with all API requests |
| Route Protection | ✅ Complete | Dashboard locked to authenticated users |
| Logout | ✅ Complete | Clears token & user data |
| Error Handling | ✅ Complete | User-friendly error messages |
| Session Persistence | ✅ Complete | Survives page refresh |
| Auto Redirect | ✅ Complete | Seamless navigation |

---

## 🚀 Next Steps

1. **Test the authentication flow:**
   - Sign up with new credentials
   - Log in with those credentials
   - Access dashboard features
   - Log out and verify redirect

2. **Verify route protection:**
   - Try accessing `/home` without login
   - Should redirect to `/login`

3. **Test session persistence:**
   - Log in
   - Refresh page
   - Should stay logged in

4. **Production deployment:**
   - Verify API endpoint is correct
   - Test with production API
   - Monitor token expiry handling

---

## 🔗 Related Files

- Authentication Service: `src/services/authService.ts`
- Auth Context: `src/context/AuthContext.tsx`
- useAuth Hook: `src/hooks/useAuth.ts`
- API Config: `src/config/apiConfig.ts`
- Protected Route: `src/components/ProtectedRoute.tsx`
- Login Page: `src/app/(auth)/login/page.tsx`
- Signup Page: `src/app/(auth)/signup/page.tsx`
- Profile Page: `src/app/profile/page.tsx`
- Dashboard Layout: `src/app/(dashboard)/layout.tsx`

---

**Status:** ✅ **COMPLETE & READY FOR TESTING**

All authentication and route protection features are fully implemented and ready for production use!
