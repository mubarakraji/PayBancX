import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://pb-production-fd26.up.railway.app/api/v1';

// GET - Fetch TV providers
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      console.log('[TV API] ❌ No auth header');
      return NextResponse.json(
        { success: false, message: 'Authorization header missing' },
        { status: 401 }
      );
    }

    const backendUrl = `${API_BASE_URL}/services/tv`;

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.log('[TV API] ℹ Backend endpoint unavailable (will use fallback)');
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to fetch TV providers' },
        { status: response.status }
      );
    }

    console.log('[TV API] ✓ Providers loaded from backend');
    return NextResponse.json(data);
  } catch (error) {
    console.error('[TV API] ❌ GET error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: String(error) },
      { status: 500 }
    );
  }
}

// POST - Subscribe to TV
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const body = await request.json();

    if (!authHeader) {
      console.log('[TV API] ❌ No auth header');
      return NextResponse.json(
        { success: false, message: 'Authorization header missing' },
        { status: 401 }
      );
    }

    const { smartcardNumber, provider, variationId, amount } = body;

    if (!smartcardNumber || !provider) {
      console.log('[TV API] ❌ Missing required fields');
      return NextResponse.json(
        { success: false, message: 'Smart card number and provider are required' },
        { status: 400 }
      );
    }

    const backendUrl = `${API_BASE_URL}/services/tv`;

    console.log('[TV API] 🔗 Backend URL:', backendUrl);
    console.log('[TV API] 📝 Request body:', { smartcardNumber, provider, variationId, amount });

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({
        smartcardNumber: smartcardNumber?.toString(),
        provider: provider?.toUpperCase(),
        variationId,
        amount,
      }),
    });

    const data = await response.json();

    console.log('[TV API] 📊 Backend response status:', response.status);
    console.log('[TV API] 📦 Backend response:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('[TV API] ❌ Backend subscription failed:', response.status, data);
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to subscribe to TV' },
        { status: response.status }
      );
    }

    console.log('[TV API] ✓ Subscription successful');
    return NextResponse.json(data);
  } catch (error) {
    console.error('[TV API] ❌ POST error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: String(error) },
      { status: 500 }
    );
  }
}
