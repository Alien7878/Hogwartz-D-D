
import React, { useState, useEffect } from 'react';
import { RoomState, Player, Spell } from '../types';
import { CHARACTERS } from '../constants';
import Chat from './Chat';
import DiceRoller from './DiceRoller';

interface GameScreenProps {
  room: RoomState;
  myPlayerId: string;
  onAddLog: (msg: string, type?: any, sender?: string) => void;
  onSetRoom: React.Dispatch<React.SetStateAction<RoomState | null>>;
}

const GameScreen: React.FC<GameScreenProps> = ({ room, myPlayerId, onAddLog, onSetRoom }) => {
  const [isRolling, setIsRolling] = useState(false);
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);
  const [mobilePanel, setMobilePanel] = useState<'none' | 'spells' | 'chat'>('none');
  
  const me = room.players.find(p => p.id === myPlayerId);
  const myChar = CHARACTERS.find(c => c.id === me?.characterId);
  
  const currentPlayerIndex = room.turnIndex % room.players.length;
  const currentPlayer = room.players[currentPlayerIndex];
  const isMyTurn = currentPlayer?.id === myPlayerId;

  // Bot logic
  useEffect(() => {
    if (currentPlayer?.isBot && room.status === 'PLAYING') {
      const botActionTimeout = setTimeout(() => {
        const botChar = CHARACTERS.find(c => c.id === currentPlayer.characterId);
        if (!botChar) return nextTurn();

        const spell = botChar.spells[Math.floor(Math.random() * botChar.spells.length)];
        const roll = Math.floor(Math.random() * 20) + 1;
        const success = roll + (botChar.stats.wisdom / 2) >= 10;

        let message = "";
        if (success) {
          message = `${currentPlayer.name} طلسم ${spell.name} را اجرا کرد! (تاس: ${roll}) - موفقیت!`;
        } else {
          message = `${currentPlayer.name} در اجرای ${spell.name} شکست خورد. (تاس: ${roll})`;
        }
        
        onAddLog(message, 'combat', 'سیستم نبرد');
        nextTurn();
      }, 3000);
      return () => clearTimeout(botActionTimeout);
    }
  }, [currentPlayer, room.turnIndex]);

  const nextTurn = () => {
    onSetRoom(prev => prev ? { ...prev, turnIndex: prev.turnIndex + 1 } : null);
  };

  const performAction = (spell: Spell) => {
    if (!isMyTurn) return alert("هنوز نوبت شما نرسیده است!");
    if (me?.currentMp! < spell.manaCost) return alert("نیروی جادویی کافی ندارید!");
    
    setSelectedSpell(spell);
    setIsRolling(true);
    setMobilePanel('none');
  };

  const handleRollComplete = (val: number) => {
    setIsRolling(false);
    if (!selectedSpell || !me) return;

    const success = val + (myChar?.stats.wisdom || 0) / 2 >= 10;

    let message = "";
    if (success) {
      const bonus = Math.floor((myChar?.stats.wisdom || 0)/2);
      message = `${me.name} طلسم ${selectedSpell.name} را اجرا کرد! تاس: ${val} (+${bonus}) = موفقیت!`;
      onAddLog(message, 'combat');
      
      onSetRoom(prev => {
        if (!prev) return null;
        return {
          ...prev,
          players: prev.players.map(p => p.id === myPlayerId ? {
            ...p,
            currentMp: Math.max(0, p.currentMp - selectedSpell.manaCost)
          } : p)
        };
      });
    } else {
      message = `${me.name} در اجرای ${selectedSpell.name} شکست خورد! تاس: ${val}.`;
      onAddLog(message, 'combat');
    }
    
    setSelectedSpell(null);
    nextTurn();
  };

  const Sidebar = () => (
    <div className="h-full flex flex-col p-4 gap-4 bg-stone-900/95 overflow-y-auto">
      <div className="parchment p-5 rounded-2xl border-2 border-amber-900/30 shadow-xl">
        <div className="flex items-center gap-4 mb-5 border-b border-amber-900/10 pb-4">
          <div className="relative">
            <img src={myChar?.imageUrl} className="w-16 h-16 rounded-full border-2 border-amber-900/50 object-cover shadow-lg" />
            {isMyTurn && <div className="absolute -bottom-1 -right-1 bg-green-600 w-4 h-4 rounded-full border-2 border-white animate-ping" />}
          </div>
          <div className="text-right">
            <h3 className="gothic-font text-2xl text-amber-900 leading-none mb-1">{me?.name}</h3>
            <p className="text-[10px] text-stone-500 uppercase font-black tracking-widest">{myChar?.name}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-black uppercase text-stone-600">
              <span>بنیه حیات (HP)</span>
              <span className="text-red-800">{me?.currentHp} / {myChar?.stats.stamina}</span>
            </div>
            <div className="w-full bg-stone-200 h-3 rounded-full overflow-hidden border border-stone-300 shadow-inner">
              <div 
                className="bg-gradient-to-l from-red-600 to-red-400 h-full transition-all duration-1000 ease-out" 
                style={{ width: `${(me?.currentHp! / myChar?.stats.stamina!) * 100}%` }} 
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-black uppercase text-stone-600">
              <span>نیروی جادویی (MP)</span>
              <span className="text-blue-800">{me?.currentMp} / {myChar?.stats.mana}</span>
            </div>
            <div className="w-full bg-stone-200 h-3 rounded-full overflow-hidden border border-stone-300 shadow-inner">
              <div 
                className="bg-gradient-to-l from-blue-600 to-blue-400 h-full transition-all duration-1000 ease-out" 
                style={{ width: `${(me?.currentMp! / myChar?.stats.mana!) * 100}%` }} 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow flex flex-col gap-3">
        <h4 className="curtain-text text-amber-500 text-center tracking-[0.3em] text-lg font-black border-b border-amber-900/20 pb-2 mb-2">طومار وردها</h4>
        <div className="space-y-3">
          {myChar?.spells.map(spell => (
            <button
              key={spell.name}
              disabled={isRolling || me?.currentMp! < spell.manaCost || !isMyTurn}
              onClick={() => performAction(spell)}
              className={`w-full p-4 rounded-xl text-right transition-all border-2 flex flex-col gap-1 shadow-lg active:scale-95 ${
                !isMyTurn || me?.currentMp! < spell.manaCost
                  ? 'bg-stone-800/40 border-stone-700 opacity-50 grayscale cursor-not-allowed'
                  : 'bg-stone-800 hover:bg-stone-700 text-amber-50 border-amber-900/30 group'
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <span className="font-bold text-base group-hover:text-amber-400 transition-colors">{spell.name}</span>
                <span className="text-[10px] bg-blue-900/50 text-blue-100 px-2 py-0.5 rounded-md font-sans border border-blue-500/20">{spell.manaCost} MP</span>
              </div>
              <p className="text-[10px] text-stone-400 leading-relaxed font-bold italic">{spell.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Turn Tracker UI */}
      <div className="mt-auto pt-4 border-t border-amber-900/20">
        <p className="text-[10px] text-amber-500 text-center font-black uppercase mb-3 tracking-widest">ترتیب نوبت‌ها</p>
        <div className="flex flex-col gap-2">
           {room.players.map((p, idx) => (
             <div key={p.id} className={`flex items-center gap-2 p-2 rounded-lg transition-all ${idx === currentPlayerIndex ? 'bg-amber-900/30 border border-amber-500/50' : 'opacity-40'}`}>
               <div className={`w-1.5 h-1.5 rounded-full ${idx === currentPlayerIndex ? 'bg-amber-500 animate-pulse' : 'bg-stone-600'}`} />
               <span className={`text-[11px] truncate font-bold ${idx === currentPlayerIndex ? 'text-amber-100' : 'text-stone-500'}`}>{p.name}</span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-[#0a0f1d] flex flex-col lg:flex-row overflow-hidden font-sans" dir="rtl">
      {/* Sidebar - Desktop Only */}
      <div className="hidden lg:block w-80 shrink-0 border-l border-amber-900/20">
        <Sidebar />
      </div>

      {/* Main Board */}
      <div className="flex-grow relative flex flex-col overflow-hidden">
        {/* Turn Overlay Notification */}
        <div className={`absolute top-20 left-1/2 -translate-x-1/2 z-20 transition-all duration-500 ${isMyTurn ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'}`}>
           <div className="bg-amber-500 text-stone-900 px-8 py-2 rounded-full font-black gothic-font text-xl shadow-[0_0_30px_rgba(245,158,11,0.5)] border-2 border-white animate-bounce">
              نوبت شماست!
           </div>
        </div>

        <div className="absolute top-4 left-1/2 -translate-x-1/2 parchment px-8 py-2 rounded-full border-2 border-amber-900/30 shadow-2xl z-10 text-center whitespace-nowrap scale-90 sm:scale-100 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
          <h2 className="gothic-font text-lg sm:text-2xl text-amber-900 tracking-widest font-bold">فصل اول: تالار سایه‌ها</h2>
        </div>

        {/* Narrative Area */}
        <div className="flex-grow p-4 sm:p-12 flex flex-col items-center justify-center text-center overflow-y-auto relative">
            <div className="fixed inset-0 pointer-events-none opacity-5 flex items-center justify-center">
              <img src="https://images.unsplash.com/photo-1547756536-cde3673fa2e5?q=80&w=1200" className="w-full h-full object-cover grayscale" />
            </div>

            <div className="max-w-4xl bg-stone-900/80 backdrop-blur-xl p-8 sm:p-16 rounded-[3rem] border-2 border-amber-900/30 shadow-[0_0_100px_rgba(0,0,0,0.8)] mt-12 mb-20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                   <svg width="60" height="60" viewBox="0 0 24 24" fill="white"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
                </div>
                <p className="text-2xl sm:text-4xl leading-relaxed text-amber-50 font-light italic transition-all group-hover:text-amber-200">
                  "{room.currentNarrativeStep}"
                </p>
                <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center">
                   <button className="px-10 py-4 bg-transparent border-2 border-amber-800 text-amber-500 hover:bg-amber-800 hover:text-white transition-all rounded-2xl gothic-font text-2xl shadow-xl active:scale-95 group/btn">
                     <span className="block group-hover/btn:-translate-y-1 transition-transform">بررسی عمیق محیط</span>
                   </button>
                   <button className="px-10 py-4 bg-amber-900/20 border-2 border-amber-500/30 text-amber-200 hover:bg-amber-500 hover:text-stone-900 transition-all rounded-2xl gothic-font text-2xl shadow-xl active:scale-95 group/btn">
                     <span className="block group-hover/btn:-translate-y-1 transition-transform">پیشروی با گام‌های لرزان</span>
                   </button>
                </div>
            </div>
        </div>

        {/* Mobile Action Bar */}
        <div className="lg:hidden h-20 bg-stone-900 border-t-2 border-amber-900/30 flex justify-around items-center px-4 shrink-0 relative z-30">
          <button 
            onClick={() => setMobilePanel(mobilePanel === 'spells' ? 'none' : 'spells')}
            className={`flex flex-col items-center gap-1 transition-all ${mobilePanel === 'spells' ? 'text-amber-500 scale-110' : 'text-stone-500'}`}
          >
            <div className={`w-8 h-1 rounded-full mb-1 ${mobilePanel === 'spells' ? 'bg-amber-500' : 'bg-transparent'}`} />
            <span className="text-xs font-black uppercase tracking-tighter">کتاب وردها</span>
          </button>
          
          <div className="w-16 h-16 -mt-10 rounded-full bg-amber-600 border-4 border-stone-900 shadow-2xl flex items-center justify-center text-white">
             <span className="font-black text-xl">{room.turnIndex + 1}</span>
          </div>

          <button 
             onClick={() => setMobilePanel(mobilePanel === 'chat' ? 'none' : 'chat')}
             className={`flex flex-col items-center gap-1 transition-all ${mobilePanel === 'chat' ? 'text-amber-500 scale-110' : 'text-stone-500'}`}
          >
            <div className={`w-8 h-1 rounded-full mb-1 ${mobilePanel === 'chat' ? 'bg-amber-500' : 'bg-transparent'}`} />
            <span className="text-xs font-black uppercase tracking-tighter">پیک جغد</span>
          </button>
        </div>

        {/* System Logs */}
        <div className="h-32 sm:h-44 bg-black/80 border-t border-amber-900/20 p-4 shrink-0 overflow-y-auto">
           <div className="max-w-5xl mx-auto font-mono text-[10px] sm:text-xs text-green-400/80 space-y-1.5 text-right">
              {room.logs.filter(l => l.type !== 'chat').slice(-100).map(log => (
                <div key={log.id} className="flex gap-4 justify-end items-center border-r-2 border-stone-800 pr-3">
                  <span className={log.type === 'combat' ? 'text-red-400' : log.type === 'system' ? 'text-amber-400' : 'text-blue-300'}>
                    {log.message}
                  </span>
                  <span className="text-stone-700 min-w-[70px] font-sans">[{new Date(log.timestamp).toLocaleTimeString('fa-IR')}]</span>
                </div>
              ))}
           </div>
        </div>

        {/* Mobile Overlays */}
        {mobilePanel === 'spells' && (
          <div className="absolute inset-0 z-40 lg:hidden animate-fade-in">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobilePanel('none')} />
            <div className="absolute bottom-20 right-0 left-0 h-4/5 animate-slide-up shadow-[0_-20px_50px_rgba(0,0,0,1)]">
              <Sidebar />
            </div>
          </div>
        )}

        {mobilePanel === 'chat' && (
          <div className="absolute inset-0 z-40 lg:hidden animate-fade-in">
             <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobilePanel('none')} />
             <div className="absolute bottom-20 right-0 left-0 h-4/5 animate-slide-up shadow-[0_-20px_50px_rgba(0,0,0,1)]">
               <Chat logs={room.logs} onAddLog={onAddLog} isMobile />
             </div>
          </div>
        )}

        {isRolling && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 animate-fade-in">
             <DiceRoller onComplete={handleRollComplete} />
          </div>
        )}
      </div>

      {/* Right Sidebar: Chat - Desktop Only */}
      <div className="hidden lg:block w-96 shrink-0 border-r border-amber-900/20 shadow-2xl">
        <Chat logs={room.logs} onAddLog={onAddLog} />
      </div>
      
      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-slide-up { animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(139, 69, 19, 0.3); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default GameScreen;
