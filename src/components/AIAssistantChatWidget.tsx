import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, MessageSquare, ShieldCheck, Minimize2, Maximize2, Loader2 } from 'lucide-react';
import { sendGeminiChatMessage } from '../lib/gemini';

export const AIAssistantChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    {
      role: 'model',
      text: '👋 Hello! I am your 24/7 Gemini AI Roofing & Insurance Claims Advisor. Ask me anything about building codes (IRC R905), Xactimate line items, adjuster supplement negotiations, or roof square math!',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user' as const, text: userMsg }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const responseText = await sendGeminiChatMessage(newMessages);
      setMessages((prev) => [...prev, { role: 'model', text: responseText }]);
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: 'model', text: '⚠️ Sorry, I could not connect to Gemini AI right now. Please try again in a moment.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Trigger Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-slate-900 hover:bg-slate-800 text-amber-400 p-4 rounded-full shadow-2xl border-2 border-amber-500/50 flex items-center gap-3 transition-all hover:scale-105 group active:scale-95"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-amber-400" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse" />
          </div>
          <span className="font-extrabold text-xs text-white pr-1 group-hover:text-amber-300">
            24/7 AI Roofer Advisor
          </span>
        </button>
      )}

      {/* Chat Box Modal Window */}
      {isOpen && (
        <div className="bg-slate-900 text-white rounded-3xl w-80 sm:w-96 shadow-2xl border border-slate-700 overflow-hidden flex flex-col h-[500px]">
          {/* Header */}
          <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                  Gemini AI Roofer & Claims Advisor
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </h4>
                <p className="text-[10px] text-slate-400">IRC Building Codes & Supplement Expert</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-slate-900/95">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-amber-500 text-slate-950 font-medium rounded-br-none'
                      : 'bg-slate-800 text-slate-100 border border-slate-700 rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 p-3 rounded-2xl rounded-bl-none text-slate-400 text-xs flex items-center gap-2 border border-slate-700">
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  Gemini AI is thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-3 py-2 bg-slate-950 border-t border-slate-800 flex gap-2 overflow-x-auto text-[10px]">
            <button
              onClick={() => { setInput('What is the IRC requirement for drip edge flashing?'); }}
              className="bg-slate-800 hover:bg-slate-700 text-amber-300 px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 border border-slate-700"
            >
              Drip Edge Code?
            </button>
            <button
              onClick={() => { setInput('How do I justify 10/10 O&P to State Farm?'); }}
              className="bg-slate-800 hover:bg-slate-700 text-amber-300 px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 border border-slate-700"
            >
              10/10 O&P Justification?
            </button>
            <button
              onClick={() => { setInput('Calculate squares for 2200 sq ft roof with 8/12 pitch'); }}
              className="bg-slate-800 hover:bg-slate-700 text-amber-300 px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 border border-slate-700"
            >
              Pitch Math?
            </button>
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Gemini building codes, O&P, math..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold transition-all disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
