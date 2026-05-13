import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://pb-production-fd26.up.railway.app/api/v1';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ reference: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');
    const { reference } = await params;

    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: 'Authorization header missing' },
        { status: 401 }
      );
    }

    console.log('[Deposit Verify] Reference:', reference);

    const response = await fetch(`${BACKEND_URL}/wallet/deposit/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    });

    const data = await response.json();
    console.log('[Deposit Verify] Response status:', response.status);
    console.log('[Deposit Verify] Response data:', data);

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[Deposit Verify] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to verify deposit' },
      { status: 500 }
    );
  }
}
