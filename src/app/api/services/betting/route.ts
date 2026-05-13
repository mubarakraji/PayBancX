import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://pb-production-fd26.up.railway.app/api/v1';

// GET - Fetch betting providers
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      console.log('[Betting API] ❌ No auth header');
      return NextResponse.json(
        { success: false, message: 'Authorization header missing' },
        { status: 401 }
      );
    }

    const backendUrl = `${API_BASE_URL}/services/betting`;

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.log('[Betting API] ℹ Backend endpoint unavailable (will use fallback)');
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to fetch betting providers' },
        { status: response.status }
      );
    }

    console.log('[Betting API] ✓ Providers loaded from backend');
    return NextResponse.json(data);
  } catch (error) {
    console.error('[Betting API] ❌ GET error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: String(error) },
      { status: 500 }
    );
  }
}

// POST - Fund betting account
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const body = await request.json();

    if (!authHeader) {
      console.log('[Betting API] ❌ No auth header');
      return NextResponse.json(
        { success: false, message: 'Authorization header missing' },
        { status: 401 }
      );
    }

    const { provider, username, amount } = body;

    if (!provider || !username || !amount) {
      console.log('[Betting API] ❌ Missing required fields');
      return NextResponse.json(
        { success: false, message: 'Provider, username, and amount are required' },
        { status: 400 }
      );
    }

    const backendUrl = `${API_BASE_URL}/services/betting`;

    console.log('[Betting API] 🔗 Backend URL:', backendUrl);
    console.log('[Betting API] 📝 Request body:', { provider, username, amount });

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({
        provider: provider?.toLowerCase(),
        username: username?.toString(),
        amount,
      }),
    });

    const data = await response.json();

    console.log('[Betting API] 📊 Backend response status:', response.status);
    console.log('[Betting API] 📦 Backend response:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('[Betting API] ❌ Backend funding failed:', response.status, data);
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to fund betting account' },
        { status: response.status }
      );
    }

    console.log('[Betting API] ✓ Funding successful');
    return NextResponse.json(data);
  } catch (error) {
    console.error('[Betting API] ❌ POST error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: String(error) },
      { status: 500 }
    );
  }
}
