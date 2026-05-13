// Payment Services - Airtime, Data, Electricity, TV, Betting
import { API_ENDPOINTS, buildApiUrl, getAuthHeaders } from '@/config/apiConfig';

export interface ServiceOption {
  id: string;
  name: string;
  code: string;
  amount?: number;
  validity?: string;
}

export interface AirtimeData {
  phoneNumber: string;
  amount: number;
  network: string;
}

export interface DataData {
  phoneNumber: string;
  variationId: string;
  amount: number;
  network: string;
}

export interface ElectricityData {
  meterNumber: string;
  meterType: 'prepaid' | 'postpaid';
  disco: string; // Distribution company
  amount: number;
}

export interface ElectricityVerifyData {
  meterNumber: string;
  disco: string;
}

export interface TVData {
  smartcardNumber: string;
  provider: string;
  variationCode: string;
  amount: number;
  phoneNumber?: string;
}

export interface TVVerifyData {
  smartcardNumber: string;
  provider: string;
}

export interface BettingData {
  customerId: string;
  provider: string;
  amount: number;
  phoneNumber?: string;
}

export interface BettingVerifyData {
  customerId: string;
  provider: string;
  amount?: number;
  phoneNumber?: string;
}

export interface ServiceResponse {
  success: boolean;
  message?: string;
  data?: any;
  reference?: string;
}

// Get Airtime Providers
export async function getAirtimeProviders(): Promise<ServiceOption[]> {
  try {
    const headers = getAuthHeaders();
    const url = buildApiUrl(API_ENDPOINTS.SERVICES.AIRTIME);
    
    console.log('[Airtime Service] Fetching providers from:', url);
    console.log('[Airtime Service] Headers:', headers);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });

    const data = await response.json();
    
    console.log('[Airtime Service] Response status:', response.status);
    console.log('[Airtime Service] Response data:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch airtime providers');
    }

    // Handle different response formats
    const providers = Array.isArray(data) ? data : (data.data || []);
    
    console.log('[Airtime Service] Parsed providers:', providers);
    
    // Ensure providers have the correct format
    return providers.map((provider: any) => ({
      id: provider.id || provider.code || provider.name?.toLowerCase(),
      name: provider.name || provider.code,
      code: provider.code || provider.name?.toUpperCase(),
    }));
  } catch (error) {
    console.error('[Airtime Service] Get providers error:', error);
    throw error;
  }
}

// Buy Airtime
export async function buyAirtime(airtimeData: AirtimeData): Promise<ServiceResponse> {
  try {
    const url = '/api/services/airtime';
    const headers = getAuthHeaders();
    
    console.log('[Airtime Service] Buying airtime to:', url);
    console.log('[Airtime Service] Request body:', airtimeData);
    console.log('[Airtime Service] Headers:', headers);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(airtimeData),
    });

    const data = await response.json();
    
    console.log('[Airtime Service] Response status:', response.status);
    console.log('[Airtime Service] Response data:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Failed to buy airtime');
    }

    return data;
  } catch (error) {
    console.error('[Airtime Service] Buy airtime error:', error);
    throw error;
  }
}

// Get Data Variations for Network
export async function getDataVariations(network: string): Promise<ServiceOption[]> {
  try {
    const headers = getAuthHeaders();
    const url = `/api/services/data?network=${encodeURIComponent(network)}`;
    
    console.log('[Data Service] Fetching variations for network:', network);
    console.log('[Data Service] Fetching from:', url);
    console.log('[Data Service] Headers:', headers);

    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });

    const data = await response.json();
    
    console.log('[Data Service] Response status:', response.status);
    console.log('[Data Service] Full response data:', JSON.stringify(data, null, 2));
    console.log('[Data Service] Response type:', typeof data);
    console.log('[Data Service] Is array?', Array.isArray(data));
    if (data.data) console.log('[Data Service] data.data type:', typeof data.data, 'Is array?', Array.isArray(data.data));

    if (!response.ok) {
      console.error('[Data Service] Response not OK:', response.status, data);
      throw new Error(data.message || 'Failed to fetch data variations');
    }

    // Handle different response formats
    let variations: any[] = [];
    if (Array.isArray(data)) {
      variations = data;
      console.log('[Data Service] Response is direct array');
    } else if (data.data && Array.isArray(data.data)) {
      variations = data.data;
      console.log('[Data Service] Response is data.data array');
    } else if (data.result && Array.isArray(data.result)) {
      variations = data.result;
      console.log('[Data Service] Response is result array');
    } else if (data.variations && Array.isArray(data.variations)) {
      variations = data.variations;
      console.log('[Data Service] Response is variations array');
    } else {
      console.warn('[Data Service] Could not find array in response:', data);
      variations = [];
    }
    
    console.log('[Data Service] Parsed variations count:', variations.length);
    console.log('[Data Service] Parsed variations:', JSON.stringify(variations, null, 2));
    
    if (variations.length === 0) {
      console.warn('[Data Service] No variations found in response');
      return [];
    }

    return variations.map((variation: any) => {
      const formatted = {
        id: variation.id || variation.variationId || variation.variation_id,
        name: variation.name || variation.title,
        code: variation.code || variation.variation_code,
        amount: variation.amount || variation.price,
        validity: variation.validity || variation.duration,
      };
      console.log('[Data Service] Formatted variation:', formatted);
      return formatted;
    });
  } catch (error) {
    console.error('[Data Service] Get variations error:', error);
    console.error('[Data Service] Error stack:', error instanceof Error ? error.stack : 'N/A');
    throw error;
  }
}

// Buy Data
export async function buyData(dataData: DataData): Promise<ServiceResponse> {
  try {
    const url = '/api/services/data';
    const headers = getAuthHeaders();
    
    console.log('[Data Service] Buying data to:', url);
    console.log('[Data Service] Request body:', dataData);
    console.log('[Data Service] Headers:', headers);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(dataData),
    });

    const data = await response.json();
    
    console.log('[Data Service] Response status:', response.status);
    console.log('[Data Service] Response data:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Failed to buy data');
    }

    return data;
  } catch (error) {
    console.error('[Data Service] Buy data error:', error);
    throw error;
  }
}

// Get Electricity DISCOs/Providers
export async function getElectricityDISCOs(): Promise<ServiceOption[]> {
  try {
    const headers = getAuthHeaders();
    const url = `/api/services/electricity`;
    
    console.log('[Electricity Service] ✓ Fetching DISCOs...');

    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });

    const data = await response.json();

    if (!response.ok) {
      console.log('[Electricity Service] ℹ Backend endpoint unavailable (will use local fallback)');
      throw new Error(data.message || 'Failed to fetch DISCOs');
    }

    // Handle different response formats
    let discos: any[] = [];
    if (Array.isArray(data)) {
      discos = data;
    } else if (data.data && Array.isArray(data.data)) {
      discos = data.data;
    } else if (data.providers && Array.isArray(data.providers)) {
      discos = data.providers;
    } else if (data.discos && Array.isArray(data.discos)) {
      discos = data.discos;
    } else {
      discos = [];
    }

    if (discos.length === 0) {
      throw new Error('No DISCOs found in response');
    }

    console.log('[Electricity Service] ✓ Loaded DISCOs:', discos.length);
    return discos.map((disco: any) => ({
      id: disco.id || disco.code,
      name: disco.name || disco.title,
      code: disco.code || disco.id,
    }));
  } catch (error) {
    console.log('[Electricity Service] ℹ Using local DISCO data');
    throw error;
  }
}

// Verify Electricity Meter
export async function verifyElectricityMeter(disco: string, meterNumber: string, meterType: string = 'prepaid'): Promise<ServiceResponse> {
  try {
    const headers = getAuthHeaders();
    const url = `/api/services/electricity/verify`;
    
    console.log('[Electricity Service] 📋 Verification Request Details:');
    console.log('[Electricity Service] - DISCO input:', disco, `(type: ${typeof disco})`);
    console.log('[Electricity Service] - Meter Number input:', meterNumber, `(type: ${typeof meterNumber})`);
    console.log('[Electricity Service] - Meter Type input:', meterType, `(type: ${typeof meterType})`);

    const requestPayload = {
      disco,
      meterNumber,
      meterType,
    };

    console.log('[Electricity Service] 📤 Full request payload:', JSON.stringify(requestPayload, null, 2));

    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestPayload),
    });

    const data = await response.json();

    console.log('[Electricity Service] 📊 Verify response status:', response.status);
    console.log('[Electricity Service] 📦 Verify response data:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('[Electricity Service] ❌ Verify failed with status', response.status);
      console.error('[Electricity Service] Full error response:', JSON.stringify(data, null, 2));
      
      // Build comprehensive error message
      let detailedError = data?.message || 'Verification failed';
      
      // Add details if available
      if (data?.details && typeof data.details === 'object') {
        const detailsStr = Object.entries(data.details)
          .map(([key, value]) => `${key}: ${value}`)
          .join('; ');
        if (detailsStr) {
          detailedError += ` [${detailsStr}]`;
        }
      }
      
      // Add validation errors if available
      if (data?.validation_errors) {
        detailedError += ` - Validation: ${JSON.stringify(data.validation_errors)}`;
      }
      
      // Add payload info for debugging
      if (data?.sentPayload) {
        console.error('[Electricity Service] Sent payload was:', JSON.stringify(data.sentPayload, null, 2));
      } else {
        console.error('[Electricity Service] Request payload was:', JSON.stringify({ disco, meterNumber, meterType }, null, 2));
      }
      
      throw new Error(detailedError);
    }

    // Handle both success and failed but ok responses
    if (data.success === false) {
      throw new Error(data.message || 'Verification returned success: false');
    }

    // Ensure response has correct structure for verification
    if (data.success || data.data) {
      // Handle various response formats from backend
      return {
        success: true,
        data: {
          customerName: data.data?.customerName || data.data?.customer_name || data.customerName || 'Verified Customer',
        },
      };
    }

    return data;
  } catch (error) {
    console.error('[Electricity Service] ❌ Verify meter error:', error);
    throw error;
  }
}

// Buy Electricity
export async function buyElectricity(electricityData: ElectricityData): Promise<ServiceResponse> {
  try {
    const headers = getAuthHeaders();
    const url = `/api/services/electricity`;
    
    console.log('[Electricity Service] Buying electricity');
    console.log('[Electricity Service] Request body:', electricityData);

    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(electricityData),
    });

    const data = await response.json();

    console.log('[Electricity Service] Response status:', response.status);
    console.log('[Electricity Service] Response data:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('[Electricity Service] Buy electricity failed with status', response.status);
      console.error('[Electricity Service] Error details:', {
        message: data?.message || 'No message',
        errors: data?.errors || data?.details || 'No additional error info',
        fullResponse: data,
      });
      
      // Check for specific error messages
      const errorMessage = data?.message || 'Failed to buy electricity';
      
      // Special handling for BVN verification requirement
      if (errorMessage.includes('BVN') || errorMessage.includes('verification')) {
        throw new Error('Please verify your BVN in your profile before purchasing electricity.');
      }
      
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error('[Electricity Service] Buy electricity error:', error);
    throw error;
  }
}


// Get TV Providers
export async function getTVProviders(): Promise<ServiceOption[]> {
  try {
    const headers = getAuthHeaders();
    const url = `/api/services/tv`;
    
    console.log('[TV Service] ✓ Attempting to fetch providers...');

    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });

    const data = await response.json();

    if (!response.ok) {
      console.log('[TV Service] ℹ Backend endpoint unavailable, using local data');
      throw new Error(data.message || 'Failed to fetch TV providers');
    }

    // Handle different response formats
    let providers: any[] = [];
    if (Array.isArray(data)) {
      providers = data;
    } else if (data.data && Array.isArray(data.data)) {
      providers = data.data;
    } else if (data.providers && Array.isArray(data.providers)) {
      providers = data.providers;
    } else {
      providers = [];
    }

    if (providers.length === 0) {
      throw new Error('No providers found in response');
    }

    console.log('[TV Service] ✓ Loaded providers:', providers.length);
    return providers.map((provider: any) => ({
      id: provider.id || provider.code,
      name: provider.name || provider.title,
      code: provider.code || provider.id,
    }));
  } catch (error) {
    console.log('[TV Service] ℹ Using local provider data');
    throw error;
  }
}

// Get TV Variations for Provider
export async function getTVVariations(provider: string): Promise<ServiceOption[]> {
  try {
    const headers = getAuthHeaders();
    const url = buildApiUrl(API_ENDPOINTS.SERVICES.TV_VARIATIONS, { provider: provider.toUpperCase() });
    
    console.log('[TV Service] Fetching variations for:', provider);
    console.log('[TV Service] Variations URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });

    const data = await response.json();

    console.log('[TV Service] Variations response:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch TV variations');
    }

    // Handle different response formats
    let variations: any[] = [];
    if (Array.isArray(data)) {
      variations = data;
    } else if (data.data && Array.isArray(data.data)) {
      variations = data.data;
    } else if (data.variations && Array.isArray(data.variations)) {
      variations = data.variations;
    }

    console.log('[TV Service] ✓ Loaded variations:', variations.length);
    
    return variations.map((variation: any) => ({
      id: variation.id || variation.code,
      name: variation.name || variation.title || variation.code,
      code: variation.code || variation.id,
      amount: variation.amount || variation.price || 0,
      validity: variation.validity || '',
    }));
  } catch (error) {
    console.error('[TV Service] Get TV variations error:', error);
    throw error;
  }
}

// Verify TV Smartcard
export async function verifyTVSmartcard(verifyData: TVVerifyData): Promise<ServiceResponse> {
  try {
    const headers = getAuthHeaders();
    const url = buildApiUrl(API_ENDPOINTS.SERVICES.TV_VERIFY);
    
    const payload = {
      smartcardNumber: verifyData.smartcardNumber,
      provider: verifyData.provider,
    };
    
    console.log('[TV Service] Verifying smartcard with:');
    console.log('[TV Service] - Smartcard Number:', payload.smartcardNumber);
    console.log('[TV Service] - Provider:', payload.provider);
    console.log('[TV Service] Full request payload:', JSON.stringify(payload, null, 2));

    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    console.log('[TV Service] Verify response status:', response.status);
    console.log('[TV Service] Verify response data:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('[TV Service] Verify failed with status', response.status);
      console.error('[TV Service] Error details:', {
        message: data?.message || 'No message',
        errors: data?.errors || data?.details || 'No additional error info',
        fullResponse: JSON.stringify(data),
      });
      throw new Error(data?.message || `Verification failed (${response.status})`);
    }

    // Handle both success and failed but ok responses
    if (data.success === false) {
      throw new Error(data.message || 'Verification returned success: false');
    }

    // Ensure response has correct structure for verification
    if (data.success || data.data) {
      return {
        success: true,
        data: {
          customerName: data.data?.customerName || data.data?.customer_name || data.customerName || 'Verified Customer',
        },
      };
    }

    return data;
  } catch (error) {
    console.error('[TV Service] Verify smartcard error:', error);
    throw error;
  }
}

// Buy TV Subscription
export async function buyTVSubscription(tvData: TVData): Promise<ServiceResponse> {
  try {
    const headers = getAuthHeaders();
    const url = buildApiUrl(API_ENDPOINTS.SERVICES.TV);
    
    const payload = {
      smartcardNumber: tvData.smartcardNumber,
      provider: tvData.provider.toUpperCase(),
      variationCode: tvData.variationCode,
      amount: tvData.amount,
      ...(tvData.phoneNumber && { phoneNumber: tvData.phoneNumber }),
    };
    
    console.log('[TV Service] Buying TV subscription');
    console.log('[TV Service] Request body:', JSON.stringify(payload, null, 2));

    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    console.log('[TV Service] Response status:', response.status);
    console.log('[TV Service] Response data:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('[TV Service] Buy TV failed with status', response.status);
      console.error('[TV Service] Error details:', {
        message: data?.message || 'No message',
        errors: data?.errors || data?.details || 'No additional error info',
        fullResponse: data,
      });
      throw new Error(data?.message || 'Failed to buy TV subscription');
    }

    return data;
  } catch (error) {
    console.error('[TV Service] Buy TV subscription error:', error);
    throw error;
  }
}

// Verify Betting Account
export async function getBettingProviders(): Promise<ServiceOption[]> {
  try {
    const headers = getAuthHeaders();
    const url = `/api/services/betting`;
    
    console.log('[Betting Service] ✓ Attempting to fetch providers...');

    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });

    const data = await response.json();

    if (!response.ok) {
      console.log('[Betting Service] ℹ Backend endpoint unavailable, using local data');
      throw new Error(data.message || 'Failed to fetch betting providers');
    }

    // Handle different response formats
    let providers: any[] = [];
    if (Array.isArray(data)) {
      providers = data;
    } else if (data.data && Array.isArray(data.data)) {
      providers = data.data;
    } else if (data.providers && Array.isArray(data.providers)) {
      providers = data.providers;
    } else {
      providers = [];
    }

    if (providers.length === 0) {
      throw new Error('No providers found in response');
    }

    console.log('[Betting Service] ✓ Loaded providers:', providers.length);
    return providers.map((provider: any) => ({
      id: provider.id || provider.code,
      name: provider.name || provider.title,
      code: provider.code || provider.id,
    }));
  } catch (error) {
    console.log('[Betting Service] ℹ Using local provider data');
    throw error;
  }
}

// Verify Betting Account
export async function verifyBettingAccount(verifyData: BettingVerifyData): Promise<ServiceResponse> {
  try {
    const headers = getAuthHeaders();
    const url = buildApiUrl(API_ENDPOINTS.SERVICES.BETTING_VERIFY);
    
    const payload = {
      customerId: verifyData.customerId,
      provider: verifyData.provider.toUpperCase(),
      ...(verifyData.amount && { amount: verifyData.amount }),
      ...(verifyData.phoneNumber && { phoneNumber: verifyData.phoneNumber }),
    };
    
    console.log('[Betting Service] Verifying account:', payload);
    console.log('[Betting Service] Request payload:', JSON.stringify(payload, null, 2));

    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    console.log('[Betting Service] Verify response status:', response.status);
    console.log('[Betting Service] Verify response data:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('[Betting Service] Verify failed with status', response.status);
      console.error('[Betting Service] Error details:', {
        message: data?.message || 'No message',
        errors: data?.errors || data?.details || 'No additional error info',
        validation_errors: data?.validation_errors,
        fullResponse: JSON.stringify(data, null, 2),
      });
      throw new Error(data?.message || `Verification failed (${response.status})`);
    }

    // Handle both success and failed but ok responses
    if (data.success === false) {
      throw new Error(data.message || 'Verification returned success: false');
    }

    // Ensure response has correct structure for verification
    if (data.success || data.data) {
      return {
        success: true,
        data: {
          customerName: data.data?.customerName || data.data?.customer_name || data.customerName || 'Verified Account',
        },
      };
    }

    return data;
  } catch (error) {
    console.error('[Betting Service] Verify account error:', error);
    throw error;
  }
}

// Fund Betting Account
export async function fundBettingAccount(bettingData: BettingData): Promise<ServiceResponse> {
  try {
    const headers = getAuthHeaders();
    const url = buildApiUrl(API_ENDPOINTS.SERVICES.BETTING);
    
    const payload = {
      customerId: bettingData.customerId,
      provider: bettingData.provider.toUpperCase(),
      amount: bettingData.amount,
      ...(bettingData.phoneNumber && { phoneNumber: bettingData.phoneNumber }),
    };
    
    console.log('[Betting Service] Funding betting account');
    console.log('[Betting Service] Request body:', JSON.stringify(payload, null, 2));

    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    console.log('[Betting Service] Response status:', response.status);
    console.log('[Betting Service] Response data:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('[Betting Service] Fund account failed with status', response.status);
      console.error('[Betting Service] Error details:', {
        message: data?.message || 'No message',
        errors: data?.errors || data?.details || 'No additional error info',
        fullResponse: data,
      });
      throw new Error(data?.message || 'Failed to fund betting account');
    }

    return data;
  } catch (error) {
    console.error('[Betting Service] Fund account error:', error);
    throw error;
  }
}

// Get Service Order Details
export async function getServiceOrder(orderId: string): Promise<ServiceResponse> {
  try {
    const response = await fetch(buildApiUrl(`${API_ENDPOINTS.SERVICES.ORDERS}/${orderId}`), {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch order details');
    }

    return data;
  } catch (error) {
    console.error('Get service order error:', error);
    throw error;
  }
}

// Get Service History
export async function getServiceHistory(
  service: string,
  limit: number = 20,
  page: number = 1
): Promise<ServiceResponse> {
  try {
    const response = await fetch(buildApiUrl(API_ENDPOINTS.SERVICES.HISTORY, { service, limit, page }), {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch service history');
    }

    return data;
  } catch (error) {
    console.error('Get service history error:', error);
    throw error;
  }
}
