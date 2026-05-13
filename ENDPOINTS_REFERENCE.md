# API Endpoints Reference - PayBancX Services

## Overview
All service endpoints are now properly organized and separate verification from transaction endpoints.

---

## ELECTRICITY SERVICE

### 1. Get Electricity Providers (DISCOs)
- **Route**: `GET /api/services/electricity`
- **Backend**: `GET https://pb-production-fd26.up.railway.app/api/v1/services/electricity`
- **File**: `src/app/api/services/electricity/route.ts`
- **Auth**: Required (Authorization header)
- **Response**: Array of DISCO providers
- **Usage**: Fetch list of electricity distribution companies

### 2. Verify Electricity Meter
- **Route**: `POST /api/services/electricity/verify`
- **Backend**: `POST https://pb-production-fd26.up.railway.app/api/v1/services/electricity/verify`
- **File**: `src/app/api/services/electricity/verify/route.ts`
- **Auth**: Required (Authorization header)
- **Request Body**:
  ```json
  {
    "disco": "AEDC",
    "meterNumber": "12345678901",
    "meterType": "prepaid"
  }
  ```
- **Response**: 
  ```json
  {
    "success": true,
    "data": {
      "customerName": "John Doe",
      "meterStatus": "active"
    }
  }
  ```
- **Usage**: Verify meter number and retrieve customer name

### 3. Buy Electricity
- **Route**: `POST /api/services/electricity`
- **Backend**: `POST https://pb-production-fd26.up.railway.app/api/v1/services/electricity`
- **File**: `src/app/api/services/electricity/route.ts`
- **Auth**: Required (Authorization header)
- **Request Body**:
  ```json
  {
    "disco": "AEDC",
    "meterNumber": "12345678901",
    "meterType": "prepaid",
    "amount": 5000
  }
  ```
- **Response**: Transaction confirmation with reference

---

## TV SERVICE

### 1. Get TV Providers
- **Route**: `GET /api/services/tv`
- **Backend**: `GET https://pb-production-fd26.up.railway.app/api/v1/services/tv`
- **File**: `src/app/api/services/tv/route.ts`
- **Auth**: Required
- **Response**: Array of TV providers (DStv, GOtv, StarTimes, etc.)

### 2. Get TV Variations
- **Route**: `GET /api/services/tv/variations?provider=DSTV`
- **Backend**: `GET https://pb-production-fd26.up.railway.app/api/v1/services/tv/variations?provider=DSTV`
- **File**: `src/app/api/services/tv/variations/route.ts`
- **Auth**: Required
- **Query Parameters**:
  - `provider` (required): Provider code (e.g., DSTV, GOTV, STARTIMES)
- **Response**: Array of available packages/variations for the provider
- **Usage**: Fetch available TV subscription packages

### 3. Verify TV Smartcard
- **Route**: `POST /api/services/tv/verify`
- **Backend**: `POST https://pb-production-fd26.up.railway.app/api/v1/services/tv/verify`
- **File**: `src/app/api/services/tv/verify/route.ts`
- **Auth**: Required
- **Request Body**:
  ```json
  {
    "smartcardNumber": "ABC12345678",
    "provider": "DSTV"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "customerName": "Jane Smith",
      "accountStatus": "active"
    }
  }
  ```
- **Usage**: Verify smartcard and retrieve customer name

### 4. Subscribe to TV
- **Route**: `POST /api/services/tv`
- **Backend**: `POST https://pb-production-fd26.up.railway.app/api/v1/services/tv`
- **File**: `src/app/api/services/tv/route.ts`
- **Auth**: Required
- **Request Body**:
  ```json
  {
    "smartcardNumber": "ABC12345678",
    "provider": "DSTV",
    "variationId": "dstv_premium",
    "amount": 5000
  }
  ```
- **Response**: Transaction confirmation with reference

---

## BETTING SERVICE

### 1. Get Betting Providers
- **Route**: `GET /api/services/betting`
- **Backend**: `GET https://pb-production-fd26.up.railway.app/api/v1/services/betting`
- **File**: `src/app/api/services/betting/route.ts`
- **Auth**: Required
- **Response**: Array of betting platforms (1xBet, BangBet, Bet9ja, BetKing, etc.)

### 2. Verify Betting Account
- **Route**: `POST /api/services/betting/verify`
- **Backend**: `POST https://pb-production-fd26.up.railway.app/api/v1/services/betting/verify`
- **File**: `src/app/api/services/betting/verify/route.ts`
- **Auth**: Required
- **Request Body**:
  ```json
  {
    "username": "player123",
    "provider": "BET9JA"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "customerName": "Player Name",
      "accountStatus": "active",
      "balance": 15000
    }
  }
  ```
- **Usage**: Verify betting account and retrieve customer name

### 3. Fund Betting Account
- **Route**: `POST /api/services/betting`
- **Backend**: `POST https://pb-production-fd26.up.railway.app/api/v1/services/betting`
- **File**: `src/app/api/services/betting/route.ts`
- **Auth**: Required
- **Request Body**:
  ```json
  {
    "username": "player123",
    "provider": "BET9JA",
    "amount": 5000
  }
  ```
- **Response**: Transaction confirmation with reference

---

## TRANSACTION HISTORY

### Get Transaction History
- **Route**: `GET /api/services/history?service=airtime&limit=20&page=1`
- **Backend**: `GET https://pb-production-fd26.up.railway.app/api/v1/services/history?service=airtime&limit=20&page=1`
- **File**: `src/app/api/services/history/route.ts`
- **Auth**: Required
- **Query Parameters**:
  - `service` (optional): Filter by service type (airtime, data, electricity, tv, betting)
  - `limit` (optional): Number of records per page (default: 20)
  - `page` (optional): Page number (default: 1)
- **Response**: Array of transactions with pagination
- **Usage**: Retrieve user's transaction history

---

## ORDERS

### Get Order Details
- **Route**: `GET /api/services/orders/[id]`
- **Backend**: `GET https://pb-production-fd26.up.railway.app/api/v1/services/orders/[id]`
- **File**: `src/app/api/services/orders/[id]/route.ts`
- **Auth**: Required
- **Path Parameters**:
  - `id`: Order ID (e.g., 12345)
- **Response**: Order details including status, amount, items, etc.
- **Usage**: Retrieve specific order information

---

## OTHER SERVICES

### AIRTIME
- **Get Providers**: `GET /api/services/airtime`
- **Buy Airtime**: `POST /api/services/airtime`
- **File**: `src/app/api/services/airtime/route.ts`

### DATA
- **Get Packages**: `GET /api/services/data`
- **Buy Data**: `POST /api/services/data`
- **File**: `src/app/api/services/data/route.ts`

---

## Frontend Service Functions

All endpoints are called through the Payment Service (`src/services/paymentService.ts`):

### Electricity
```typescript
getElectricityDISCOs()              // Get providers
verifyElectricityMeter(disco, meterNumber, meterType)  // Verify meter
buyElectricity(electricityData)     // Purchase
```

### TV
```typescript
getTVProviders()                    // Get providers
getTVVariations(provider)           // Get variations
verifyTVSmartcard(verifyData)      // Verify smartcard
buyTVSubscription(tvData)          // Subscribe
```

### Betting
```typescript
getBettingProviders()               // Get providers
verifyBettingAccount(verifyData)   // Verify account
fundBettingAccount(bettingData)    // Fund account
```

### Others
```typescript
getTransactionHistory(query)        // Get history
getOrderDetails(orderId)            // Get order
```

---

## Error Handling

All endpoints return standardized error responses:

```json
{
  "success": false,
  "message": "Error description",
  "status": 400
}
```

Common status codes:
- `200`: Success
- `400`: Bad Request (missing/invalid parameters)
- `401`: Unauthorized (missing auth header)
- `500`: Server error

---

## Implementation Status

✅ All endpoints properly separated
✅ Verification endpoints segregated from transaction endpoints
✅ All routes forward to correct backend URLs
✅ Proper logging and error handling
✅ Authorization header validation
✅ Request/response format validation
✅ Build verified with zero errors

