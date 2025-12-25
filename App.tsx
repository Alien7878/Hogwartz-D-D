
import React, { useState, useEffect, useCallback } from 'react';
import { GameStatus, RoomState, Player, GameLog } from './types';
import { CHARACTERS, INITIAL_NARRATIVE } from './constants';
import Lobby from './components/Lobby';
import GameScreen from './components/GameScreen';

const INITIAL_PLAYER_ID = 'wizard_' + Math.random().toString(36).substr(2, 9);

const App: React.FC = () => {
  const [userName, setUserName] = useState<string>('');
  const [isJoined, setIsJoined] = useState(false);
  const [room, setRoom] = useState<RoomState | null>(null);
  const [myPlayerId] = useState(INITIAL_PLAYER_ID);
  const [selectedCharId, setSelectedCharId] = useState<string | null>(null);

  useEffect(() => {
    const savedName = localStorage.getItem('wizard_name');
    if (savedName) setUserName(savedName);
  }, []);

  const createRoom = () => {
    if (!userName.trim()) return alert("ابتدا نام جادویی خود را وارد کنید!");
    localStorage.setItem('wizard_name', userName);
    
    const host: Player = {
      id: myPlayerId,
      name: userName,
      characterId: null,
      isReady: false,
      isHost: true,
      isSpectator: false,
      isBot: false,
      currentHp: 100,
      currentMp: 100,
      position: { x: 0, y: 0 }
    };

    const newRoom: RoomState = {
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      status: GameStatus.LOBBY,
      players: [host],
      logs: [{
        id: '1',
        type: 'system',
        sender: 'وزارت سحر و جادو',
        message: `${userName} تالار اسرار جدیدی را بنا نهاد.`,
        timestamp: Date.now()
      }],
      turnIndex: 0,
      currentNarrativeStep: INITIAL_NARRATIVE
    };

    setRoom(newRoom);
    setIsJoined(true);
  };

  const addBot = () => {
    if (!room) return;
    if (room.players.length >= 6) return alert("ظرفیت تالار تکمیل است (حداکثر ۶ جادوگر)!");

    const botNames = ["شبه‌سایه", "وردخوان خودکار", "محافظ تالار", "دوست خیالی رون"];
    const randomChar = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
    
    const botPlayer: Player = {
      id: 'bot_' + Math.random().toString(36).substr(2, 5),
      name: botNames[Math.floor(Math.random() * botNames.length)] + " " + (room.players.length),
      characterId: randomChar.id,
      isReady: true,
      isHost: false,
      isSpectator: false,
      isBot: true,
      currentHp: randomChar.stats.stamina,
      currentMp: randomChar.stats.mana,
      position: { x: 0, y: 0 }
    };

    setRoom(prev => prev ? {
      ...prev,
      players: [...prev.players, botPlayer],
      logs: [...prev.logs, {
        id: Date.now().toString(),
        type: 'system',
        sender: 'سیستم',
        message: `یک ربات جادوگر به نام ${botPlayer.name} به جمع ما پیوست.`,
        timestamp: Date.now()
      }]
    } : null);
  };

  const removeBot = (botId: string) => {
    setRoom(prev => prev ? {
      ...prev,
      players: prev.players.filter(p => p.id !== botId)
    } : null);
  };

  const toggleReady = () => {
    if (!room) return;
    setRoom(prev => {
      if (!prev) return null;
      return {
        ...prev,
        players: prev.players.map(p => 
          p.id === myPlayerId ? { ...p, isReady: !p.isReady } : p
        )
      };
    });
  };

  const selectCharacter = (charId: string) => {
    setSelectedCharId(charId);
    setRoom(prev => {
      if (!prev) return null;
      const char = CHARACTERS.find(c => c.id === charId);
      return {
        ...prev,
        players: prev.players.map(p => 
          p.id === myPlayerId ? { 
            ...p, 
            characterId: charId,
            currentHp: char?.stats.stamina || 100,
            currentMp: char?.stats.mana || 100 
          } : p
        )
      };
    });
  };

  const startGame = () => {
    if (!room) return;
    const humanPlayers = room.players.filter(p => !p.isBot);
    const allHumansReady = humanPlayers.every(p => p.isReady && p.characterId);
    
    if (room.players.length < 2) return alert("برای شروع نبرد حداقل به ۲ جادوگر (انسان یا ربات) نیاز است!");
    if (!allHumansReady) return alert("تمام جادوگران هنوز آماده نبرد نیستند!");
    
    setRoom(prev => {
      if (!prev) return null;
      return { 
        ...prev, 
        status: GameStatus.PLAYING,
        players: prev.players.map(p => !p.isReady && !p.isBot ? { ...p, isSpectator: true } : p)
      };
    });
  };

  const addLog = useCallback((msg: string, type: GameLog['type'] = 'chat', sender?: string) => {
    setRoom(prev => {
      if (!prev) return null;
      return {
        ...prev,
        logs: [
          ...prev.logs,
          {
            id: Date.now().toString(),
            type,
            sender: sender || userName,
            message: msg,
            timestamp: Date.now()
          }
        ]
      };
    });
  }, [userName]);

  if (!isJoined) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0a0f1d] relative overflow-hidden">
        {/* Decorative Light Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-blue-900/20 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-amber-900/20 blur-[100px] rounded-full" />
        
        <div className="parchment p-8 sm:p-12 rounded-3xl max-w-lg w-full border-[8px] border-amber-900/20 text-center shadow-[0_0_80px_rgba(0,0,0,0.8)] z-10">
          <div className="mb-10">
            <h1 className="gothic-font text-5xl sm:text-6xl text-amber-900 mb-2 drop-shadow-md">دنیای جادوگری</h1>
            <p className="text-amber-800/60 text-sm tracking-[0.3em] uppercase gothic-font font-bold">RPG Legacy</p>
          </div>
          
          <div className="space-y-8">
            <div className="relative group">
              <input 
                className="w-full p-5 rounded-2xl bg-amber-50/70 border-2 border-amber-900/10 text-stone-900 placeholder-stone-500 focus:outline-none focus:border-amber-700 text-center text-2xl transition-all shadow-inner font-bold"
                placeholder="نام جادویی شما..."
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={createRoom}
                className="bg-amber-800 hover:bg-amber-900 text-amber-50 font-black py-5 rounded-2xl gothic-font text-2xl transition-all transform active:scale-95 shadow-xl border-b-4 border-amber-950"
              >
                ایجاد تالار جدید
              </button>
              <button 
                onClick={() => alert("در این نسخه فقط 'ایجاد تالار' فعال است.")}
                className="bg-stone-800 hover:bg-stone-900 text-amber-100 font-black py-4 rounded-2xl gothic-font text-xl transition-all transform active:scale-95 shadow-lg opacity-80"
              >
                ورود به تالار (بزودی)
              </button>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-amber-900/10">
            <p className="text-sm text-amber-900/60 italic leading-relaxed font-serif">
              "این کلمات هستند که جادو را بیدار می‌کنند."
              <br/>— آلبوس دامبلدور
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (room?.status === GameStatus.LOBBY) {
    return (
      <Lobby 
        room={room} 
        myPlayerId={myPlayerId} 
        onReady={toggleReady} 
        onStart={startGame}
        onSelectChar={selectCharacter}
        selectedCharId={selectedCharId}
        onAddBot={addBot}
        onRemoveBot={removeBot}
      />
    );
  }

  return (
    <GameScreen 
      room={room!} 
      myPlayerId={myPlayerId}
      onAddLog={addLog}
      onSetRoom={setRoom}
    />
  );
};

export default App;
