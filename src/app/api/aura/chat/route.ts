import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://pb-production-fd26.up.railway.app/api/v1';

// Mock responses for AURA-X AI Assistant
interface MockResponse {
  [key: string]: string;
}

const mockResponses: MockResponse = {
  // Greeting & Help
  'hello': 'Hello! 👋 I\'m AURA-X, your PayBancX AI assistant. I can help you with:\n• 💳 Airtime & Data purchases\n• ⚡ Electricity bill payments\n• 🎮 Betting account funding\n• 📺 TV subscription management\n• 💰 Wallet operations\n• 🔄 Fund transfers\n\nWhat can I help you with today?',
  'hi': 'Hi there! 👋 I\'m AURA-X, your PayBancX wallet assistant. How can I help?',
  'help': 'I can assist you with:\n📱 **Airtime & Data**: Buy airtime for any network or get data plans\n⚡ **Electricity**: Pay your electric bills by entering your meter number\n🎮 **Betting**: Fund your betting accounts instantly\n📺 **TV**: Subscribe to your favorite TV services\n💼 **Wallet**: Check balance, transfer funds, or view transactions\n\nJust tell me what you need!',
  'what can you do': 'I can help with:\n✅ Buying airtime for MTN, Airtel, Glo, 9Mobile\n✅ Purchasing data plans\n✅ Paying electricity bills\n✅ Funding betting accounts\n✅ Managing TV subscriptions\n✅ Transferring money\n✅ Checking wallet balance\n\nWhat would you like to do?',

  // Airtime & Data
  'airtime': '📱 **Airtime Purchase**\nI can help you buy airtime for:\n• MTN\n• Airtel\n• Glo\n• 9Mobile\n\nJust go to the **Airtime** page, select your network, enter your phone number, choose an amount, and complete the purchase. Instant delivery!',
  'data': '📊 **Data Plans**\nWe offer data plans for all networks with durations of:\n• 1 Day\n• 7 Days  \n• 30 Days\n\nVisit the **Data** page, pick your network and duration, select a plan, and you\'re set!',
  'buy airtime': 'To buy airtime:\n1. Go to **Airtime** section\n2. Select your network (MTN, Airtel, Glo, 9Mobile)\n3. Enter your phone number\n4. Choose an amount\n5. Tap Continue and confirm\n\nYour airtime will be credited instantly! 🚀',

  // Electricity
  'electricity': '⚡ **Electricity Bill Payment**\nI can help you pay your electric bill:\n\n1. Go to the **Electricity** page\n2. Select your DISCO (distribution company)\n3. Choose meter type: Prepaid or Postpaid\n4. Enter your meter number\n5. Select or enter an amount\n6. Confirm payment\n\nWe support all 11 Nigerian DISCOs!',
  'meter': 'To pay your electricity bill:\n1. Know your **meter number**\n2. Know your **DISCO** (Ikeja Electric, Abuja Electric, etc.)\n3. Know your **meter type** (Prepaid/Postpaid)\n\nThen go to the Electricity page and follow the steps. Your prepaid meter will be credited instantly!',

  // Betting
  'betting': '🎮 **Betting Account Funding**\nI can help you fund your betting account:\n\n1. Go to **Games & Betting** section\n2. Select your betting platform (1xBet, Bet9ja, SportyBet, BetKing, BangBet)\n3. Enter your account ID\n4. Choose an amount\n5. Confirm and fund\n\nYour account will be credited right away!',
  'games': 'To fund your betting account:\n1. Go to **Games & Betting**\n2. Select your platform\n3. Enter your account ID (we\'ll verify it)\n4. Choose amount (min ₦100)\n5. Complete the transaction\n\nSupported platforms: 1xBet, Bet9ja, SportyBet, BetKing, BangBet 🎯',

  // TV
  'tv': '📺 **TV Subscription**\nSubscribe to your favorite channels:\n\n1. Go to **TV Subscription** page\n2. Select your provider\n3. Enter your smartcard number\n4. Choose a plan/amount\n5. Confirm subscription\n\nYour TV will be activated immediately!',
  'television': 'To buy TV subscription:\n1. Have your **smartcard number** ready\n2. Go to **TV Subscription**\n3. Select provider & verify smartcard\n4. Pick a plan\n5. Pay and activate\n\nYour subscription starts instantly! 📺',

  // Wallet & Transfers
  'balance': '💰 **Check Balance**\nTo see your wallet balance:\n1. Go to **Home** page\n2. Your balance is displayed at the top\n3. Or go to **Profile** to see detailed wallet info\n\nYour balance updates instantly after each transaction!',
  'transfer': '🔄 **Fund Transfer**\nYou can transfer money:\n\n• **To Bank Account**: Transfer to any Nigerian bank\n• **Via Transfer Tag**: Use a unique tag (@username)\n• **Via QR Code**: Scan a PayBancX QR code\n\nGo to **Transfer** section and choose your method!',
  'withdraw': 'To withdraw funds:\n1. Go to **Transfer** → **To Bank Account**\n2. Enter beneficiary details\n3. Enter amount and your PIN\n4. Confirm withdrawal\n\nFunds arrive in 1-5 minutes! 🏦',

  // General info
  'fees': 'Our transaction fees are minimal! Visit **Settings** → **Pricing** or contact support for detailed fee information.',
  'limit': 'Transaction limits depend on your account verification level. Check **Settings** → **Account** for your current limits.',
  'security': 'Your account is secured with:\n✅ PIN protection\n✅ Two-factor authentication\n✅ Encrypted transactions\n✅ Real-time monitoring\n\nNever share your PIN or password!',
  'support': 'Need help? You can:\n📧 Email support\n💬 Contact via chat\n📞 Call our support line\n\nGo to **Settings** → **Help Center** to reach us!',
  'thank': 'Happy to help! Feel free to ask me anything else about PayBancX! 😊',
  'thanks': 'You\'re welcome! Anything else I can help with? 😊',
};

// Smart response generator
function generateResponse(message: string): string {
  const lowerMessage = message.toLowerCase().trim();
  
  // Direct matches
  for (const [key, response] of Object.entries(mockResponses)) {
    if (lowerMessage.includes(key)) {
      return response;
    }
  }

  // Keyword-based responses
  if (lowerMessage.includes('how') && lowerMessage.includes('buy')) {
    return 'To buy services on PayBancX:\n1. Navigate to the service you want (Airtime, Data, Electricity, TV, or Betting)\n2. Fill in your details\n3. Select an amount\n4. Review and confirm\n5. Complete with your PIN\n\nAll transactions are instant! 🚀';
  }

  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('rate')) {
    return 'Our rates are competitive! Check specific services for pricing:\n• **Airtime**: Current network rates\n• **Data**: Various plans available\n• **Electricity**: Pay your exact bill amount\n• **TV**: Different plan prices\n• **Betting**: Varies by platform\n\nVisit each service page for detailed pricing!';
  }

  if (lowerMessage.includes('not working') || lowerMessage.includes('error') || lowerMessage.includes('problem')) {
    return 'Sorry to hear you\'re experiencing an issue! 😞\n\nPlease try:\n1. Check your internet connection\n2. Refresh the page\n3. Ensure you have sufficient wallet balance\n4. Update the app if available\n\nIf the problem persists, contact support from Settings → Help Center.';
  }

  if (lowerMessage.includes('time') || lowerMessage.includes('how long')) {
    return '⏱️ **Transaction Times**:\n• Airtime: Instant (1-2 seconds)\n• Data: Instant\n• Electricity: 1-5 minutes\n• TV: 1-2 minutes\n• Bank Transfer: 1-5 minutes\n\nAll timestamps are recorded in your transaction history!';
  }

  // Default helpful response
  return 'I\'m here to help! You can ask me about:\n• 📱 Airtime & Data\n• ⚡ Electricity bills\n• 🎮 Betting\n• 📺 TV Subscriptions\n• 💰 Wallet & Transfers\n• 🔒 Security & Account\n\nWhat would you like to know?';
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      console.log('[AURA API] No authorization header provided');
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required', success: false },
        { status: 400 }
      );
    }

    console.log('[AURA API] Received message:', message.substring(0, 50) + '...');

    // Try backend first
    try {
      const backendUrl = `${BACKEND_URL}/aura/chat`;
      
      console.log('[AURA API] Attempting to reach backend:', backendUrl);

      const backendResponse = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      if (backendResponse.ok) {
        const data = await backendResponse.json();
        console.log('[AURA API] Backend response successful');
        return NextResponse.json({
          success: true,
          response: data.response || 'Response received from AURA',
        });
      }
    } catch (backendError) {
      console.log('[AURA API] Backend unavailable, using mock responses:', 
        backendError instanceof Error ? backendError.message : 'Unknown error'
      );
    }

    // Fallback to mock responses
    const mockResponse = generateResponse(message);
    
    console.log('[AURA API] Returning mock response');
    return NextResponse.json({
      success: true,
      response: mockResponse,
      source: 'mock', // Indicates this is from mock data
    });

  } catch (error) {
    console.error('[AURA API] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
        response: 'Sorry, I encountered a problem. Please try again.'
      },
      { status: 500 }
    );
  }
}
