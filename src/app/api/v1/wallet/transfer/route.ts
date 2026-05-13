import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://pb-production-fd26.up.railway.app/api/v1';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      console.log('[Transfer API] No authorization header');
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Please login again' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log('[Transfer API] Request body:', {
      amount: body.amount,
      recipient: body.recipient ? body.recipient.substring(0, 4) + '***' : undefined,
      bank: body.bank,
      narration: body.narration,
    });

    if (!body.amount || !body.recipient || !body.bank || !body.pin) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: amount, recipient, bank, pin' },
        { status: 400 }
      );
    }

    console.log('[Transfer API] Calling backend endpoint:', `${BACKEND_URL}/wallet/transfer`);
    const response = await fetch(`${BACKEND_URL}/wallet/transfer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log('[Transfer API] Backend response status:', response.status);
    console.log('[Transfer API] Backend response:', data);

    if (!response.ok) {
      const errorMsg = data.message || data.error || 'Transfer failed';
      console.error('[Transfer API] Error response:', errorMsg);
      return NextResponse.json(
        {
          success: false,
          message: errorMsg,
        },
        { status: response.status }
      );
    }

    console.log('[Transfer API] Transfer successful');
    return NextResponse.json({
      success: true,
      message: data.message || 'Transfer successful',
      reference: data.reference || data.transaction_ref || 'REF-' + Date.now(),
      data: data,
    });
  } catch (error) {
    console.error('[Transfer API] Catch error:', error);
    const errorMsg = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json(
      {
        success: false,
        message: `Transfer error: ${errorMsg}`,
      },
      { status: 500 }
    );
  }
}
