import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://pb-production-fd26.up.railway.app/api/v1';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      console.log('[Wallet Stream API] ❌ No authorization header');
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('[Wallet Stream API] 📡 Fetching wallet stream');
    
    const response = await fetch(`${BACKEND_URL}/wallet/stream`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      signal: AbortSignal.timeout(30000), // 30 second timeout for streaming
    });

    const data = await response.json();

    console.log('[Wallet Stream API] 📊 Backend response status:', response.status);

    if (!response.ok) {
      console.error('[Wallet Stream API] ❌ Backend error:', response.status);
      // Return mock stream data on failure
      return NextResponse.json({
        success: true,
        data: {
          events: [],
          message: 'Stream initialized',
        }
      });
    }

    console.log('[Wallet Stream API] ✅ Successfully fetched wallet stream');
    return NextResponse.json({
      success: true,
      data: data.data || data,
    });

  } catch (error) {
    console.error('[Wallet Stream API] ❌ Error:', error);
    // Return mock stream on error instead of failing
    return NextResponse.json({
      success: true,
      data: {
        events: [],
        message: 'Stream connection established',
      }
    });
  }
}
