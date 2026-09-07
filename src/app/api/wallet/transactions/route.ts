import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://pb-production-fd26.up.railway.app/api/v1';

function transformBigInt(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'bigint') return obj.toString();
  if (Array.isArray(obj)) return obj.map(item => transformBigInt(item));
  if (typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, transformBigInt(value)])
    );
  }
  return obj;
}

function safeStringify(obj: any): string {
  try {
    const transformed = transformBigInt(obj);
    return typeof transformed === 'string' ? transformed : JSON.stringify(transformed);
  } catch {
    try {
      return String(transformBigInt(obj) ?? '[Unserializable value]');
    } catch {
      return '[Unserializable value]';
    }
  }
}

function jsonResponse(payload: any, status = 200): NextResponse {
  return new NextResponse(safeStringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      console.log('[Wallet] No authorization header provided');
      return jsonResponse(
        { error: 'Unauthorized' },
        401
      );
    }

    // Get query parameters from the request
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '20';
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    // Build the backend URL with query parameters
    const backendParams = new URLSearchParams({
      page,
      limit,
    });
    
    if (type) backendParams.append('type', type);
    if (status) backendParams.append('status', status);

    const backendUrl = `${BACKEND_URL}/analytics/transactions?${backendParams.toString()}`;
    
    console.log('[Wallet] Fetching transactions from:', backendUrl);
    console.log('[Wallet] Auth header present:', !!authHeader);

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    const transformedData = transformBigInt(data);

    console.log('[Wallet] Response status:', response.status);
    console.log('[Wallet] Response data:', safeStringify(transformedData).substring(0, 200));

    if (!response.ok) {
      console.log('[Wallet] Backend returned status:', response.status);
      // Return 404 gracefully with empty transactions
      if (response.status === 404) {
        return jsonResponse({
          transactions: [],
          total: 0,
          page: parseInt(page),
          message: 'No transactions found',
        });
      }
      
      return jsonResponse(
        { error: String(transformedData?.message || transformedData?.error || 'Failed to fetch transactions') },
        response.status
      );
    }

    return jsonResponse(transformedData.data || transformedData);
  } catch (error) {
    console.error('[Wallet] Error:', error);
    return jsonResponse(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      500
    );
  }
}
