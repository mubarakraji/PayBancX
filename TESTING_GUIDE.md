# 🧪 Testing & Troubleshooting Guide

## ✅ Pre-Testing Checklist

Before testing, make sure:
- [ ] Application is running (`npm run dev`)
- [ ] You can access the app at `http://localhost:3000`
- [ ] Browser DevTools are available (F12)
- [ ] You have valid API credentials/account

---

## 🚀 Step-by-Step Testing Guide

### Section 1: Authentication Flow ✅

#### Test 1.1: Login
```
1. Navigate to http://localhost:3000/login
2. Enter your credentials
3. Click "Sign In"
4. Expected: Redirects to /home and shows dashboard
```

**If it fails:**
- [ ] Check Network tab (F12) for API call to `/auth/login`
- [ ] Look for error message in UI
- [ ] Check Console tab for JavaScript errors

#### Test 1.2: Check Token Storage
```
1. Open DevTools (F12)
2. Go to Application → Storage → Local Storage
3. Look for: authToken and user keys
4. Expected: Should see stored token and user JSON
```

**If tokens not present:**
- [ ] Login may not have completed
- [ ] Check API response in Network tab
- [ ] Look for error message

### Section 2: Dashboard & Wallet ✅

#### Test 2.1: Load Dashboard
```
1. After logging in, you're on /home
2. Expected: See "WALLET BALANCE" with amount (₦X.XX)
3. Check if balance loads without errors
```

**If balance shows "...":**
- [ ] Wait a moment for API to respond
- [ ] Check Network tab for `/wallet/balance` call
- [ ] Check Console for errors

#### Test 2.2: Refresh Balance
```
1. On /home page
2. Look for refresh icon (🔄) next to balance
3. Click the refresh button
4. Expected: Button animates, balance updates
```

**If refresh button doesn't work:**
- [ ] Open Console (F12) → Console tab
- [ ] Check for error messages
- [ ] Click Network tab and look for `/wallet/balance` call
- [ ] Check the response status (should be 200)

#### Test 2.3: View Virtual Account
```
1. On /home page, click "Deposit" button
2. Wait for virtual account to load
3. Expected: See Account Number, Bank Name, Account Name
```

**If account details don't load:**
- [ ] Check Network tab for `/wallet/virtual-account` call
- [ ] Look for API error in response
- [ ] Check Console for errors

### Section 3: Transactions ✅

#### Test 3.1: View Transaction History
```
1. Navigate to /transactions
2. Expected: See "Transactions" page with transaction list
3. If no transactions yet, see "No Transactions Yet" message
```

**If page doesn't load:**
- [ ] Check if logged in (should see token in localStorage)
- [ ] Check Network tab for `/wallet/transactions` call
- [ ] Check Console for JavaScript errors

#### Test 3.2: Search Transactions
```
1. On /transactions page
2. Click search box and type a word/reference
3. Expected: Transaction list filters as you type
```

**If search doesn't work:**
- [ ] Clear search and try again
- [ ] Make sure you have transactions to search
- [ ] Check Console for errors

#### Test 3.3: Filter Transactions
```
1. On /transactions page
2. Click "Received" or "Sent" filter
3. Expected: List updates to show only that type
4. Try "All Time", "Today", "This Week", etc.
```

**If filters don't work:**
- [ ] Check that you have transactions of that type
- [ ] Verify the dates are within the range

### Section 4: Profile ✅

#### Test 4.1: View Profile
```
1. Click profile icon or navigate to /profile
2. Expected: See your name, email, phone
3. Should show "Verified Account" if applicable
```

**If profile doesn't load:**
- [ ] Check if logged in
- [ ] Check Network tab for `/auth/profile` call
- [ ] Look for error message

#### Test 4.2: Logout
```
1. On /profile page
2. Click "Logout" button
3. Expected: Redirects to /login, token cleared
```

**If logout doesn't work:**
- [ ] Check Console for errors
- [ ] Verify localStorage is cleared (Storage tab)

### Section 5: Payments ✅

#### Test 5.1: Buy Airtime
```
1. Navigate to /payment/airtime
2. Select a network (MTN, Airtel, etc.)
3. Enter phone number
4. Enter amount (or click preset amount)
5. Click "Continue"
6. Expected: See confirmation or success message
```

**If airtime page doesn't load:**
- [ ] Check Network tab for `/services/airtime` call
- [ ] Verify you're logged in
- [ ] Check Console for errors

**If purchase fails:**
- [ ] Check Console for error message
- [ ] Verify phone number format is correct
- [ ] Check available balance
- [ ] Look at Network tab for API response

#### Test 5.2: Deposit Money
```
1. On /home, click "Deposit"
2. Wait for virtual account details to load
3. Enter amount you want to deposit
4. Click "Continue Deposit"
5. Expected: Success message or payment redirect
```

**If deposit fails:**
- [ ] Check Console for error
- [ ] Verify amount is valid (> 0)
- [ ] Check Network tab for `/wallet/deposit/initiate` call

---

## 🔧 Troubleshooting Common Issues

### Issue 1: "Not Authenticated" or 404 errors
**Symptoms:** Pages show 404, or redirected to login

**Solution:**
```
1. Make sure you're logged in
2. Check localStorage for authToken (F12 → Storage)
3. If token exists, try refreshing page
4. If token missing, login again
5. Check if token is being sent in API requests (Network tab)
```

### Issue 2: Balance shows "₦0.00"
**Symptoms:** Balance always shows zero

**Solution:**
```
1. Check Network tab for /wallet/balance response
2. Click refresh button and watch Network tab
3. Look at the API response - does it show balance?
4. Check user account has funds
5. Check Console for any error messages
```

### Issue 3: Transactions not showing
**Symptoms:** Always shows "No Transactions Yet"

**Solution:**
```
1. Check Network tab for /wallet/transactions response
2. Look at API response - are there transactions?
3. Check if you have any transactions in your account
4. Try different time filters (This Week, This Month)
5. Check Console for errors
```

### Issue 4: API Calls Failing (401/403 errors)
**Symptoms:** See error responses, can't access data

**Solution:**
```
1. Check localStorage for valid token (Storage tab)
2. Try logging out and logging back in
3. Check if token is being sent (Network tab → Headers)
4. Look for "Authorization: Bearer {token}" in request headers
5. If token missing, issue is likely in API client code
```

### Issue 5: CORS or Network Errors
**Symptoms:** See Network errors in Console

**Solution:**
```
1. Check if API endpoint is correct in apiConfig.ts
2. Verify you can reach the API (check with curl/Postman)
3. Check browser console for exact error
4. If CORS error, it might be API configuration issue
5. Try from a different network/device
```

### Issue 6: Page Won't Load
**Symptoms:** Blank/white page or infinite loading

**Solution:**
```
1. Open Console (F12 → Console tab)
2. Look for red error messages
3. Try refreshing page (Ctrl+R or Cmd+R)
4. Check if all imports are correct
5. Check Network tab for failed requests
6. Look for specific function errors in Console
```

---

## 🔍 Using DevTools to Debug

### Network Tab Investigation
```
1. Open Network tab (F12 → Network)
2. Perform action (login, deposit, etc.)
3. Look for API requests to: paybancx-production.up.railway.app
4. Click on the request
5. Check Tabs:
   - Response: See what API returned
   - Headers: See request headers and token
   - Preview: See formatted response
```

### Console Tab Investigation
```
1. Open Console tab (F12 → Console)
2. Look for red error messages
3. Click on error to see details
4. Look for specific API errors
5. Watch for "Failed to fetch" meaning API unreachable
```

### Local Storage Investigation
```
1. Open Storage tab (F12 → Storage → Local Storage)
2. Look for keys:
   - authToken: Your JWT token
   - user: Your user data as JSON
3. Verify these exist after login
4. Verify these are cleared after logout
```

### Application/Inspector Tab
```
1. Open Application tab (F12 → Application)
2. Check Cookies section for session cookies
3. Verify API responses make sense
4. Look for any security warnings
```

---

## 📊 API Response Examples

### Successful Login Response
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "user123",
      "email": "user@example.com",
      "fullName": "John Doe",
      "phone": "+2348012345678"
    }
  }
}
```

### Balance Response
```json
{
  "success": true,
  "data": {
    "balance": 5000,
    "currency": "NGN"
  }
}
```

### Transactions Response
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "txn123",
        "type": "transfer",
        "description": "Transfer to John",
        "amount": 1000,
        "date": "2024-04-20T10:30:00Z",
        "status": "completed"
      }
    ],
    "total": 50,
    "page": 1
  }
}
```

---

## 🚨 Critical Error Messages

### "useAuth must be used within an AuthProvider"
**Cause:** Component using useAuth not wrapped in AuthProvider
**Fix:** Wrap app in AuthProvider in layout.tsx

### "Failed to fetch"
**Cause:** Cannot reach API endpoint
**Fix:** Check API URL, network connection, server status

### "Token expired"
**Cause:** JWT token has expired
**Fix:** Login again, token will be refreshed automatically

### "Unauthorized" (401 error)
**Cause:** No valid token provided
**Fix:** Login first, then access protected routes

### "Forbidden" (403 error)
**Cause:** Token valid but user doesn't have permission
**Fix:** Check user's account permissions

---

## ✅ Success Indicators

You'll know everything is working when:

1. ✅ **Login works**: Token appears in localStorage
2. ✅ **Balance loads**: Shows ₦X.XX on home page
3. ✅ **Refresh works**: Clicking 🔄 updates balance
4. ✅ **Transactions show**: List appears on /transactions
5. ✅ **Profile loads**: User info displays on /profile
6. ✅ **Deposit works**: Virtual account details show
7. ✅ **Airtime works**: Providers load, can select and buy
8. ✅ **Logout works**: Clears token and redirects

---

## 📞 If Still Having Issues

1. Check all three documentation files:
   - `INTEGRATION_SUMMARY.md` - Overview
   - `API_INTEGRATION_GUIDE.md` - Detailed guide
   - `API_QUICK_REFERENCE.md` - Endpoint reference

2. Use this checklist:
   - [ ] API endpoint is correct
   - [ ] Token is being stored
   - [ ] Token is being sent in requests
   - [ ] API is returning valid responses
   - [ ] No console errors

3. Try these debugging steps:
   - [ ] Clear localStorage and login again
   - [ ] Check browser console for specific errors
   - [ ] Check Network tab for API responses
   - [ ] Verify API endpoint in `apiConfig.ts`
   - [ ] Check if server is running

4. If stuck:
   - [ ] Review the API response carefully
   - [ ] Check exact error message in Network tab
   - [ ] Look for typos in function calls
   - [ ] Verify all imports are correct

---

## 🎯 Testing Checklist

Use this to track your testing progress:

- [ ] Authentication (Login/Register)
- [ ] Token Storage
- [ ] Balance Display
- [ ] Balance Refresh
- [ ] Transaction History
- [ ] Transaction Search
- [ ] Profile View
- [ ] Logout
- [ ] Deposit Modal
- [ ] Airtime Purchase
- [ ] Error Handling
- [ ] Loading States

**Save this page and use it while testing!**

---

*Last Updated: April 20, 2026*
*API Integration: ✅ COMPLETE*
