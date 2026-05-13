import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://pb-production-fd26.up.railway.app/api/v1';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: 'Authorization header missing' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log('[Withdraw] Request body:', body);

    const response = await fetch(`${BACKEND_URL}/wallet/withdraw`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log('[Withdraw] Response status:', response.status);
    console.log('[Withdraw] Response data:', data);

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[Withdraw] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process withdrawal' },
      { status: 500 }
    );
  }
}
