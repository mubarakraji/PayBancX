# 🚀 API Endpoints Quick Reference

## Base URL
```
https://paybancx-production.up.railway.app/api/v1
```

---

## 🔐 Authentication Endpoints

### Register User
```typescript
POST /auth/register
Body: {
  fullName: string,
  email: string,
  phone: string,
  password: string
}
Response: { token, user }
Usage: import { signupUser } from '@/services/authService'
```

### Login User
```typescript
POST /auth/login
Body: {
  email: string,
  password: string
}
Response: { token, user }
Usage: import { loginUser } from '@/services/authService'
Usage in App: const { login } = useAuth()
```

### Verify OTP
```typescript
POST /auth/verify-otp
Body: { otp: string }
Response: { success: boolean }
Usage: import { verifyOTP } from '@/services/authService'
```

### Resend OTP
```typescript
POST /auth/resend-otp
Body: { email: string }
Response: { success: boolean }
Usage: import { resendOTP } from '@/services/authService'
```

### Forgot Password
```typescript
POST /auth/forgot-password
Body: { email: string }
Response: { message: string }
Usage: import { requestPasswordReset } from '@/services/authService'
```

### Reset Password
```typescript
POST /auth/reset-password
Body: {
  token: string,
  newPassword: string
}
Response: { success: boolean }
Usage: import { resetPassword } from '@/services/authService'
```

### Change Password
```typescript
POST /auth/change-password
Headers: Authorization: Bearer {token}
Body: {
  oldPassword: string,
  newPassword: string
}
Response: { success: boolean }
Usage: import { changePassword } from '@/services/authService'
```

### Get User Profile
```typescript
GET /auth/profile
Headers: Authorization: Bearer {token}
Response: { user: UserData }
Usage: import { getUserProfile } from '@/services/authService'
Usage in App: const { user } = useAuth()
```

### Refresh Token
```typescript
POST /auth/refresh-token
Headers: Authorization: Bearer {token}
Response: { token: string }
Usage: import { refreshToken } from '@/services/authService'
```

---

## 💰 Wallet Endpoints

### Get Balance ✅
```typescript
GET /wallet/balance
Headers: Authorization: Bearer {token}
Response: { balance: number, currency: string }
Usage: import { getWalletBalance } from '@/services/walletService'

// Example
const balance = await getWalletBalance()
console.log(balance.balance) // 5000.00
```

### Get Virtual Account ✅
```typescript
GET /wallet/virtual-account
Headers: Authorization: Bearer {token}
Response: {
  accountNumber: string,
  accountName: string,
  bankName: string,
  bankCode: string
}
Usage: import { getVirtualAccount } from '@/services/walletService'

// Example
const account = await getVirtualAccount()
console.log(account.accountNumber)
```

### Initiate Deposit
```typescript
POST /wallet/deposit/initiate
Headers: Authorization: Bearer {token}
Body: { amount: number }
Response: {
  reference: string,
  paymentUrl: string,
  amount: number
}
Usage: import { initiateDeposit } from '@/services/walletService'

// Example
const deposit = await initiateDeposit(5000)
window.open(deposit.paymentUrl) // Redirect to payment
```

### Verify Deposit
```typescript
GET /wallet/deposit/verify/{reference}
Headers: Authorization: Bearer {token}
Response: { success: boolean, reference: string }
Usage: import { verifyDeposit } from '@/services/walletService'
```

### Withdraw Funds
```typescript
POST /wallet/withdraw
Headers: Authorization: Bearer {token}
Body: {
  amount: number,
  bankCode: string,
  accountNumber: string,
  pin: string
}
Response: { success: boolean, reference: string }
Usage: import { withdrawFunds } from '@/services/walletService'
```

### Transfer Funds
```typescript
POST /wallet/transfer
Headers: Authorization: Bearer {token}
Body: {
  amount: number,
  recipient: string,
  narration: string,
  pin: string
}
Response: { success: boolean, reference: string }
Usage: import { transferFunds } from '@/services/walletService'
```

### Get Transactions ✅
```typescript
GET /wallet/transactions?page=1&limit=20&type=deposit&status=completed
Headers: Authorization: Bearer {token}
Response: {
  transactions: Array,
  total: number,
  page: number
}
Usage: import { getTransactionHistory } from '@/services/walletService'

// Example
const result = await getTransactionHistory(1, 20, 'transfer', 'completed')
result.transactions.forEach(tx => {
  console.log(tx.description, tx.amount)
})
```

### Get Transaction Details
```typescript
GET /wallet/transaction/{id}
Headers: Authorization: Bearer {token}
Response: { id, type, amount, date, status }
Usage: import { getTransactionDetail } from '@/services/walletService'
```

### Stream Wallet Events
```typescript
GET /wallet/stream
Headers: Authorization: Bearer {token}
Response: { event: string, data: any }
Usage: import { getWalletStream } from '@/services/walletService'
```

---

## 🛍️ Services - Airtime

### Get Airtime Providers ✅
```typescript
GET /services/airtime
Headers: Authorization: Bearer {token}
Response: [{ id, name, code }]
Usage: import { getAirtimeProviders } from '@/services/paymentService'

// Example
const providers = await getAirtimeProviders()
// Returns: [{ id: 'mtn', name: 'MTN', code: 'MTN' }, ...]
```

### Buy Airtime ✅
```typescript
POST /services/airtime
Headers: Authorization: Bearer {token}
Body: {
  phoneNumber: string,
  amount: number,
  network: string
}
Response: { success: boolean, reference: string }
Usage: import { buyAirtime } from '@/services/paymentService'

// Example
await buyAirtime({
  phoneNumber: '+2348012345678',
  amount: 500,
  network: 'MTN'
})
```

---

## 📊 Services - Data

### Get Data Variations
```typescript
GET /services/data/variations?network=MTN
Headers: Authorization: Bearer {token}
Response: [{ id, name, amount, validity }]
Usage: import { getDataVariations } from '@/services/paymentService'

// Example
const plans = await getDataVariations('MTN')
// Returns: [{ id: '1gb', name: '1GB - ₦200', amount: 200 }, ...]
```

### Buy Data
```typescript
POST /services/data
Headers: Authorization: Bearer {token}
Body: {
  phoneNumber: string,
  variationId: string,
  amount: number,
  network: string
}
Response: { success: boolean, reference: string }
Usage: import { buyData } from '@/services/paymentService'
```

---

## ⚡ Services - Electricity

### Verify Meter
```typescript
POST /services/electricity/verify
Headers: Authorization: Bearer {token}
Body: {
  meterNumber: string,
  disco: string
}
Response: { success: boolean, meterInfo: { name, address } }
Usage: import { verifyElectricityMeter } from '@/services/paymentService'
```

### Buy Electricity
```typescript
POST /services/electricity
Headers: Authorization: Bearer {token}
Body: {
  meterNumber: string,
  meterType: 'prepaid' | 'postpaid',
  disco: string,
  amount: number
}
Response: { success: boolean, reference: string, token: string }
Usage: import { buyElectricity } from '@/services/paymentService'
```

---

## 📺 Services - TV

### Get TV Variations
```typescript
GET /services/tv/variations?provider=DSTV
Headers: Authorization: Bearer {token}
Response: [{ id, name, amount, validity }]
Usage: import { getTVVariations } from '@/services/paymentService'
```

### Verify Smartcard
```typescript
POST /services/tv/verify
Headers: Authorization: Bearer {token}
Body: {
  smartcardNumber: string,
  provider: string
}
Response: { success: boolean, customerInfo: { name, address } }
Usage: import { verifyTVSmartcard } from '@/services/paymentService'
```

### Buy TV Subscription
```typescript
POST /services/tv
Headers: Authorization: Bearer {token}
Body: {
  smartcardNumber: string,
  provider: string,
  variationId: string,
  amount: number
}
Response: { success: boolean, reference: string }
Usage: import { buyTVSubscription } from '@/services/paymentService'
```

---

## 🎮 Services - Betting

### Verify Betting Account
```typescript
POST /services/betting/verify
Headers: Authorization: Bearer {token}
Body: {
  username: string,
  provider: string
}
Response: { success: boolean, accountInfo: { name, username } }
Usage: import { verifyBettingAccount } from '@/services/paymentService'
```

### Fund Betting Account
```typescript
POST /services/betting
Headers: Authorization: Bearer {token}
Body: {
  username: string,
  provider: string,
  amount: number
}
Response: { success: boolean, reference: string }
Usage: import { fundBettingAccount } from '@/services/paymentService'
```

---

## 📋 Services - History & Orders

### Get Service Order Details
```typescript
GET /services/orders/{orderId}
Headers: Authorization: Bearer {token}
Response: { id, service, status, amount, date }
Usage: import { getServiceOrder } from '@/services/paymentService'
```

### Get Service History
```typescript
GET /services/history?service=airtime&limit=20&page=1
Headers: Authorization: Bearer {token}
Response: { orders: Array, total: number, page: number }
Usage: import { getServiceHistory } from '@/services/paymentService'

// Example
const history = await getServiceHistory('airtime', 20, 1)
history.orders.forEach(order => {
  console.log(order.service, order.amount)
})
```

---

## 🎯 Implementation Patterns

### Pattern 1: Showing Balance with Refresh
```typescript
const [balance, setBalance] = useState(0)
const [isRefreshing, setIsRefreshing] = useState(false)

const handleRefresh = async () => {
  setIsRefreshing(true)
  try {
    const data = await getWalletBalance()
    setBalance(data.balance)
  } finally {
    setIsRefreshing(false)
  }
}

// In JSX:
<h1>Balance: ₦{balance}</h1>
<button onClick={handleRefresh} disabled={isRefreshing}>
  🔄 Refresh
</button>
```

### Pattern 2: Handling Error in API Calls
```typescript
try {
  const result = await someApiCall()
  // Process result
} catch (err) {
  const message = err instanceof Error ? err.message : 'Unknown error'
  setError(message)
}
```

### Pattern 3: Using useAuth Hook
```typescript
const { user, login, logout, isAuthenticated } = useAuth()

if (!isAuthenticated) {
  return <Redirect to="/login" />
}

return <div>Welcome {user?.fullName}</div>
```

---

## ✅ Checkmarks for Implemented Features

- ✅ Login/Register with real API
- ✅ Get wallet balance
- ✅ Get virtual account
- ✅ Initiate deposit
- ✅ Get transactions with pagination
- ✅ Get airtime providers
- ✅ Buy airtime
- ✅ Token management (auto refresh)
- ✅ Error handling (all services)
- ✅ User profile (fetch and display)

---

## 🔄 Common Response Patterns

### Success Response
```typescript
{
  success: true,
  message: "Operation successful",
  data: { ... }
}
```

### Error Response
```typescript
{
  success: false,
  message: "Error description",
  code: "ERROR_CODE"
}
```

### Paginated Response
```typescript
{
  success: true,
  data: {
    items: [],
    total: 100,
    page: 1,
    limit: 20,
    pages: 5
  }
}
```

---

## 📱 Usage Examples in Components

### Example 1: Display Balance
```typescript
'use client'
import { useEffect, useState } from 'react'
import { getWalletBalance } from '@/services/walletService'

export default function Balance() {
  const [balance, setBalance] = useState(0)
  
  useEffect(() => {
    getWalletBalance().then(b => setBalance(b.balance))
  }, [])
  
  return <div>Balance: ₦{balance.toLocaleString()}</div>
}
```

### Example 2: Buy Airtime
```typescript
'use client'
import { buyAirtime } from '@/services/paymentService'

export default function BuyAirtime() {
  const handleBuy = async () => {
    await buyAirtime({
      phoneNumber: '+2348012345678',
      amount: 500,
      network: 'MTN'
    })
  }
  
  return <button onClick={handleBuy}>Buy Airtime</button>
}
```

---

*Generated: April 20, 2026*
*Last Updated: API Integration Complete ✅*
