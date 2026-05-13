'use client';

import { useState, useEffect, useRef } from 'react';
import { MdSend, MdDeleteOutline, MdClose, MdMessage } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { sendAuraMessage } from '@/services/auraService';
import { toastError } from '@/hooks/useToast';

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'aura';
  timestamp?: string;
};

export default function AuraPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    console.log('[AURA Page] Sending message:', userMessage.substring(0, 50) + '...');

    const newUserMessage: Message = {
      id: messages.length + 1,
      text: userMessage,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInput('');
    setIsLoading(true);

    try {
      console.log('[AURA Page] Calling AURA service...');
      const response = await sendAuraMessage(userMessage);

      console.log('[AURA Page] AURA response received:', {
        success: response.success,
        hasResponse: !!response.response,
        messageLength: response.response?.length,
      });

      if (response.success) {
        const auraMessage: Message = {
          id: messages.length + 2,
          text: response.response,
          sender: 'aura',
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, auraMessage]);
        console.log('[AURA Page] AURA message added to chat');
      } else {
        throw new Error(response.message || 'Failed to get response');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      console.error('[AURA Page] Send error:', err);
      toastError(errorMessage);

      // Add error message to chat
      const errorMsg: Message = {
        id: messages.length + 2,
        text: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
        sender: 'aura',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-screen bg-paybancx-bg">
      {/* Header */}
      <header className="flex justify-between items-center px-3 xs:px-4 sm:px-5 md:px-6 py-3 border-b border-paybancx-border bg-white sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-card bg-paybancx-action/15 flex items-center justify-center">
            <MdMessage className="text-paybancx-action text-sm" />
          </div>
          <h2 className="text-base font-semibold text-paybancx-text-dark tracking-wide">AURA-X</h2>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleClearChat}
            title="Clear chat"
            className="p-1 hover:bg-paybancx-primary/5 rounded-card transition-all duration-300 hover:scale-[1.02]"
          >
            <MdDeleteOutline className="w-4 h-4 text-paybancx-text-muted" />
          </button>
          <button
            onClick={() => router.back()}
            title="Close"
            className="p-1 hover:bg-paybancx-primary/5 rounded-lg transition-all duration-300 hover:scale-[1.02]"
          >
            <MdClose className="w-4 h-4 text-paybancx-text-muted" />
          </button>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto bg-paybancx-bg">
        {messages.length === 0 ? (
          // Welcome Section
          <div className="flex flex-col items-center justify-center h-full px-3 xs:px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-paybancx-action/10 flex items-center justify-center mb-4">
              <MdMessage className="w-8 h-8 text-paybancx-action opacity-60" />
            </div>
            <h1 className="text-lg md:text-2xl font-semibold text-paybancx-text-dark mb-3">AURA-X</h1>
            <p className="text-paybancx-text-muted text-sm leading-snug max-w-sm">
              Start a conversation with AURA-X. Ask about your account balance, transactions, or any questions about your wallet.
            </p>
          </div>
        ) : (
          // Messages Container
          <div className="p-3 md:p-4 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs md:max-w-md px-3 py-2 rounded-3xl ${
                    msg.sender === 'user'
                      ? 'bg-paybancx-action text-white rounded-tr-none font-medium'
                      : 'bg-white border border-paybancx-border text-paybancx-text-dark rounded-tl-none'
                  }`}
                >
                  <p className="text-sm leading-snug">{msg.text}</p>
                  {msg.timestamp && (
                    <p className={`text-xs mt-1.5 ${msg.sender === 'user' ? 'text-white/60' : 'text-paybancx-text-muted'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-paybancx-border text-paybancx-text-dark rounded-3xl rounded-tl-none px-4 py-3">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-paybancx-action animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-paybancx-action animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-paybancx-action animate-pulse"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Input Footer */}
      <footer className="px-4 xs:px-5 sm:px-6 py-5 bg-white border-t border-paybancx-border">
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center bg-white border border-paybancx-border rounded-full px-5 py-3 focus-within:border-[#1C3F3B] focus-within:ring-1 focus-within:ring-[#1C3F3B]/30 transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
              placeholder="Ask AURA-X anything..."
              disabled={isLoading}
              className="flex-1 bg-transparent text-paybancx-text-dark placeholder-paybancx-text-muted focus:outline-none text-sm md:text-base disabled:opacity-50"
              aria-label="Message input for AURA-X"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-[#1C3F3B] text-white rounded-full hover:bg-[#1F4440] transition-all duration-300 hover:scale-[1.05] disabled:bg-[#D0D0D0] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md"
            title={isLoading ? 'Waiting for response...' : 'Send message'}
            aria-label="Send message"
          >
            <MdSend className="w-5 h-5" />
          </button>
        </div>
      </footer>
    </div>
  );
}

