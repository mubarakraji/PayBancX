import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://pb-production-fd26.up.railway.app/api/v1';

// GET - Fetch Data Variations for Network
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const network = request.nextUrl.searchParams.get('network');
    
    if (!authHeader) {
      console.log('[Data API] ❌ No auth header');
      return NextResponse.json(
        { success: false, message: 'Authorization header missing' },
        { status: 401 }
      );
    }

    if (!network) {
      console.log('[Data API] ❌ No network parameter');
      return NextResponse.json(
        { success: false, message: 'Network parameter missing' },
        { status: 400 }
      );
    }

    const backendUrl = `${API_BASE_URL}/services/data/variations?network=${network}`;
    console.log('[Data API] 🔍 Fetching variations for network:', network);
    console.log('[Data API] 🔗 Backend URL:', backendUrl);
    console.log('[Data API] 🔐 Auth header present:', !!authHeader);

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    });

    const data = await response.json();
    
    console.log('[Data API] 📊 Backend response status:', response.status);
    console.log('[Data API] 📦 Backend response (full):', JSON.stringify(data, null, 2));
    console.log('[Data API] 📋 Response type:', typeof data);
    console.log('[Data API] 📋 Is array?', Array.isArray(data));
    if (data.data) console.log('[Data API] 📋 data.data type:', typeof data.data, 'Is array?', Array.isArray(data.data));

    if (!response.ok) {
      console.error('[Data API] ❌ Backend error:', response.status, data);
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to fetch data variations' },
        { status: response.status }
      );
    }

    console.log('[Data API] ✅ Backend returned successfully');
    return NextResponse.json(data);
  } catch (error) {
    console.error('[Data API] ❌ GET error:', error);
    console.error('[Data API] Error details:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: String(error) },
      { status: 500 }
    );
  }
}

// POST - Buy Data
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: 'Authorization header missing' },
        { status: 401 }
      );
    }

    const body = await request.json();

    console.log('[Data API] Buying data with payload:', body);
    console.log('[Data API] Sending to backend:', `${API_BASE_URL}/services/data`);

    const response = await fetch(`${API_BASE_URL}/services/data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    console.log('[Data API] Backend response status:', response.status);
    console.log('[Data API] Backend response data:', data);

    if (!response.ok) {
      console.error('[Data API] Backend error:', data);
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to buy data' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[Data API] POST error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: String(error) },
      { status: 500 }
    );
  }
}
