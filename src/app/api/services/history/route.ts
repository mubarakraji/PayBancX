import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://pb-production-fd26.up.railway.app/api/v1';

// GET - Fetch transaction history
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      console.log('[History API] ❌ No auth header');
      return NextResponse.json(
        { success: false, message: 'Authorization header missing' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const service = searchParams.get('service') || '';
    const limit = searchParams.get('limit') || '20';
    const page = searchParams.get('page') || '1';

    // Build query string
    const queryParams = new URLSearchParams({
      service,
      limit,
      page,
    }).toString();

    const backendUrl = `${API_BASE_URL}/services/history?${queryParams}`;
    console.log('[History API] 📚 Fetching transaction history');
    console.log('[History API] 🔗 Backend URL:', backendUrl);
    console.log('[History API] 📝 Query params:', { service, limit, page });

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    });

    const data = await response.json();

    console.log('[History API] 📊 Backend response status:', response.status);
    console.log('[History API] 📦 Backend response:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('[History API] ❌ Backend error:', response.status, data);
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to fetch transaction history' },
        { status: response.status }
      );
    }

    console.log('[History API] ✅ History fetched successfully');
    return NextResponse.json(data);
  } catch (error) {
    console.error('[History API] ❌ GET error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: String(error) },
      { status: 500 }
    );
  }
}
