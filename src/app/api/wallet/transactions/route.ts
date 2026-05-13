import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://pb-production-fd26.up.railway.app/api/v1';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      console.log('[Wallet] No authorization header provided');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
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

    const backendUrl = `${BACKEND_URL}/wallet/transactions?${backendParams.toString()}`;
    
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

    console.log('[Wallet] Response status:', response.status);
    console.log('[Wallet] Response data:', JSON.stringify(data).substring(0, 200));

    if (!response.ok) {
      console.log('[Wallet] Backend returned status:', response.status);
      // Return 404 gracefully with empty transactions
      if (response.status === 404) {
        return NextResponse.json({
          transactions: [],
          total: 0,
          page: parseInt(page),
          message: 'No transactions found',
        });
      }
      
      return NextResponse.json(
        { error: data.message || 'Failed to fetch transactions' },
        { status: response.status }
      );
    }

    return NextResponse.json(data.data || data);
  } catch (error) {
    console.error('[Wallet] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
