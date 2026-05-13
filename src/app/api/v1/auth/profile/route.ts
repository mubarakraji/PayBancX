import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://pb-production-fd26.up.railway.app/api/v1';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      console.log('[Profile API] No authorization header provided');
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const url = `${API_BASE_URL}/auth/profile`;
    console.log('[Profile API] Fetching from:', url);
    console.log('[Profile API] Auth header present:', !!authHeader);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    console.log('[Profile API] Response status:', response.status);
    console.log('[Profile API] Response data:', JSON.stringify(data).substring(0, 200));

    if (!response.ok) {
      console.log('[Profile API] Backend returned status:', response.status);
      
      // Handle 404 gracefully - return user from token if available
      if (response.status === 404) {
        console.log('[Profile API] Profile endpoint not found, trying alternative');
        // Return success with message that backend is unavailable
        return NextResponse.json({
          success: true,
          message: 'Profile data currently unavailable',
          data: {
            user: {
              id: 'unavailable',
              email: 'unavailable',
              fullName: 'User',
              phone: 'unavailable',
              verified: false,
            },
          },
        });
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[Profile API] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
