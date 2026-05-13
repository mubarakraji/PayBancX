# PayBancX Authentication Flow Guide

## Complete Authentication Journey Maps

### 1. NEW USER SIGNUP FLOW
```
Welcome Page (/welcome)
    ↓ [Get Started]
Signup Page (/signup) — "02 — Create Account"
    ↓ [Create Account]
OTP Verification (/otp) — "04 — Verify OTP"
    ↓ [Verify Code]
Set PIN Page (/set-pin) — "07 — Set Transaction PIN"
    ↓ [Set PIN & Continue]
Dashboard (/home)
```

### 2. RETURNING USER LOGIN FLOW
```
Welcome/Login Page
    ↓ [Sign In]
Login Page (/login) — "01 — Sign In"
    ├─ [Sign In] → Dashboard (/home)
    └─ [Forgot password?] → Forgot Password Page
```

### 3. PASSWORD RECOVERY FLOW
```
Login Page (/login)
    ↓ [Forgot password?]
Forgot Password Page (/forgot-password) — "03 — Reset Password"
    ↓ [Send Reset Link]
OTP Verification (/otp) — "04 — Verify OTP"
    ↓ [Verify Code]
Reset Password Page (/reset-password) — "05 — Reset Password"
    ↓ [Update Password]
Reset Success Page (/reset-success) — "06 — Reset Success"
    ↓ [Back to Login]
Login Page (/login)
```

---

## Page Details & Navigation Map

### Welcome Page `/welcome`
- **Purpose**: Landing page with platform overview
- **Status**: Public (no auth required)
- **Features**:
  - Platform introduction
  - Feature highlights
  - Call-to-action buttons
- **Navigation**:
  - [Sign In] → Login Page
  - [Get Started] → Signup Page
- **Icons**: MdPlayArrow, MdCheckCircle, MdMovie, MdMusicNote, MdVideogameAsset, MdWifi, MdDirectionsCar, MdTv, MdArrowForward
- **Design**: Green (#39FF14) accent, dark theme, grid background

---

### 01 — Sign In `/login`
- **Purpose**: Authenticate existing users
- **Status**: Public (no auth required)
- **Fields**:
  - Email address (MdEmail)
  - Password with visibility toggle (MdLock, MdRemoveRedEye)
- **Actions**:
  - [Sign In] → Dashboard
  - [Forgot password?] → Forgot Password Page
  - [Continue with Google] → Google OAuth
  - [Sign up] → Signup Page
- **Validation**:
  - Email format validation
  - Password required
- **Icons**: MdEmail, MdLock, MdRemoveRedEye, FcGoogle
- **Design**: Form with hidden password option, social login

---

### 02 — Create Account `/signup`
- **Purpose**: Register new users
- **Status**: Public (no auth required)
- **Fields**:
  - Full name (MdPerson)
  - Email address (MdEmail)
  - Phone number (MdPhone)
  - Password with strength indicator (MdLock, MdRemoveRedEye)
  - Confirm password (MdLock)
- **Feature Pills** (across top):
  - Instant Payments (MdElectricalServices)
  - Bank-level Security (MdSecurity)
  - Daily Rewards (MdCardGiftcard)
- **Actions**:
  - [Create Account] → OTP Verification
  - [Terms of Service] → Terms page (link)
  - [Privacy Policy] → Privacy page (link)
  - [Sign in] → Login Page
- **Validation**:
  - All fields required
  - Email format
  - Password strength (weak/fair/strong)
  - Password match validation
- **Icons**: MdPerson, MdEmail, MdPhone, MdLock, MdRemoveRedEye, MdElectricalServices, MdSecurity, MdCardGiftcard
- **Design**: Multi-step form, password strength bar

---

### 03 — Reset Password `/forgot-password`
- **Purpose**: Start password recovery process
- **Status**: Public (no auth required)
- **Features**:
  - Help icon badge (MdHelp)
  - Email/phone input
- **Fields**:
  - Email or phone number (MdEmail)
- **Actions**:
  - [Send Reset Link] → OTP Verification
  - [Back to login] → Login Page
  - [Back] → Login Page
- **Validation**:
  - Email or phone required
  - Format validation
- **Icons**: MdArrowBack, MdEmail, MdHelp
- **Design**: Icon badge, supportive messaging

---

### 04 — Verify OTP `/otp`
- **Purpose**: Verify phone/email with OTP code
- **Status**: Semi-public (requires previous action)
- **Features**:
  - 6-digit OTP input (auto-focus between fields)
  - Masked phone number display
  - Resend timer
- **Actions**:
  - [Verify Code] → Next page (Reset Password or Dashboard)
  - [Resend in XX:XX] → Resend OTP
  - [Change it] → Return to signup/forgot password
  - [Back] → Login Page
- **Validation**:
  - 6-digit numeric input
  - Real-time validation
- **Icons**: MdArrowBack
- **Design**: 
  - 6 input boxes (1 digit each)
  - Auto-focus on entry
  - Active state styling with green accent
  - Resend countdown timer

---

### 05 — Reset Password `/reset-password`
- **Purpose**: Create new password after verification
- **Status**: Protected (requires OTP verification)
- **Features**:
  - Lock icon badge (MdLock)
  - Password strength indicator
  - Password match validation
- **Fields**:
  - New password with strength bar (MdLock, MdRemoveRedEye)
  - Confirm new password (MdLock, MdRemoveRedEye or MdCheck)
- **Actions**:
  - [Update Password] → Reset Success Page
  - [Back] → Login Page
- **Validation**:
  - Passwords match
  - Password strength requirement
  - Min length requirement
- **Icons**: MdArrowBack, MdLock, MdRemoveRedEye, MdCheck
- **Design**: 
  - Password strength visualization (4 bars)
  - Green checkmark when passwords match
  - Strength labels (Weak/Fair/Strong)

---

### 06 — Reset Success `/reset-success`
- **Purpose**: Confirm successful password reset
- **Status**: Protected
- **Features**:
  - Success checkmark circle (MdCheck)
  - Success badge
  - Confirmation message
- **Actions**:
  - [Back to Login] → Login Page
- **Icons**: MdCheck
- **Design**: Large checkmark, success state styling

---

### 07 — Set Transaction PIN `/set-pin`
- **Purpose**: Configure 4-digit transaction PIN
- **Status**: Protected (part of signup)
- **Features**:
  - Two-step PIN setup:
    1. Enter 4-digit PIN
    2. Confirm PIN (re-enter)
  - Auto-focus between fields
  - Both PINs on same screen
- **Fields**:
  - Set PIN (4 digit inputs)
  - Confirm PIN (4 digit inputs)
- **Actions**:
  - [Set PIN & Continue] → Success message
  - [Skip for now] → Dashboard
  - [Go to Dashboard] → Dashboard (after success)
- **Validation**:
  - All 4 digits required
  - Both PINs match
  - Numeric only
- **Design**:
  - 4 large input boxes (password type)
  - Visual feedback on entry
  - Two-step display

---

## Component Architecture

### Core Auth Components
```
AuthLayout
├── AuthLogo
├── AuthButton
│   ├── variants: primary | outline
│   └── states: default | hover | active | disabled
├── AuthInput
│   ├── icon prop (left side)
│   ├── endIcon prop (right side)
│   └── password toggle support
└── FormGroup
    └── wraps AuthInput with label
```

### Styling System
```
Colors:
├── Primary: #39FF14 (electric green)
├── Background: #080d08 (dark)
├── Surface: #161f16 (dark surface)
├── Text: #e8f5e8 (light text)
└── Muted: #5a6e5a (muted text)

Typography:
├── Headers: Syne (font-family)
├── Body: DM_Sans (font-family)
└── Weights: regular, medium, bold

Borders & Spacing:
├── Border radius: 3, 3.5, 4.5 (rounded values)
├── Borders: rgba(255,255,255,0.07) — subtle dividers
└── Spacing: Tailwind standard + custom values
```

---

## Complete Icon Mapping

### Material Design Icons Used (react-icons/md)
- **Navigation**: MdArrowBack, MdArrowForward
- **Auth**: MdEmail, MdLock, MdRemoveRedEye, MdCheck, MdCheckCircle
- **User**: MdPerson, MdPhone
- **Status**: MdHelp
- **Media**: MdPlayArrow, MdMovie, MdMusicNote, MdVideogameAsset, MdWifi, MdDirectionsCar, MdTv
- **Features**: MdElectricalServices, MdSecurity, MdCardGiftcard

### Third-Party Icons
- **Google**: FcGoogle (for OAuth)

---

## Authentication Flow State Management

### AuthContext Properties
```typescript
{
  user: User | null                    // Current user data
  isLoading: boolean                   // Request in progress
  isAuthenticated: boolean             // User logged in
  error: string | null                 // Error messages
  
  // Methods
  login()                              // Login user
  signup()                             // Create account
  logout()                             // Sign out
  resetPassword()                      // Request password reset
  verifyOTP()                          // Verify OTP code
  setTransactionPIN()                  // Set 4-digit PIN
  clearError()                         // Clear error messages
}
```

### API Endpoints Required
```
POST /api/auth/login              = Login user
POST /api/auth/signup             = Create new account
POST /api/auth/logout             = Sign out
POST /api/auth/forgot-password    = Request password reset
POST /api/auth/verify-otp         = Verify OTP
POST /api/auth/reset-password     = Reset password
POST /api/auth/set-pin            = Set transaction PIN
GET  /api/auth/me                 = Get current user
POST /api/auth/refresh            = Refresh token
```

---

## Design System Consistency

### Page Label Format
All auth pages display a label in the format: `## — [Page Name]`
- 01 — Sign In
- 02 — Create Account
- 03 — Reset Password
- 04 — Verify OTP
- 05 — Reset Password
- 06 — Reset Success
- 07 — Set Transaction PIN

### Button Styles
- **Primary**: Bright green (#39FF14), full width, bold
- **Outline**: Transparent with border, white text, full width
- **Hover**: Opacity decrease, slight scale offset
- **Disabled**: Reduced opacity, not-allowed cursor

### Input Field Styling
- **Idle**: Dark surface, subtle border
- **Focus**: Green-tinted border, slight background tint
- **Active**: Icon changes color on interaction
- **Error**: Border color changes (if implemented)

### Responsive Design
- **Desktop**: Phone mockup container (375px width)
- **Mobile**: Full-width layout
- **Tablet**: Intermediate scaling

---

## Best Practices for Auth Pages

1. **Always use AuthLayout** for consistent frame/background
2. **Include page label** in AuthLayout for desktop identification
3. **Use Material Design icons** (MdXxx from react-icons/md)
4. **Validate on input change** (not just on submit)
5. **Show clear error messages** via AuthContext.error
6. **Use loading states** during API calls (isLoading)
7. **Provide navigation links** at page bottom
8. **Support keyboard navigation** (Tab, Enter)
9. **Auto-focus inputs** (especially OTP/PIN fields)
10. **Clear form on success** and navigate to next page

---

## Session Management Flow

```
User Visits → Check Auth Status
             ├─ Authenticated → Dashboard
             └─ Not Authenticated → Welcome Page
                    ├─ [Sign In] → Login Flow
                    └─ [Get Started] → Signup Flow

After Login/Signup:
├─ Session established
├─ Auth token stored (localStorage/cookie)
├─ User data in AuthContext
└─ Auto-refresh on token expiry
```

---

## Testing Checklist

- [ ] All navigation links work
- [ ] Form validation works on all pages
- [ ] Password strength indicator displays correctly
- [ ] OTP auto-focus works (input to input)
- [ ] PIN entry works (4 digits, password masked)
- [ ] Error messages display properly
- [ ] Loading states show during API calls
- [ ] Icons all render correctly (Material Design)
- [ ] Mobile responsive works
- [ ] Desktop phone mockup displays
- [ ] Terms/Privacy links work
- [ ] Back buttons navigate correctly
- [ ] Keyboard navigation works (Tab, Enter)
- [ ] Password visibility toggle works
- [ ] PIN confirmation validation works

---

## Quick Reference: Page Navigation Map

```
/welcome ..................... Welcome/Landing
  ├─ Sign In → /login ......... 01 — Sign In
  │   ├─ Forgot password → /forgot-password ... 03
  │   └─ Sign up → /signup .... 02
  │
  └─ Get Started → /signup .... 02 — Create Account
      ├─ Sign in → /login .... 01
      └─ → /otp .............. 04 — Verify OTP
          ├─ → /set-pin ...... 07 — Set PIN
          │   └─ → /dashboard/home
          └─ Change it → /signup

/forgot-password .............. 03 — Reset Password
  ├─ Send Reset Link → /otp ... 04
  │   ├─ → /reset-password ... 05
  │   │   └─ → /reset-success  06
  │   │       └─ → /login ..... 01
  │   └─ Change it → /login ... 01
  └─ Back to login → /login ... 01

/otp ......................... 04 — Verify OTP
  ├─ [in signup flow] → /set-pin ... 07
  ├─ [in reset flow] → /reset-password ... 05
  ├─ Resend Code (timer)
  └─ Change it → /signup or /forgot-password
```

