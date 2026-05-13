import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://pb-production-fd26.up.railway.app/api/v1';

export async function GET(request: NextRequest) {
  try {
    console.log('[Privacy] Fetching privacy policy');

    const response = await fetch(`${API_BASE_URL}/auth/privacy`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const contentType = response.headers.get('content-type');
    console.log('[Privacy] Response status:', response.status);

    if (!contentType?.includes('application/json')) {
      const text = await response.text();
      console.error('[Privacy] Non-JSON response:', text.substring(0, 200));
      return NextResponse.json(
        { success: false, message: 'Server returned invalid response' },
        { status: 502 }
      );
    }

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to fetch privacy policy' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[Privacy] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
