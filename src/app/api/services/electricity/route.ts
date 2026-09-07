import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://pb-production-fd26.up.railway.app/api/v1';

const FALLBACK_DISCOS = [
  { id: 'aedc', code: 'AEDC', service_id: 'AEDC', name: 'Abuja Electric', region: 'Abuja, Niger, Nasarawa, Kogi', image: '/e1.png', discoCode: 'abuja-electric' },
  { id: 'bedc', code: 'BEDC', service_id: 'BEDC', name: 'Benin Electric', region: 'Edo, Delta', image: '/e2.png', discoCode: 'benin-electric' },
  { id: 'ekedc', code: 'EKEDC', service_id: 'EKEDC', name: 'Eko Electric', region: 'Lagos Mainland', image: '/e3.png', discoCode: 'eko-electric' },
  { id: 'eedc', code: 'EEDC', service_id: 'EEDC', name: 'Enugu Electric', region: 'Enugu, Ebonyi, Abia', image: '/e4.png', discoCode: 'enugu-electric' },
  { id: 'ibedc', code: 'IBEDC', service_id: 'IBEDC', name: 'Ibadan Electric', region: 'Oyo, Osun, Ekiti, Kwara', image: '/e5.png', discoCode: 'ibadan-electric' },
  { id: 'ikedc', code: 'IKEDC', service_id: 'IKEDC', name: 'Ikeja Electric', region: 'Lagos Island, Ikeja', image: '/e6.png', discoCode: 'ikeja-electric' },
  { id: 'jedc', code: 'JEDC', service_id: 'JEDC', name: 'Jos Electric', region: 'Plateau, Bauchi', image: '/e7.png', discoCode: 'jos-electric' },
  { id: 'kadc', code: 'KADC', service_id: 'KADC', name: 'Kaduna Electric', region: 'Kaduna, Katsina', image: '/e8.png', discoCode: 'kaduna-electric' },
  { id: 'kedc', code: 'KEDC', service_id: 'KEDC', name: 'Kano Electric', region: 'Kano, Jigawa', image: '/e9.png', discoCode: 'kano-electric' },
  { id: 'phed', code: 'PHED', service_id: 'PHED', name: 'Port Harcourt Electric', region: 'Rivers, Bayelsa', image: '/e10.png', discoCode: 'portharcourt-electric' },
  { id: 'yedc', code: 'YEDC', service_id: 'YEDC', name: 'Yola Electric', region: 'Adamawa, Taraba', image: '/e11.png', discoCode: 'yola-electric' },
];

// GET - Fetch electricity providers/DISCOs
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      console.log('[Electricity API] ❌ No auth header');
      return NextResponse.json(
        { success: false, message: 'Authorization header missing' },
        { status: 401 }
      );
    }

    const backendUrl = `${API_BASE_URL}/services/electricity`;

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.log('[Electricity API] ℹ Backend endpoint unavailable; returning local fallback DISCO list');
      return NextResponse.json(
        { success: true, data: FALLBACK_DISCOS, message: data.message || 'Using local fallback DISCO list' },
        { status: 200 }
      );
    }

    console.log('[Electricity API] ✓ DISCOs loaded from backend');
    return NextResponse.json(data);
  } catch (error) {
    console.error('[Electricity API] ❌ GET error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: String(error) },
      { status: 500 }
    );
  }
}

// POST - Verify meter and purchase electricity
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const body = await request.json();

    const { disco, service_id, serviceId, meterType, meterNumber, amount, phoneNumber } = body;
    const resolvedDisco = (disco || service_id || serviceId || '').toString().trim();

    if (!authHeader) {
      console.log('[Electricity API] ❌ No auth header');
      return NextResponse.json(
        { success: false, message: 'Authorization header missing' },
        { status: 401 }
      );
    }

    if (!resolvedDisco || !meterType || !meterNumber) {
      console.log('[Electricity API] ❌ Missing required fields:', { disco: resolvedDisco, meterType, meterNumber });
      return NextResponse.json(
        { success: false, message: 'Missing required fields: disco or service_id, meterType, meterNumber' },
        { status: 400 }
      );
    }

    const backendUrl = `${API_BASE_URL}/services/electricity`;
    console.log('[Electricity API] 💳 Processing electricity purchase');
    console.log('[Electricity API] 🔗 Backend URL:', backendUrl);
    console.log('[Electricity API] 📝 Request body:', { disco: resolvedDisco, meterType, meterNumber, amount, phoneNumber });

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({
        disco: resolvedDisco,
        service_id: service_id || serviceId || resolvedDisco.toUpperCase(),
        meterNumber,
        meterType,
        amount,
        phoneNumber,
      }),
    });

    const data = await response.json();
    
    console.log('[Electricity API] 📊 Backend response status:', response.status);
    console.log('[Electricity API] 📦 Backend response:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('[Electricity API] ❌ Backend error:', response.status, data);
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to process electricity' },
        { status: response.status }
      );
    }

    console.log('[Electricity API] ✅ Electricity purchase successful');
    return NextResponse.json(data);
  } catch (error) {
    console.error('[Electricity API] ❌ POST error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: String(error) },
      { status: 500 }
    );
  }
}
