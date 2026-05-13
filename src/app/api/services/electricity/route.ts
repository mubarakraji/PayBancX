import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://pb-production-fd26.up.railway.app/api/v1';

// GET - Fetch electricity providers/DISCOs
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      console.log('[Electricity API] ❌ No auth header');
      return NextResponse.json(
        { success: false, message: 'Authorization header missing' },
        { status: 401 }
      );
    }

    const backendUrl = `${API_BASE_URL}/services/electricity`;

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.log('[Electricity API] ℹ Backend endpoint unavailable (will use fallback)');
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to fetch DISCOs' },
        { status: response.status }
      );
    }

    console.log('[Electricity API] ✓ DISCOs loaded from backend');
    return NextResponse.json(data);
  } catch (error) {
    console.error('[Electricity API] ❌ GET error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: String(error) },
      { status: 500 }
    );
  }
}

// POST - Verify meter and purchase electricity
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const body = await request.json();

    const { disco, meterType, meterNumber, amount } = body;

    if (!authHeader) {
      console.log('[Electricity API] ❌ No auth header');
      return NextResponse.json(
        { success: false, message: 'Authorization header missing' },
        { status: 401 }
      );
    }

    if (!disco || !meterType || !meterNumber) {
      console.log('[Electricity API] ❌ Missing required fields:', { disco, meterType, meterNumber });
      return NextResponse.json(
        { success: false, message: 'Missing required fields: disco, meterType, meterNumber' },
        { status: 400 }
      );
    }

    const backendUrl = `${API_BASE_URL}/services/electricity`;
    console.log('[Electricity API] 💳 Processing electricity purchase');
    console.log('[Electricity API] 🔗 Backend URL:', backendUrl);
    console.log('[Electricity API] 📝 Request body:', { disco, meterType, meterNumber, amount });

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({
        disco,
        meterType,
        meterNumber,
        amount,
      }),
    });

    const data = await response.json();
    
    console.log('[Electricity API] 📊 Backend response status:', response.status);
    console.log('[Electricity API] 📦 Backend response:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('[Electricity API] ❌ Backend error:', response.status, data);
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to process electricity' },
        { status: response.status }
      );
    }

    console.log('[Electricity API] ✅ Electricity purchase successful');
    return NextResponse.json(data);
  } catch (error) {
    console.error('[Electricity API] ❌ POST error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: String(error) },
      { status: 500 }
    );
  }
}
