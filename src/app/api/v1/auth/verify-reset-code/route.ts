import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://pb-production-fd26.up.railway.app/api/v1';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('[Verify OTP for Password Reset] Request body:', { email: body.email, otp: '***' });

    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: body.email,
        otp: body.otp,
      }),
    });

    const contentType = response.headers.get('content-type');
    console.log('[Verify OTP for Password Reset] Response status:', response.status);
    console.log('[Verify Reset Code] Response content-type:', contentType);

    if (!contentType?.includes('application/json')) {
      const text = await response.text();
      console.error('[Verify OTP for Password Reset] Non-JSON response:', text.substring(0, 200));
      return NextResponse.json(
        { success: false, message: 'Server returned invalid response' },
        { status: 502 }
      );
    }

    const data = await response.json();
    console.log('[Verify Reset Code] Response data:', { success: data.success, message: data.message });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Code verification failed' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[Verify Reset Code] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
