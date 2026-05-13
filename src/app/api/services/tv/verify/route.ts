import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://pb-production-fd26.up.railway.app/api/v1';

// POST - Verify TV smartcard
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const body = await request.json();

    const { smartcardNumber, provider } = body;

    if (!authHeader) {
      console.log('[TV Verify API] ❌ No auth header');
      return NextResponse.json(
        { success: false, message: 'Authorization header missing' },
        { status: 401 }
      );
    }

    if (!smartcardNumber || !provider) {
      console.log('[TV Verify API] ❌ Missing required fields:', { smartcardNumber, provider });
      return NextResponse.json(
        { success: false, message: 'Missing required fields: smartcardNumber, provider' },
        { status: 400 }
      );
    }

    const backendUrl = `${API_BASE_URL}/services/tv/verify`;
    console.log('[TV Verify API] 🔍 Verifying smartcard:', smartcardNumber);
    console.log('[TV Verify API] 🔗 Backend URL:', backendUrl);

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({
        smartcardNumber: smartcardNumber?.toString(),
        provider: provider,
      }),
    });

    const data = await response.json();

    console.log('[TV Verify API] 📊 Backend response status:', response.status);
    console.log('[TV Verify API] 📦 Backend response:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('[TV Verify API] ❌ Backend error:', response.status, data);
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to verify smartcard' },
        { status: response.status }
      );
    }

    console.log('[TV Verify API] ✅ Smartcard verified successfully');
    return NextResponse.json(data);
  } catch (error) {
    console.error('[TV Verify API] ❌ POST error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: String(error) },
      { status: 500 }
    );
  }
}
