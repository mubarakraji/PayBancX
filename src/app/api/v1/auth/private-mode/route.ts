import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://pb-production-fd26.up.railway.app/api/v1';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      console.log('[Private Mode API] No authorization header');
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Please login again' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log('[Private Mode API] Request body:', {
      hide_balance: body.hide_balance,
      hasPanicBalance: !!body.panic_balance,
    });

    if (typeof body.hide_balance !== 'boolean') {
      return NextResponse.json(
        { success: false, message: 'Invalid request parameters' },
        { status: 400 }
      );
    }

    console.log('[Private Mode API] Calling backend endpoint:', `${BACKEND_URL}/auth/private-mode`);
    const response = await fetch(`${BACKEND_URL}/auth/private-mode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log('[Private Mode API] Backend response status:', response.status);
    console.log('[Private Mode API] Backend response:', data);

    if (!response.ok) {
      const errorMsg = data.message || data.error || 'Failed to save privacy settings';
      console.error('[Private Mode API] Error response:', errorMsg);
      return NextResponse.json(
        {
          success: false,
          message: errorMsg,
        },
        { status: response.status }
      );
    }

    console.log('[Private Mode API] Privacy settings saved successfully');
    return NextResponse.json({
      success: true,
      message: data.message || 'Privacy settings saved successfully',
      data: data.data || data,
    });
  } catch (error) {
    console.error('[Private Mode API] Catch error:', error);
    const errorMsg = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json(
      {
        success: false,
        message: `Private mode error: ${errorMsg}`,
      },
      { status: 500 }
    );
  }
}
