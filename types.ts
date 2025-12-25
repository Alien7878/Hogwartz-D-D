
export enum GameStatus {
  LOBBY = 'LOBBY',
  STARTING = 'STARTING',
  PLAYING = 'PLAYING',
  FINISHED = 'FINISHED'
}

export type Stats = {
  stamina: number;
  mana: number;
  wisdom: number;
  luck: number;
};

export type Spell = {
  name: string;
  description: string;
  manaCost: number;
  baseDamage: number;
  type: 'Attack' | 'Defend' | 'Utility' | 'Curse';
};

export type Character = {
  id: string;
  name: string;
  title: string;
  house: 'Gryffindor' | 'Slytherin' | 'Ravenclaw' | 'Hufflepuff' | 'Neutral';
  stats: Stats;
  spells: Spell[];
  imageUrl: string;
  isBoss?: boolean;
};

export type Player = {
  id: string;
  name: string;
  characterId: string | null;
  isReady: boolean;
  isHost: boolean;
  isSpectator: boolean;
  isBot: boolean;
  currentHp: number;
  currentMp: number;
  position: { x: number; y: number };
};

export type GameLog = {
  id: string;
  type: 'system' | 'chat' | 'combat' | 'narrative';
  sender: string;
  message: string;
  timestamp: number;
};

export type RoomState = {
  id: string;
  status: GameStatus;
  players: Player[];
  logs: GameLog[];
  turnIndex: number;
  currentNarrativeStep: string;
};
