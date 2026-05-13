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

    // Attempting backend check
    
    // Try backend first with timeout
    try {
      const response = await fetch(`${BACKEND_URL}/auth/kyc-status`, {
        method: 'GET',
        headers: {
          'Authorization': authHeader,
        },
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json({
          success: true,
          verified: data.verified || data.kyc_verified || false,
          data: data.data || data,
          source: 'backend',
        });
      }
    } catch (backendError) {
    }

    // Fallback: Return unverified status (user needs to complete KYC first)
    // Returning unverified status for KYC
    return NextResponse.json({
      success: true,
      verified: false,
      message: 'KYC verification required',
      source: 'mock',
      data: {
        kycLevel: 0,
        status: 'pending',
        nextStep: 'Please complete KYC verification to unlock transaction limits',
        transactionLimits: {
          daily: 50000,
          monthly: 200000,
        }
      }
    });

  } catch (error) {
    // Graceful fallback
    return NextResponse.json({
      success: true,
      verified: false,
      message: 'Unable to verify KYC status',
      source: 'fallback',
    });
  }
}
