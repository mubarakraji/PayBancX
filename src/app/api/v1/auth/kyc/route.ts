import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://pb-production-fd26.up.railway.app/api/v1';

// Valid BVNs for testing (in production, these would come from BVN database)
const VALID_TEST_BVNS = [
  '22135014151', // Test BVN 1
  '22134567890', // Test BVN 2
  '22140123456', // Test BVN 3
  '22145678901', // Test BVN 4
  '22150987654', // Test BVN 5
];

// Database of known valid BVNs with their info (mock data)
const BVN_DATABASE: { [key: string]: any } = {
  '22135014151': { name: 'Chioma Okonkwo', dob: '1988-03-15', phone: '+2348012345670' },
  '22134567890': { name: 'Tunde Adeyemi', dob: '1990-07-22', phone: '+2348012345671' },
  '22140123456': { name: 'Amara Nwosu', dob: '1992-11-08', phone: '+2348012345672' },
  '22145678901': { name: 'Seun Olawale', dob: '1989-05-14', phone: '+2348012345673' },
  '22150987654': { name: 'Grace Eze', dob: '1991-09-27', phone: '+2348012345674' },
};

// Validate BVN format and checksum
function validateBVN(bvn: string): { valid: boolean; error?: string } {
  // Check length
  if (bvn.length !== 11) {
    return { valid: false, error: 'BVN must be exactly 11 digits' };
  }

  // Check if all characters are digits
  if (!/^\d+$/.test(bvn)) {
    return { valid: false, error: 'BVN must contain only digits' };
  }

  // BVN should not be all same digits
  if (/^(\d)\1{10}$/.test(bvn)) {
    return { valid: false, error: 'Invalid BVN: all digits cannot be the same' };
  }

  // Check if BVN starts with valid prefix (22, 23, 24, etc. for Nigeria)
  const prefix = parseInt(bvn.substring(0, 2));
  if (prefix < 20 || prefix > 24) {
    return { valid: false, error: 'Invalid BVN: must be a Nigerian BVN' };
  }

  return { valid: true };
}

// Simulate BVN verification
function simulateBVNVerification(bvn: string): { success: boolean; data?: any; error?: string } {
  // First validate BVN format
  const validation = validateBVN(bvn);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  // Check if BVN exists in database
  if (BVN_DATABASE[bvn]) {
    const bvnData = BVN_DATABASE[bvn];
    return {
      success: true,
      data: {
        verified: true,
        bvn: bvn.substring(0, 3) + '****' + bvn.substring(8),
        name: bvnData.name,
        dateOfBirth: bvnData.dob,
        phone: bvnData.phone.substring(0, 6) + '****',
        verificationDate: new Date().toISOString(),
        status: 'verified',
        kycLevel: 2,
        transactionLimits: {
          daily: 1000000,
          monthly: 10000000,
        }
      }
    };
  }

  // If BVN format is valid but not in database, return error
  return {
    success: false,
    error: 'BVN not found in our records. Please verify the number and try again.'
  };
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      console.log('[KYC Verification API] No authorization header');
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Please login again' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const bvnPreview = body.bvn ? body.bvn.substring(0, 3) + '***' : 'missing';
    console.log('[KYC Verification API] Request body:', { bvn: bvnPreview });

    if (!body.bvn || body.bvn.length !== 11 || !/^\d+$/.test(body.bvn)) {
      console.log('[KYC Verification API] Invalid BVN format:', bvnPreview);
      return NextResponse.json(
        { success: false, message: 'Invalid BVN format. BVN must be exactly 11 digits.' },
        { status: 400 }
      );
    }

    console.log('[KYC Verification API] Attempting backend verification:', `${BACKEND_URL}/auth/kyc`);
    
    // Try backend first with timeout
    try {
      const response = await fetch(`${BACKEND_URL}/auth/kyc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      if (response.ok) {
        const data = await response.json();
        console.log('[KYC Verification API] Backend verification successful');
        return NextResponse.json({
          success: true,
          message: data.message || 'KYC verification successful',
          verified: true,
          data: data.data || data,
          source: 'backend',
        });
      }
    } catch (backendError) {
      console.log('[KYC Verification API] Backend unavailable, using mock verification:', 
        backendError instanceof Error ? backendError.message : 'Unknown error'
      );
    }

    // Fallback to mock verification with proper validation
    console.log('[KYC Verification API] Using validated mock BVN verification');
    const mockVerification = simulateBVNVerification(body.bvn);
    
    if (!mockVerification.success) {
      console.log('[KYC Verification API] Mock verification failed:', mockVerification.error);
      return NextResponse.json({
        success: false,
        message: mockVerification.error || 'BVN verification failed. Please check your BVN and try again.',
        verified: false,
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'KYC verification successful',
      verified: true,
      data: mockVerification.data,
      source: 'mock',
    });

  } catch (error) {
    console.error('[KYC Verification API] Catch error:', error);
    const errorMsg = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json(
      {
        success: false,
        message: `KYC verification error: ${errorMsg}`,
      },
      { status: 500 }
    );
  }
}
