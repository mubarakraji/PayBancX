import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://pb-production-fd26.up.railway.app/api/v1';

if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
  console.warn('NEXT_PUBLIC_API_BASE_URL is not defined, using default API URL');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('[Register Proxy] Sending request to:', `${API_BASE_URL}/auth/register`);
    console.log('[Register Proxy] Request body:', body);

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const contentType = response.headers.get('content-type');
    console.log('[Register Proxy] Response status:', response.status);
    console.log('[Register Proxy] Response content-type:', contentType);

    // Check if response is JSON
    if (!contentType?.includes('application/json')) {
      const text = await response.text();
      console.error('[Register Proxy] Non-JSON response received:', text.substring(0, 200));
      return NextResponse.json(
        { success: false, message: 'Server returned invalid response (expected JSON)' },
        { status: 502 }
      );
    }

    const data = await response.json();
    console.log('[Register Proxy] Response data:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('[Register Proxy] Error response:', { status: response.status, data });
      return NextResponse.json(
        { 
          success: false, 
          message: data.message || 'Registration failed',
          errors: data.errors,
          data: data.data
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[Register Proxy] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
