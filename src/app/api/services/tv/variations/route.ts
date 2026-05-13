import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://pb-production-fd26.up.railway.app/api/v1';

// GET - Fetch TV variations for a provider
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      console.log('[TV Variations API] ❌ No auth header');
      return NextResponse.json(
        { success: false, message: 'Authorization header missing' },
        { status: 401 }
      );
    }

    // Get provider from query parameters
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get('provider');

    if (!provider) {
      console.log('[TV Variations API] ❌ Missing provider parameter');
      return NextResponse.json(
        { success: false, message: 'Provider parameter is required' },
        { status: 400 }
      );
    }

    const backendUrl = `${API_BASE_URL}/services/tv/variations?provider=${encodeURIComponent(provider)}`;
    console.log('[TV Variations API] 🔍 Fetching variations for provider:', provider);
    console.log('[TV Variations API] 🔗 Backend URL:', backendUrl);

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    });

    const data = await response.json();

    console.log('[TV Variations API] 📊 Backend response status:', response.status);
    console.log('[TV Variations API] 📦 Backend response:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('[TV Variations API] ❌ Backend error:', response.status, data);
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to fetch TV variations' },
        { status: response.status }
      );
    }

    console.log('[TV Variations API] ✅ Variations fetched successfully');
    return NextResponse.json(data);
  } catch (error) {
    console.error('[TV Variations API] ❌ GET error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: String(error) },
      { status: 500 }
    );
  }
}
