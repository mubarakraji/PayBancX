import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://pb-production-fd26.up.railway.app/api/v1';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      console.log('[Bank Verify API] No authorization header');
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log('[Bank Verify API] Request body:', {
      account_number: body.account_number ? body.account_number.substring(0, 4) + '***' : undefined,
      bank_code: body.bank_code,
    });

    // Validate input
    if (!body.account_number || !body.bank_code) {
      return NextResponse.json(
        { success: false, message: 'Account number and bank code are required' },
        { status: 400 }
      );
    }

    console.log('[Bank Verify API] Calling backend endpoint:', `${BACKEND_URL}/services/bank/verify`);
    const response = await fetch(`${BACKEND_URL}/services/bank/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log('[Bank Verify API] Backend response status:', response.status);
    console.log('[Bank Verify API] Backend response:', data);

    if (!response.ok) {
      const errorMsg = data.message || data.error || 'Account verification failed';
      console.error('[Bank Verify API] Error response:', errorMsg);
      return NextResponse.json(
        {
          success: false,
          message: errorMsg,
        },
        { status: response.status }
      );
    }

    console.log('[Bank Verify API] Verification successful');
    return NextResponse.json({
      success: true,
      message: 'Account verified successfully',
      account_name: data.account_name || data.name || 'Account verified',
      account_number: data.account_number || body.account_number,
      bank_code: data.bank_code || body.bank_code,
      data: data,
    });
  } catch (error) {
    console.error('[Bank Verify API] Catch error:', error);
    const errorMsg = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json(
      {
        success: false,
        message: `Bank verification error: ${errorMsg}`,
      },
      { status: 500 }
    );
  }
}
