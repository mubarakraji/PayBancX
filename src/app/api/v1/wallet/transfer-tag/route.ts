import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://pb-production-fd26.up.railway.app/api/v1';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      console.log('[Tag Transfer API] No authorization header');
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Please login again' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log('[Tag Transfer API] Request body:', {
      payment_tag: body.payment_tag ? body.payment_tag.substring(0, 5) + '...' : undefined,
    });

    if (!body.payment_tag) {
      return NextResponse.json(
        { success: false, message: 'Payment tag is required' },
        { status: 400 }
      );
    }

    console.log('[Tag Transfer API] Calling backend endpoint:', `${BACKEND_URL}/wallet/transfer-tag`);
    const response = await fetch(`${BACKEND_URL}/wallet/transfer-tag`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log('[Tag Transfer API] Backend response status:', response.status);
    console.log('[Tag Transfer API] Backend response:', data);

    if (!response.ok) {
      const errorMsg = data.message || data.error || 'Payment tag verification failed';
      console.error('[Tag Transfer API] Error response:', errorMsg);
      return NextResponse.json(
        {
          success: false,
          message: errorMsg,
        },
        { status: response.status }
      );
    }

    console.log('[Tag Transfer API] Tag verification successful');
    return NextResponse.json({
      success: true,
      message: data.message || 'Payment tag verified successfully',
      recipient: data.recipient || data.account,
      account_name: data.account_name || data.name,
      data: data,
    });
  } catch (error) {
    console.error('[Tag Transfer API] Catch error:', error);
    const errorMsg = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json(
      {
        success: false,
        message: `Tag verification error: ${errorMsg}`,
      },
      { status: 500 }
    );
  }
}
