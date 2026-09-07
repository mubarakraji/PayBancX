import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://pb-production-fd26.up.railway.app/api/v1';

// Helper to convert BigInt and other non-serializable types to strings
function transformBigInt(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj === 'bigint') {
    return obj.toString();
  }
  
  if (typeof obj === 'object') {
    if (Array.isArray(obj)) {
      return obj.map(item => transformBigInt(item));
    }
    const transformed: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        transformed[key] = transformBigInt(obj[key]);
      }
    }
    return transformed;
  }
  
  return obj;
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: 'Authorization header missing' },
        { status: 401 }
      );
    }

    const response = await fetch(`${BACKEND_URL}/wallet/balance`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    });

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const text = await response.text();
      console.error('[Wallet Balance API] Non-JSON backend response:', text.substring(0, 300));
      return NextResponse.json(
        { success: false, message: 'Wallet balance service returned an invalid response' },
        { status: response.status || 502 }
      );
    }

    const data = await response.json();
    const transformedData = transformBigInt(data);

    return NextResponse.json(transformedData, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch wallet balance' },
      { status: 500 }
    );
  }
}
