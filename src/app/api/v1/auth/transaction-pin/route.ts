import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://pb-production-fd26.up.railway.app/api/v1';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      console.log('[Transaction PIN API] No authorization header');
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log('[Transaction PIN API] Request body: { pin: *** }');

    const response = await fetch(`${BACKEND_URL}/auth/transaction-pin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log('[Transaction PIN API] Response:', data);

    if (!response.ok) {
      const errorMsg = data.message || data.error || 'Failed to set transaction PIN';
      console.error('[Transaction PIN API] Error response:', errorMsg);
      return NextResponse.json(
        {
          success: false,
          message: errorMsg,
        },
        { status: response.status }
      );
    }

    console.log('[Transaction PIN API] PIN set successfully');
    return NextResponse.json({
      success: true,
      message: data.message || 'Transaction PIN set successfully',
    });
  } catch (error) {
    console.error('[Transaction PIN API] Catch error:', error);
    const errorMsg = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json(
      {
        success: false,
        message: `Transaction PIN error: ${errorMsg}`,
      },
      { status: 500 }
    );
  }
}
