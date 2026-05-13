import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://pb-production-fd26.up.railway.app/api/v1';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const response = await fetch(`${BACKEND_URL}/auth/kyc-status`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      // Graceful fallback - assume not verified if endpoint fails
      return NextResponse.json({
        success: true,
        verified: false,
        message: 'KYC verification status unknown',
      });
    }

    return NextResponse.json({
      success: true,
      verified: data.verified || data.kyc_verified || false,
      data: data.data || data,
    });
  } catch (error) {
    // Graceful fallback
    return NextResponse.json({
      success: true,
      verified: false,
      message: 'Unable to verify KYC status',
    });
  }
}
