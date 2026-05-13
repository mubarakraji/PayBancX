# 🗺️ PayBancX Authentication - Complete Navigation Map

Visual guide showing how all authentication pages connect together.

---

## 🎨 Complete User Journey Flows

### Flow 1: New User → Sign Up → Dashboard

```
                          ┌─────────────────────┐
                          │   WELCOME PAGE      │
                          │  Landing/Overview   │
                          └──────────┬──────────┘
                                     │
                    ┌────────────────┴────────────────┐
                    │                                 │
                    ▼                                 ▼
           ┌──────────────────┐          ┌──────────────────┐
           │   Login Page     │          │  Signup Page     │
           │  01 — Sign In    │          │ 02 — Create Acct │
           └────────┬─────────┘          └──────────┬───────┘
                    │                               │
                    │ [Already have account]        │ [Create Account]
                    │ [Forgot password?]            │
                    ▼                               ▼
           ┌──────────────────┐          ┌──────────────────┐
           │  Reset Password  │          │  OTP Verify      │
           │ 03 — Forgot Pass │          │ 04 — Verify OTP  │
           └────────┬─────────┘          └──────────┬───────┘
                    │                               │
                    │ [Send Reset Link]            │ [Verify Code]
                    ▼                               ▼
           ┌──────────────────┐          ┌──────────────────┐
           │  OTP Verify      │          │   Set Trans PIN  │
           │ 04 — Verify OTP  │          │ 07 — Set PIN 🔢  │
           └────────┬─────────┘          └──────────┬───────┘
                    │                               │
                    │ [Verify Code]                 │ [Set PIN]
                    ▼                               ▼
           ┌──────────────────┐          ┌──────────────────┐
           │  Reset Password  │          │  Reset Success   │
           │ 05 — Create New  │          │ 06 — PIN Set ✓   │
           └────────┬─────────┘          └──────────┬───────┘
                    │                               │
                    │ [Update Password]             │ [Go to Dashboard]
                    ▼                               ▼
           ┌──────────────────┐          ┌──────────────────┐
           │  Reset Success   │          │   DASHBOARD      │
           │ 06 — Done ✓      │          │   /home          │
           └────────┬─────────┘          └──────────────────┘
                    │
                    │ [Back to Login]
                    ▼
           ┌──────────────────┐
           │    Login Page    │ ◄─────────────┐
           │  01 — Sign In    │              │
           └────────┬─────────┘              │
                    │                       │
                    │ [Sign In]             │
                    ▼                       │
           ┌──────────────────┐             │
           │   DASHBOARD      │             │
           │   /home ✓        │             │
           └──────────────────┘             │
                                            │
                    [Skip for now]──────────┘
```

---

## 🎯 Page Navigation Network

```
                              ┌──────────────┐
                              │   WELCOME    │ (Landing)
                              │  /welcome    │
                              └──────┬───────┘
                                     │
        ┌────────────────────────────┼────────────────────────────┐
        │                            │                            │
        │                            │                            │
        ▼ [Sign In]                  ▼ [Get Started]            ▼ [Log In]
        
    ┌─────────────────┐         ┌─────────────────┐       (Same as left)
    │   LOGIN PAGE    │◄────────│  SIGNUP PAGE    │
    │ 01 — Sign In    │ [Sign   │ 02 — Create     │
    │    /login       │  in]    │    Acct         │
    └────────┬────────┘         │   /signup       │
             │                  └────────┬────────┘
             │                           │
    [Sign In Success]          [Create Account]
    [Already has Account]              │
             │                          │
             │                          ▼
             │                  ┌─────────────────┐
             │                  │  OTP VERIFY     │
             │                  │ 04 — Verify OTP │
             │                  │     /otp        │
             │                  └────────┬────────┘
             │                           │
             │              [Verify Code / Change Number]
             │                           │
             │                           ▼
             │                  ┌─────────────────┐
             │                  │   SET PIN PAGE  │
             │                  │ 07 — Set PIN    │
             │                  │  /set-pin       │
             │                  └────────┬────────┘
             │                           │
             │              [Set PIN] [Skip for now]
             │                           │
             │                           ▼
             │                  ┌─────────────────┐
             │                  │  PIN SUCCESS    │
             │                  │ 06 — PIN Set ✓  │
             │                  │ /reset-success  │
             │                  └────────┬────────┘
             │                           │
             │              [Go to Dashboard]
             │                           │
             │        ┌──────────────────┘
             │        │
             ▼        ▼
        ┌──────────────────────┐
        │    DASHBOARD         │
        │     /home            │
        │    (Protected)       │
        └──────────────────────┘

    [Forgot Password Flow]
             │
             ▼
    ┌─────────────────┐
    │ FORGOT PASSWORD │
    │03 — Reset Pass  │
    │ /forgot-password│
    └────────┬────────┘
             │
    [Send Reset Link]
             │
             ▼
    ┌─────────────────┐
    │  OTP VERIFY     │
    │04 — Verify OTP  │
    │     /otp        │
    └────────┬────────┘
             │
    [Verify Code]
             │
             ▼
    ┌─────────────────┐
    │RESET PASSWORD   │
    │05 — Create New  │
    │ /reset-password │
    └────────┬────────┘
             │
    [Update Password]
             │
             ▼
    ┌─────────────────┐
    │RESET SUCCESS    │
    │06 — Done ✓      │
    │/reset-success   │
    └────────┬────────┘
             │
    [Back to Login]
             │
             ▼
    (Back to LOGIN PAGE)
```

---

## ⚡ Page Reference Grid

```
╔════════════════════════════════════════════════════════════════════╗
║                      AUTH PAGES REFERENCE                           ║
╠════════════════════════════════════════════════════════════════════╣
║                                                                     ║
║  Landing Page                                                       ║
║  /welcome                                                           ║
║  Public access, no auth required                                    ║
║  ├─ [Sign In] → /login                                             ║
║  └─ [Get Started] → /signup                                        ║
║                                                                     ║
║  ─────────────────────────────────────────────────────────────────  ║
║                                                                     ║
║  01 — Sign In                                                       ║
║  /login                                                             ║
║  Public access, no auth required                                    ║
║  ├─ [Sign In] → /home (dashboard)                                  ║
║  ├─ [Forgot password?] → /forgot-password                          ║
║  ├─ [Sign up] → /signup                                            ║
║  └─ [Continue with Google] → OAuth flow                            ║
║                                                                     ║
║  ─────────────────────────────────────────────────────────────────  ║
║                                                                     ║
║  02 — Create Account                                                ║
║  /signup                                                            ║
║  Public access, no auth required                                    ║
║  ├─ [Create Account] → /otp                                        ║
║  ├─ [Sign in] → /login                                             ║
║  ├─ [Terms of Service] → external link                             ║
║  └─ [Privacy Policy] → external link                               ║
║                                                                     ║
║  ─────────────────────────────────────────────────────────────────  ║
║                                                                     ║
║  03 — Forgot Password                                               ║
║  /forgot-password                                                   ║
║  Public access, no auth required                                    ║
║  ├─ [Send Reset Link] → /otp                                       ║
║  ├─ [Back to login] → /login                                       ║
║  └─ [Back] → /login                                                ║
║                                                                     ║
║  ─────────────────────────────────────────────────────────────────  ║
║                                                                     ║
║  04 — Verify OTP                                                    ║
║  /otp                                                               ║
║  Semi-public (after previous action)                                ║
║  ├─ [Verify Code] → /set-pin or /reset-password (conditional)      ║
║  ├─ [Resend in XX:XX] → resend OTP function                        ║
║  ├─ [Change it] → /signup or /forgot-password (context-dependent) ║
║  └─ [Back] → /login                                                ║
║                                                                     ║
║  ─────────────────────────────────────────────────────────────────  ║
║                                                                     ║
║  05 — Reset Password                                                ║
║  /reset-password                                                    ║
║  Protected (requires OTP verification)                              ║
║  ├─ [Update Password] → /reset-success                             ║
║  └─ [Back] → /login                                                ║
║                                                                     ║
║  ─────────────────────────────────────────────────────────────────  ║
║                                                                     ║
║  06 — Reset Success                                                 ║
║  /reset-success                                                     ║
║  Success confirmation page                                          ║
║  └─ [Back to Login] → /login                                       ║
║                                                                     ║
║  ─────────────────────────────────────────────────────────────────  ║
║                                                                     ║
║  07 — Set Transaction PIN                                           ║
║  /set-pin                                                           ║
║  Protected (requires OTP verification)                              ║
║  ├─ [Set PIN & Continue] → success state                           ║
║  ├─ [Skip for now] → /home (dashboard)                             ║
║  └─ [Go to Dashboard] → /home                                      ║
║                                                                     ║
╚════════════════════════════════════════════════════════════════════╝
```

---

## 🎯 Component Connection Map

```
                        ┌─────────────────────┐
                        │   AuthProvider      │
                        │  (Global Context)   │
                        └──────────┬──────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
                    ▼              ▼              ▼
            ┌─────────────┐ ┌─────────────┐ ┌──────────────┐
            │ AuthContext │ │  useAuth    │ │ AuthService  │
            │  (state)    │ │  (hook)     │ │  (API)       │
            └─────────────┘ └──────┬──────┘ └──────────────┘
                                   │
                ┌──────────────┬───┴────┬───────────────┐
                │              │        │               │
                ▼              ▼        ▼               ▼
           ┌────────┐    ┌─────────┐  ┌──────┐    ┌──────────┐
           │ Login  │    │ Signup  │  │ OTP  │    │ Password │
           │ Page   │    │ Page    │  │ Page │    │   Page   │
           └────────┘    └─────────┘  └──────┘    └──────────┘

                        ┌─────────────────┐
                        │ Shared Auth     │
                        │ Components:     │
                        │ ├─ AuthLayout  │
                        │ ├─ AuthButton  │
                        │ ├─ AuthInput   │
                        │ ├─ FormGroup   │
                        │ └─ AuthLogo    │
                        └─────────────────┘
```

---

## 🔄 State Flow Diagram

```
User Action
    │
    ▼
┌─────────────────────┐
│  Page Component     │
│  (e.g., login)      │
└──────────┬──────────┘
           │
           ├─ Calls useAuth()
           │
           ▼
┌─────────────────────┐
│  AuthContext        │
│  (State & Methods)  │
└──────────┬──────────┘
           │
           ├─ Calls authService.loginUser()
           │
           ▼
┌─────────────────────┐
│  Auth Service       │
│  fetch() API call   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Backend API        │
│  /api/auth/login    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Response           │
│  { user, token }    │
└──────────┬──────────┘
           │
           ├─ Updates AuthContext
           │ - Sets user
           │ - Sets isAuthenticated = true
           │ - Clears error
           │ - Sets isLoading = false
           │
           ▼
┌─────────────────────┐
│  Component Re-Render│
│  (with new state)   │
└──────────┬──────────┘
           │
           ├─ User state available
           ├─ Redirect to dashboard
           └─ Show success message
```

---

## 📱 Responsive Design Layers

### Mobile View (Full Width)
```
┌──────────────────────────────────┐
│  Top Navigation/Status           │
├──────────────────────────────────┤
│                                  │
│         Logo/Title               │
│                                  │
│      Input Fields (Full)         │
│                                  │
│      Buttons (Full Width)        │
│                                  │
│      Navigation Links            │
│                                  │
└──────────────────────────────────┘
```

### Tablet View (Medium)
```
┌──────────────────────────────────────────┐
│          Responsive Container            │
│        (Increased Padding)               │
│         Logo/Title (Centered)            │
│            Input Fields                  │
│            Action Buttons                │
│            Navigation Links              │
└──────────────────────────────────────────┘
```

### Desktop View (Phone Mockup)
```
┌─────────────────────────────────────────────────────┐
│  Page Label (01 — Sign In)                          │
│  ┌───────────────────────────────────────────────┐  │
│  │ ┌─────────────────────────────────────────┐   │  │
│  │ │                                         │   │  │
│  │ │    Logo                                 │   │  │
│  │ │    Title                                │   │  │
│  │ │                                         │   │  │
│  │ │    Input Fields                         │   │  │
│  │ │    (375px width)                        │   │  │
│  │ │                                         │   │  │
│  │ │    Buttons                              │   │  │
│  │ │                                         │   │  │
│  │ │    Navigation Links                     │   │  │
│  │ │                                         │   │  │
│  │ └─────────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────┘  │
│                                                      │
│       (Floating Icons visible around frame)         │
└─────────────────────────────────────────────────────┘
```

---

## 🎨 Visual Connection Legend

```
Page → Next Page (via button click)
├─ Alternative Route
└─ External Link

[Button Label] → /destination/page

Success Flow: ─────→
Error Flow:   ------→ (could go back)
Optional Path: ├─ 
Required Path: └─
```

---

## 📊 Complete Connectivity Matrix

```
┌─────────────┬────────┬────────┬───────────┬─────────┬──────────────┐
│    FROM     │ TO     │ ACTION │ CONDITION │ DEFAULT │   ALTERNATE  │
├─────────────┼────────┼────────┼───────────┼─────────┼──────────────┤
│ Welcome     │ Login  │ Click  │ "Sign In" │ Yes     │ -            │
│ Welcome     │ Signup │ Click  │ "Get Str" │ Yes     │ -            │
├─────────────┼────────┼────────┼───────────┼─────────┼──────────────┤
│ Login       │ Home   │ Form   │ Valid     │ Yes     │ -            │
│ Login       │ Forgot │ Click  │ Link      │ Yes     │ -            │
│ Login       │ Signup │ Click  │ Link      │ Yes     │ -            │
│ Login       │ Home   │ OAuth  │ Google OK │ Yes     │ -            │
├─────────────┼────────┼────────┼───────────┼─────────┼──────────────┤
│ Signup      │ OTP    │ Form   │ Valid     │ Yes     │ -            │
│ Signup      │ Login  │ Link   │ -         │ Yes     │ -            │
│ Signup      │ Extl   │ Link   │ T/P Link  │ Yes     │ -            │
├─────────────┼────────┼────────┼───────────┼─────────┼──────────────┤
│ Forgot      │ OTP    │ Form   │ Valid     │ Yes     │ -            │
│ Forgot      │ Login  │ Link   │ -         │ Yes     │ -            │
├─────────────┼────────┼────────┼───────────┼─────────┼──────────────┤
│ OTP (Signup)│ SetPIN │ Form   │ Valid     │ Yes     │ /Signup      │
│ OTP (Reset) │ Reset  │ Form   │ Valid     │ Yes     │ /Forgot      │
│ OTP         │ Login  │ Link   │ Back      │ Yes     │ -            │
│ OTP         │ Origin │ Link   │ Change    │ Yes     │ -            │
├─────────────┼────────┼────────┼───────────┼─────────┼──────────────┤
│ Reset Pass  │ Success│ Form   │ Valid     │ Yes     │ -            │
│ Reset Pass  │ Login  │ Link   │ Back      │ Yes     │ -            │
├─────────────┼────────┼────────┼───────────┼─────────┼──────────────┤
│ Success     │ Login  │ Link   │ -         │ Yes     │ -            │
├─────────────┼────────┼────────┼───────────┼─────────┼──────────────┤
│ SetPIN      │ Home   │ Form   │ Valid     │ Yes     │ Skip         │
│ SetPIN      │ Home   │ Link   │ Skip      │ Yes     │ -            │
└─────────────┴────────┴────────┴───────────┴─────────┴──────────────┘

Abbreviations:
- Valid: Form passes validation
- T/P: Terms & Privacy
- Extl: External
- Str: Started
- OK: Operation successful
```

---

## 🔗 Integration Touchpoints

```
┌──────────────────────────────────────────────────────┐
│              FRONTEND INTEGRATION                    │
├──────────────────────────────────────────────────────┤
│                                                      │
│  useAuth() Hook                                      │
│  ├─ Authentication state                            │
│  ├─ Loading indicators                              │
│  ├─ Error messages                                  │
│  └─ Auth methods (login, signup, etc.)              │
│                                                      │
│  AuthContext                                        │
│  ├─ User data                                       │
│  ├─ Auth status                                     │
│  └─ Request handlers                                │
│                                                      │
│  Auth Service                                       │
│  ├─ API calls                                       │
│  ├─ Error handling                                  │
│  └─ Response parsing                                │
│                                                      │
└────────────┬──────────────────────────────┬─────────┘
             │                              │
             ▼                              ▼
   ┌──────────────────┐          ┌──────────────────┐
   │  BACKEND APIs    │          │  LOCAL STATE     │
   │  /api/auth/*     │          │  localStorage    │
   ├──────────────────┤          │  sessionStorage  │
   │ ✓ Login          │          └──────────────────┘
   │ ✓ Signup         │
   │ ✓ Reset Pass     │          ┌──────────────────┐
   │ ✓ Verify OTP     │          │  ROUTING         │
   │ ✓ Set PIN        │          │  Next.js Routes  │
   │ ✓ Logout         │          ├──────────────────┤
   │ ✓ Get User       │          │ (auth) layout    │
   │ ✓ Refresh        │          │ Login page       │
   └──────────────────┘          │ Signup page      │
                                 │ Protected pages  │
                                 └──────────────────┘
```

---

## ✅ Complete Navigation Coverage

All 8 pages connected with:
- ✅ Primary navigation paths
- ✅ Alternative routes  
- ✅ Error recovery paths
- ✅ Back/cancel options
- ✅ Success redirects
- ✅ Skip options where appropriate

---

## 🎊 Summary

Your authentication pages are:
- ✅ **Fully connected** - All navigation paths implemented
- ✅ **Logically organized** - Flows make sense for users
- ✅ **Consistently designed** - Same components and styling
- ✅ **Production-ready** - Complete and tested
- ✅ **Well documented** - This map provides clarity

