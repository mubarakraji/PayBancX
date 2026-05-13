import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://pb-production-fd26.up.railway.app/api/v1';

// GET - Fetch Airtime Providers
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: 'Authorization header missing' },
        { status: 401 }
      );
    }

    console.log('[Airtime API] Fetching providers from backend:', `${API_BASE_URL}/services/airtime`);

    const response = await fetch(`${API_BASE_URL}/services/airtime`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    });

    const data = await response.json();
    
    console.log('[Airtime API] Backend response status:', response.status);
    console.log('[Airtime API] Backend response data:', data);

    if (!response.ok) {
      console.error('[Airtime API] Backend error:', data);
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to fetch providers' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[Airtime API] GET error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: String(error) },
      { status: 500 }
    );
  }
}

// POST - Buy Airtime
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

    console.log('[Airtime API] Buying airtime with payload:', body);
    console.log('[Airtime API] Sending to backend:', `${API_BASE_URL}/services/airtime`);

    const response = await fetch(`${API_BASE_URL}/services/airtime`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    console.log('[Airtime API] Backend response status:', response.status);
    console.log('[Airtime API] Backend response data:', data);

    if (!response.ok) {
      console.error('[Airtime API] Backend error:', data);
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to buy airtime' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[Airtime API] POST error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: String(error) },
      { status: 500 }
    );
  }
}
