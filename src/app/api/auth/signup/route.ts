import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://pb-production-fd26.up.railway.app/api/v1';

if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
  console.warn('NEXT_PUBLIC_API_BASE_URL is not defined, using default API URL');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('[Signup Proxy] Sending request to:', `${API_BASE_URL}/auth/register`);
    console.log('[Signup Proxy] Request body:', body);

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const contentType = response.headers.get('content-type');
    console.log('[Signup Proxy] Response status:', response.status);
    console.log('[Signup Proxy] Response content-type:', contentType);

    // Check if response is JSON
    if (!contentType?.includes('application/json')) {
      const text = await response.text();
      console.error('[Signup Proxy] Non-JSON response received:', text.substring(0, 200));
      return NextResponse.json(
        { success: false, message: 'Server returned invalid response (expected JSON)' },
        { status: 502 }
      );
    }

    const data = await response.json();
    console.log('[Signup Proxy] Response data:', data);

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Signup failed' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[Signup Proxy] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
