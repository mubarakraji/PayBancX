import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://pb-production-fd26.up.railway.app/api/v1';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');
    const { id } = await params;

    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: 'Authorization header missing' },
        { status: 401 }
      );
    }

    console.log('[Transaction Detail] ID:', id);

    const response = await fetch(`${BACKEND_URL}/wallet/transaction/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    });

    const data = await response.json();
    console.log('[Transaction Detail] Response status:', response.status);
    console.log('[Transaction Detail] Response data:', data);

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[Transaction Detail] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch transaction details' },
      { status: 500 }
    );
  }
}
