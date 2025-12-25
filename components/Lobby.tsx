
import React from 'react';
import { RoomState, Player } from '../types';
import { CHARACTERS } from '../constants';

interface LobbyProps {
  room: RoomState;
  myPlayerId: string;
  onReady: () => void;
  onStart: () => void;
  onSelectChar: (id: string) => void;
  selectedCharId: string | null;
  onAddBot: () => void;
  onRemoveBot: (id: string) => void;
}

const Lobby: React.FC<LobbyProps> = ({ 
  room, 
  myPlayerId, 
  onReady, 
  onStart, 
  onSelectChar, 
  selectedCharId,
  onAddBot,
  onRemoveBot
}) => {
  const me = room.players.find(p => p.id === myPlayerId);
  const totalPlayers = room.players.length;

  return (
    <div className="min-h-screen bg-[#0a0f1d] p-4 sm:p-8 flex flex-col lg:flex-row gap-6 overflow-auto" dir="rtl">
      {/* Background Decor */}
      <div className="fixed top-20 left-20 w-96 h-96 bg-blue-900/10 blur-[150px] -z-10 rounded-full" />
      <div className="fixed bottom-20 right-20 w-96 h-96 bg-amber-900/10 blur-[150px] -z-10 rounded-full" />

      {/* Center Container: Main Room Info */}
      <div className="flex-[3] flex flex-col gap-6 order-2 lg:order-1">
        <div className="parchment p-6 sm:p-10 rounded-3xl shadow-2xl border-4 border-amber-900/20">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4 border-b border-amber-900/10 pb-6">
            <div>
              <h2 className="gothic-font text-4xl text-amber-900 drop-shadow-sm">تالار نبرد: {room.id}</h2>
              <p className="text-xs text-amber-800/60 mt-1 font-bold uppercase tracking-widest">Wizards Gathering Hall</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={onAddBot}
                disabled={totalPlayers >= 6}
                className="bg-stone-800 text-amber-50 px-5 py-2 rounded-xl text-sm hover:bg-black transition-all shadow-md disabled:opacity-50 font-bold border-b-2 border-stone-950"
              >
                + افزودن ربات
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {room.players.map(p => (
              <div key={p.id} className="flex items-center justify-between p-5 bg-amber-50/50 rounded-2xl border border-amber-900/10 shadow-sm transition-all hover:bg-amber-100/50 group">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className={`w-3 h-3 rounded-full absolute -top-1 -right-1 z-10 border-2 border-white ${p.isReady || p.isBot ? 'bg-green-600' : 'bg-red-600 animate-pulse'}`} />
                    <div className="w-12 h-12 rounded-full bg-amber-900/10 flex items-center justify-center border border-amber-900/20 overflow-hidden shadow-inner">
                      {p.characterId ? (
                        <img src={CHARACTERS.find(c => c.id === p.characterId)?.imageUrl} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-amber-900/30 text-lg">?</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-stone-800 text-lg flex items-center gap-2">
                      {p.name}
                      {p.isHost && <span className="text-[10px] bg-amber-800 text-white px-2 py-0.5 rounded-full font-normal">میزبان</span>}
                      {p.isBot && <span className="text-[10px] bg-stone-700 text-amber-100 px-2 py-0.5 rounded-full font-normal">ربات</span>}
                    </span>
                    <span className="text-xs italic text-stone-500 font-bold">
                      {CHARACTERS.find(c => c.id === p.characterId)?.name || 'در انتظار انتخاب شخصیت...'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {p.isBot && (
                    <button 
                      onClick={() => onRemoveBot(p.id)}
                      className="text-red-700 hover:text-red-900 p-2 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14V4zM6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12z"/></svg>
                    </button>
                  )}
                  <span className={`text-xs font-black px-3 py-1 rounded-lg ${p.isReady || p.isBot ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
                    {p.isReady || p.isBot ? 'آماده' : 'در انتظار'}
                  </span>
                </div>
              </div>
            ))}
            {totalPlayers < 2 && (
              <div className="md:col-span-2 p-4 bg-amber-900/5 border-2 border-dashed border-amber-900/20 rounded-2xl text-center text-amber-900/60 font-bold italic">
                در انتظار جادوگران بیشتر... (حداقل ۲ نفر)
              </div>
            )}
          </div>

          <h3 className="gothic-font text-3xl text-amber-900 mb-6 text-center border-t border-amber-900/10 pt-8">شخصیت جادویی خود را انتخاب کنید</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CHARACTERS.map(char => (
              <button
                key={char.id}
                onClick={() => onSelectChar(char.id)}
                className={`p-4 rounded-2xl text-right transition-all border-2 flex flex-row-reverse gap-4 items-center shrink-0 ${
                  selectedCharId === char.id 
                    ? 'border-amber-600 bg-amber-200 shadow-xl scale-[1.03]' 
                    : 'border-amber-900/5 bg-amber-50/50 hover:bg-amber-100/50 hover:border-amber-300'
                }`}
              >
                <img src={char.imageUrl} alt={char.name} className="w-16 h-16 rounded-xl object-cover border-2 border-amber-900/20 shadow-md" />
                <div className="flex-grow text-right">
                  <div className="font-bold text-lg text-amber-900 leading-tight">{char.name}</div>
                  <div className="text-[10px] italic text-stone-600 mb-2 leading-tight">{char.title}</div>
                  <div className="flex flex-row-reverse gap-2 text-[10px] font-bold justify-end">
                    <span className="text-red-700 bg-red-100 px-2 py-0.5 rounded">HP: {char.stats.stamina}</span>
                    <span className="text-blue-700 bg-blue-100 px-2 py-0.5 rounded">MP: {char.stats.mana}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar: Controls & Logs */}
      <div className="w-full lg:w-96 flex flex-col gap-6 order-1 lg:order-2">
        <div className="parchment p-8 rounded-3xl text-center border-4 border-amber-900/20 shadow-2xl flex flex-col justify-between min-h-[400px]">
          <div>
            <h3 className="gothic-font text-3xl mb-10 text-amber-900 drop-shadow-sm">وضعیت نبرد</h3>
            <div className="space-y-4 mb-10">
              <div className="flex justify-between items-center bg-amber-900/5 p-3 rounded-xl border border-amber-900/10">
                <span className="text-stone-600 font-bold">تعداد جادوگران:</span>
                <span className="font-black text-amber-900 text-xl">{totalPlayers} / ۶</span>
              </div>
              <div className="flex justify-between items-center bg-amber-900/5 p-3 rounded-xl border border-amber-900/10">
                <span className="text-stone-600 font-bold">وضعیت شما:</span>
                <span className={`font-black text-sm px-3 py-1 rounded-lg ${me?.isReady ? 'bg-green-600 text-white' : 'bg-red-600 text-white animate-pulse'}`}>
                  {me?.isReady ? 'آماده نبرد' : 'در حال آماده‌سازی'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button 
              onClick={onReady}
              disabled={!selectedCharId}
              className={`w-full py-5 rounded-2xl gothic-font text-2xl transition-all shadow-xl transform active:scale-95 border-b-4 ${
                me?.isReady 
                  ? 'bg-red-800 hover:bg-red-900 text-white border-red-950' 
                  : 'bg-amber-800 hover:bg-amber-900 text-amber-50 border-amber-950'
              } disabled:opacity-30 disabled:cursor-not-allowed`}
            >
              {me?.isReady ? 'لغو آمادگی' : 'اعلام آمادگی'}
            </button>

            {me?.isHost && (
              <button 
                onClick={onStart}
                className="w-full py-5 rounded-2xl gothic-font text-3xl bg-stone-900 text-amber-100 hover:bg-black border-2 border-amber-800 shadow-2xl transform active:scale-95 transition-all border-b-4 border-stone-950"
              >
                شروع ماجراجویی
              </button>
            )}
            
            <p className="mt-8 text-xs text-stone-500 italic leading-relaxed px-4">
              "فقط جادوگران جسور به انتهای این تالار خواهند رسید."
            </p>
          </div>
        </div>

        <div className="bg-stone-900/90 p-6 rounded-3xl border-2 border-amber-900/30 text-[11px] text-amber-200/80 font-mono shadow-inner h-64 lg:flex-grow overflow-hidden flex flex-col">
          <p className="font-black border-b border-amber-900/20 pb-3 mb-4 text-xs text-amber-500 uppercase tracking-widest flex justify-between">
            <span>وقایع‌نگار تالار</span>
            <span className="animate-pulse">● LIVE</span>
          </p>
          <div className="space-y-3 overflow-y-auto flex-grow text-right pr-2 custom-scrollbar">
            {room.logs.slice().reverse().map(log => (
              <div key={log.id} className="leading-relaxed border-r-2 border-amber-900/30 pr-3 pb-1">
                <span className="opacity-40 ml-2">[{new Date(log.timestamp).toLocaleTimeString('fa-IR')}]</span>
                <span className="font-bold">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 69, 19, 0.4);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default Lobby;
