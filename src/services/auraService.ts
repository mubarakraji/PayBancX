// AURA-X Service - AI Wallet Assistant
import { getAuthHeaders } from '@/config/apiConfig';

export interface AuraMessage {
  id: string;
  text: string;
  sender: 'user' | 'aura';
  timestamp?: string;
}

export interface AuraResponse {
  success: boolean;
  response: string;
  message?: string;
  data?: any;
}

// Send message to AURA-X
export async function sendAuraMessage(message: string): Promise<AuraResponse> {
  try {
    const headers = getAuthHeaders();
    const url = '/api/aura/chat';
    
    console.log('[AURA Service] Sending message:', message.substring(0, 50) + '...');
    console.log('[AURA Service] Headers:', headers);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();

    console.log('[AURA Service] Response status:', response.status);
    console.log('[AURA Service] Response data:', JSON.stringify(data).substring(0, 200));

    if (!response.ok) {
      console.error('[AURA Service] Response not OK:', response.status, data);
      throw new Error(data.error || data.message || 'Failed to send message to AURA');
    }

    return data;
  } catch (error) {
    console.error('[AURA Service] Send message error:', error);
    throw error;
  }
}
