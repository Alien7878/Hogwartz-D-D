
import React, { useState, useEffect, useRef } from 'react';
import { GameLog } from '../types';

interface ChatProps {
  logs: GameLog[];
  onAddLog: (msg: string, type?: string, sender?: string) => void;
  isMobile?: boolean;
}

const Chat: React.FC<ChatProps> = ({ logs, onAddLog, isMobile }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim().toLowerCase();
    if (cmd === 'alohomora' || cmd === 'آلوهومورا') {
      onAddLog("✨ یک صندوقچه طلایی مخفی در وسایل شما ظاهر شد!", 'system', 'هاگوارتز');
    } else if (cmd === 'lumos' || cmd === 'لوموس') {
      document.body.style.filter = 'brightness(1.5)';
      onAddLog("💡 اتاق در نوری جادویی غرق شد.", 'system', 'جادو');
      setTimeout(() => document.body.style.filter = '', 3000);
    } else if (cmd === 'avada kedavra' || cmd === 'آوادا کداورا') {
      onAddLog("💀 سرمای مرگباری در فضا پیچید... کسی نامی را برد که نباید!", 'system', 'هشدار');
    } else {
      onAddLog(input);
    }
    
    setInput('');
  };

  return (
    <div className={`flex flex-col bg-stone-900/95 h-full ${!isMobile ? 'border-r border-amber-900/30' : ''}`} dir="rtl">
      <div className="p-4 bg-amber-900 text-amber-100 gothic-font text-center tracking-[0.3em] border-b-2 border-amber-800 shadow-md font-bold text-lg">
        پیک جغد
      </div>
      <div 
        ref={scrollRef}
        className="flex-grow overflow-y-auto p-4 space-y-4 scroll-smooth"
      >
        {logs.filter(l => l.type === 'chat' || l.type === 'system').map(log => (
          <div key={log.id} className={`p-3 rounded-lg shadow-sm ${log.type === 'system' ? 'bg-amber-900/20 border border-amber-800/30' : 'bg-stone-800/50'}`}>
            <div className="flex justify-between items-baseline mb-1">
              <span className={`font-bold text-sm ${log.type === 'system' ? 'text-amber-500' : 'text-amber-200'}`}>
                {log.sender}
              </span>
              <span className="text-[9px] text-stone-500">{new Date(log.timestamp).toLocaleTimeString('fa-IR')}</span>
            </div>
            <p className="text-sm text-stone-300 leading-relaxed break-words">{log.message}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="p-4 bg-stone-950 border-t-2 border-amber-900/30">
        <div className="relative">
          <input
            className="w-full bg-stone-900 border-2 border-amber-900/30 rounded-lg px-4 py-3 text-sm text-amber-50 placeholder-stone-600 focus:outline-none focus:border-amber-600 transition-all shadow-inner"
            placeholder="پیام یا ورد جادویی خود را بنویسید..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="absolute left-2 top-2 bottom-2 px-3 bg-amber-800 text-white rounded-md text-xs hover:bg-amber-700 transition-colors">ارسال</button>
        </div>
        <p className="text-[10px] text-stone-500 mt-2 italic text-center">
          امتحان کنید: 'آلوهومورا' یا 'لوموس'
        </p>
      </form>
    </div>
  );
};

export default Chat;
