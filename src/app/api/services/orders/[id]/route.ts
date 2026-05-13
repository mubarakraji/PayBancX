import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://pb-production-fd26.up.railway.app/api/v1';

// GET - Fetch order details by ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = request.headers.get('authorization');
    const { id } = await params;

    if (!authHeader) {
      console.log('[Orders API] ❌ No auth header');
      return NextResponse.json(
        { success: false, message: 'Authorization header missing' },
        { status: 401 }
      );
    }

    if (!id) {
      console.log('[Orders API] ❌ Missing order ID');
      return NextResponse.json(
        { success: false, message: 'Order ID is required' },
        { status: 400 }
      );
    }

    const backendUrl = `${API_BASE_URL}/services/orders/${id}`;
    console.log('[Orders API] 🔍 Fetching order:', id);
    console.log('[Orders API] 🔗 Backend URL:', backendUrl);

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    });

    const data = await response.json();

    console.log('[Orders API] 📊 Backend response status:', response.status);
    console.log('[Orders API] 📦 Backend response:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('[Orders API] ❌ Backend error:', response.status, data);
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to fetch order details' },
        { status: response.status }
      );
    }

    console.log('[Orders API] ✅ Order fetched successfully');
    return NextResponse.json(data);
  } catch (error) {
    console.error('[Orders API] ❌ GET error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: String(error) },
      { status: 500 }
    );
  }
}
