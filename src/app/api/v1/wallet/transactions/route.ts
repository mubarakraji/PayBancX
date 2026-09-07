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
        { success: false, message: 'Unauthorized - Please login again' },
        { status: 401 }
      );
    }

    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '20';
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    const backendParams = new URLSearchParams({
      page,
      limit,
    });
    if (type) backendParams.append('type', type);
    if (status) backendParams.append('status', status);

    const backendUrl = `${BACKEND_URL}/analytics/transactions?${backendParams.toString()}`;

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    });

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const text = await response.text();
      console.error('[Wallet Transactions API] Non-JSON backend response:', text.substring(0, 300));
      return NextResponse.json(
        { success: false, message: 'Wallet service returned an invalid response' },
        { status: response.status || 502 }
      );
    }

    const data = await response.json();
    
    // Transform BigInt FIRST before doing anything with the data
    const transformedData = transformBigInt(data);
    
    if (!response.ok) {
      // Extract potential error messages - be extremely defensive
      // Only work with string primitives to avoid BigInt serialization issues
      let errorMsg = 'Failed to fetch transactions';
      
      try {
        const candidates = [
          transformedData?.error,
          transformedData?.message,
          transformedData?.data?.error,
          transformedData?.data?.message,
        ];
        
        for (const candidate of candidates) {
          if (typeof candidate === 'string' && candidate.trim().length > 0) {
            errorMsg = candidate.substring(0, 500);
            break;
          }
        }
      } catch (extractError) {
        // If extraction fails, use default message
        errorMsg = 'Failed to fetch transactions';
      }
      
      const safeErrorMsg = String(errorMsg).trim() || 'Failed to fetch transactions';
      // Return without logging the message to avoid serialization issues
      return NextResponse.json(
        { success: false, message: safeErrorMsg },
        { status: response.status }
      );
    }

    // Ensure the response data is clean and properly transformed
    const responsePayload = {
      success: true,
      data: {
        transactions: transformedData?.data?.transactions || transformedData?.transactions || [],
        pagination: {
          page: transformedData?.data?.pagination?.page || parseInt(page),
          limit: transformedData?.data?.pagination?.limit || parseInt(limit),
          hasMore: transformedData?.data?.pagination?.hasMore || false,
        },
        total: transformedData?.data?.total || transformedData?.total || 0,
      },
    };

    return NextResponse.json(responsePayload, { status: 200 });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'An unexpected error occurred';
    const safeErrorMsg = typeof errorMsg === 'string' ? errorMsg : 'Unknown error';
    return NextResponse.json(
      { success: false, message: `Transactions error: ${safeErrorMsg}` },
      { status: 500 }
    );
  }
}
