import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://pb-production-fd26.up.railway.app/api/v1';

// GET - Fetch Data Variations for Network
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const network = request.nextUrl.searchParams.get('network');
    
    if (!authHeader) {
      console.log('[Data Variations API] ❌ No auth header');
      return NextResponse.json(
        { success: false, message: 'Authorization header missing' },
        { status: 401 }
      );
    }

    if (!network) {
      console.log('[Data Variations API] ❌ No network parameter');
      return NextResponse.json(
        { success: false, message: 'Network parameter required' },
        { status: 400 }
      );
    }

    const backendUrl = `${API_BASE_URL}/services/data/variations?network=${network}`;
    console.log('[Data Variations API] 🔍 Fetching variations for network:', network);
    console.log('[Data Variations API] 🔗 Backend URL:', backendUrl);

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    });

    const data = await response.json();
    
    console.log('[Data Variations API] 📊 Backend response status:', response.status);

    if (!response.ok) {
      console.error('[Data Variations API] ❌ Backend error:', response.status);
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to fetch data variations' },
        { status: response.status }
      );
    }

    console.log('[Data Variations API] ✅ Successfully fetched data variations');
    return NextResponse.json(data);

  } catch (error) {
    console.error('[Data Variations API] ❌ Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: String(error) },
      { status: 500 }
    );
  }
}
