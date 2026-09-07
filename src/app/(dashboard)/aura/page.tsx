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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
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
      const response = await sendAuraMessage(userMessage);

      if (response.success) {
        const auraMessage: Message = {
          id: messages.length + 2,
          text: response.response,
          sender: 'aura',
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, auraMessage]);
      } else {
        throw new Error(response.message || 'Failed to get response');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      toastError(errorMessage);
      const errorMsg: Message = {
        id: messages.length + 2,
        text: `Sorry, I ran into an issue: ${errorMessage}. Please try again.`,
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
    <div className="flex h-screen flex-col bg-[#F5F6F8] text-[#122927]">
      <header className="sticky top-0 z-10 border-b border-[#E5E7EB] bg-white px-3 py-3 xs:px-4 sm:px-5 sm:py-4 md:px-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1C3F3B]/10 text-[#1C3F3B]">
              <MdMessage className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#122927]">AURA-X</h2>
              <p className="text-sm text-[#64748B]">Assistant for your wallet and payments</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleClearChat} title="Clear chat" className="rounded-full p-2 text-[#64748B] transition hover:bg-[#F8FAFA] hover:text-[#122927]">
              <MdDeleteOutline className="h-5 w-5" />
            </button>
            <button onClick={() => router.back()} title="Close" className="rounded-full p-2 text-[#64748B] transition hover:bg-[#F8FAFA] hover:text-[#122927]">
              <MdClose className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto bg-[#F8FAFA]">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-4 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#1C3F3B]/10 text-[#1C3F3B]">
              <MdMessage className="h-8 w-8" />
            </div>
            <h1 className="mb-2 text-xl font-semibold text-[#122927]">AURA-X</h1>
            <p className="max-w-sm text-sm leading-relaxed text-[#64748B]">Ask about your balance, transactions, or anything else related to your wallet.</p>
          </div>
        ) : (
          <div className="space-y-3 p-3 md:p-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs rounded-3xl px-4 py-3 md:max-w-md ${msg.sender === 'user' ? 'rounded-tr-none bg-[#1C3F3B] text-white' : 'rounded-tl-none border border-[#E5E7EB] bg-white text-[#122927]'}`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  {msg.timestamp && <p className={`mt-1.5 text-xs ${msg.sender === 'user' ? 'text-white/70' : 'text-[#64748B]'}`}>{new Date(msg.timestamp).toLocaleTimeString()}</p>}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-3xl rounded-tl-none border border-[#E5E7EB] bg-white px-4 py-3">
                  <div className="flex gap-2">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-[#1C3F3B]" />
                    <div className="h-2 w-2 animate-pulse rounded-full bg-[#1C3F3B]" />
                    <div className="h-2 w-2 animate-pulse rounded-full bg-[#1C3F3B]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      <footer className="border-t border-[#E5E7EB] bg-white px-3 py-3 xs:px-4 sm:px-5 sm:py-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex flex-1 items-center rounded-full border border-[#E5E7EB] bg-[#F8FAFA] px-4 py-3 transition focus-within:border-[#1C3F3B] focus-within:ring-1 focus-within:ring-[#1C3F3B]/20">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
              placeholder="Ask AURA-X anything..."
              disabled={isLoading}
              className="flex-1 bg-transparent text-sm text-[#122927] placeholder:text-[#94A3B8] focus:outline-none disabled:opacity-50"
              aria-label="Message input for AURA-X"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#1C3F3B] text-white shadow-sm transition hover:bg-[#173533] disabled:cursor-not-allowed disabled:bg-[#CBD5E1]"
            title={isLoading ? 'Waiting for response...' : 'Send message'}
            aria-label="Send message"
          >
            <MdSend className="h-5 w-5" />
          </button>
        </div>
      </footer>
    </div>
  );
}

