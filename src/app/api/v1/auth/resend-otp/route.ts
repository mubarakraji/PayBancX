import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://pb-production-fd26.up.railway.app/api/v1';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('[Resend OTP] Request body:', body);

    const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const contentType = response.headers.get('content-type');
    console.log('[Resend OTP] Response status:', response.status);
    console.log('[Resend OTP] Response content-type:', contentType);

    if (!contentType?.includes('application/json')) {
      const text = await response.text();
      console.error('[Resend OTP] Non-JSON response:', text.substring(0, 500));
      return NextResponse.json(
        { success: false, message: 'Server error' },
        { status: 502 }
      );
    }

    const data = await response.json();
    console.log('[Resend OTP] Response data:', data);

    if (!response.ok) {
      console.error('[Resend OTP] Error from backend:', data);
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to resend OTP', errors: data.errors },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[Resend OTP] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
