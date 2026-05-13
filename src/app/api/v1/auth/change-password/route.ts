import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://pb-production-fd26.up.railway.app/api/v1';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      console.log('[Change Password API] No authorization header');
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log('[Change Password API] Request body:', { oldPassword: '***', newPassword: '***' });

    const response = await fetch(`${BACKEND_URL}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log('[Change Password API] Response:', data);

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to change password' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: data.message || 'Password changed successfully',
    });
  } catch (error) {
    console.error('[Change Password API] Catch error:', error);
    const errorMsg = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json(
      { success: false, message: `Change password error: ${errorMsg}` },
      { status: 500 }
    );
  }
}
