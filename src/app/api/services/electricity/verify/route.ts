import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://pb-production-fd26.up.railway.app/api/v1';

// POST - Verify electricity meter
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const body = await request.json();

    const { disco, service_id, serviceId, meterNumber, meterType } = body;
    const resolvedDisco = (disco || service_id || serviceId || '').toString().trim();
    const resolvedServiceId = (service_id || serviceId || resolvedDisco).toString().trim().toUpperCase();

    console.log('[Electricity Verify API] 📥 Received request body:', JSON.stringify(body, null, 2));
    console.log('[Electricity Verify API] 🔑 Extracted fields:', { disco: resolvedDisco, service_id: resolvedServiceId, meterNumber, meterType });

    if (!authHeader) {
      console.log('[Electricity Verify API] ❌ No auth header');
      return NextResponse.json(
        { success: false, message: 'Authorization header missing' },
        { status: 401 }
      );
    }

    if (!resolvedDisco || !meterNumber) {
      console.log('[Electricity Verify API] ❌ Missing required fields:', { disco: resolvedDisco, meterNumber });
      return NextResponse.json(
        { success: false, message: 'Missing required fields: disco or service_id, meterNumber' },
        { status: 400 }
      );
    }

    const discoUpper = resolvedDisco.toUpperCase();
    const meterStr = meterNumber?.toString();
    const meterTypeStr = (meterType || 'prepaid')?.toLowerCase();

    console.log('[Electricity Verify API] ✅ Transformed fields:', { disco: discoUpper, meterNumber: meterStr, meterType: meterTypeStr });

    // Validate meter number is numeric
    if (!/^\d+$/.test(meterStr)) {
      console.log('[Electricity Verify API] ❌ Invalid meter number format - not all digits:', meterStr);
      return NextResponse.json(
        { success: false, message: 'Meter number must contain only digits' },
        { status: 400 }
      );
    }

    // Validate meter type
    if (!['prepaid', 'postpaid'].includes(meterTypeStr)) {
      console.log('[Electricity Verify API] ❌ Invalid meter type:', meterTypeStr);
      return NextResponse.json(
        { success: false, message: 'Meter type must be either prepaid or postpaid' },
        { status: 400 }
      );
    }

    const backendUrl = `${API_BASE_URL}/services/electricity/verify`;

    const requestPayload = {
      disco: discoUpper,
      service_id: resolvedServiceId,
      meterNumber: meterStr,
      meterType: meterTypeStr,
    };

    console.log('[Electricity Verify API] 📤 Sending to backend:', JSON.stringify(requestPayload, null, 2));

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(requestPayload),
    });

    const data = await response.json();

    console.log('[Electricity Verify API] 📊 Backend response status:', response.status);
    console.log('[Electricity Verify API] 📦 Backend response:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('[Electricity Verify API] ❌ Backend error:', response.status, data);
      
      // Extract detailed error information from backend
      const errorMessage = data.message || 'Failed to verify meter';
      const errorDetails: any = {};
      
      // Handle various error response formats from backend
      if (typeof data.errors === 'object') {
        Object.assign(errorDetails, data.errors);
      } else if (typeof data.details === 'object') {
        Object.assign(errorDetails, data.details);
      } else if (data.error) {
        errorDetails.error = data.error;
      }
      
      // If backend provides validation errors, include them
      if (data.validation_errors) {
        errorDetails.validation_errors = data.validation_errors;
      }
      
      console.error('[Electricity Verify API] Error details:', errorDetails);
      
      return NextResponse.json(
        { 
          success: false, 
          message: errorMessage,
          details: errorDetails,
          backendStatus: response.status,
          sentPayload: requestPayload, // Include what we sent for debugging
        },
        { status: response.status }
      );
    }

    console.log('[Electricity Verify API] ✅ Meter verified successfully');
    return NextResponse.json(data);
  } catch (error) {
    console.error('[Electricity Verify API] ❌ POST error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: String(error) },
      { status: 500 }
    );
  }
}
