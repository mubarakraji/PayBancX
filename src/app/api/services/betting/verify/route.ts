import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://pb-production-fd26.up.railway.app/api/v1';

// POST - Verify betting account
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const body = await request.json();

    const { username, provider } = body;

    if (!authHeader) {
      console.log('[Betting Verify API] ❌ No auth header');
      return NextResponse.json(
        { success: false, message: 'Authorization header missing' },
        { status: 401 }
      );
    }

    if (!username || !provider) {
      console.log('[Betting Verify API] ❌ Missing required fields:', { username, provider });
      return NextResponse.json(
        { success: false, message: 'Missing required fields: username, provider' },
        { status: 400 }
      );
    }

    const backendUrl = `${API_BASE_URL}/services/betting/verify`;
    console.log('[Betting Verify API] 🔍 Verifying account:', username);
    console.log('[Betting Verify API] 🔗 Backend URL:', backendUrl);

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({
        username: username?.toString(),
        provider: provider?.toLowerCase(),
      }),
    });

    const data = await response.json();

    console.log('[Betting Verify API] 📊 Backend response status:', response.status);
    console.log('[Betting Verify API] 📦 Backend response:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('[Betting Verify API] ❌ Backend error:', response.status, data);
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to verify betting account' },
        { status: response.status }
      );
    }

    console.log('[Betting Verify API] ✅ Account verified successfully');
    return NextResponse.json(data);
  } catch (error) {
    console.error('[Betting Verify API] ❌ POST error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: String(error) },
      { status: 500 }
    );
  }
}
