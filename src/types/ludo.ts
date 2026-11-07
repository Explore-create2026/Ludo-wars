/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PlayerColor = 'red' | 'green' | 'yellow' | 'blue';

export type GameMode = 'vs_bot' | 'local' | 'online';

export type BotDifficulty = 'easy' | 'medium' | 'hard';

export interface Token {
  id: number;           // 0..3
  color: PlayerColor;
  step: number;         // -1: in yard, 0..50: on common track, 51..55: home path, 56: finished
  isHome: boolean;
  isFinished: boolean;
}

export interface Player {
  id: string;
  name: string;
  color: PlayerColor;
  isBot: boolean;
  botDifficulty?: BotDifficulty;
  isHost?: boolean;
  isConnected: boolean;
  avatar: string;
  tokens: Token[];
}

export interface BoardCoordinate {
  x: number; // 0..14
  y: number; // 0..14
}

export interface GameMoveRecord {
  id: string;
  playerColor: PlayerColor;
  playerName: string;
  diceValue: number;
  tokenId: number;
  fromStep: number;
  toStep: number;
  capturedOpponent?: {
    color: PlayerColor;
    tokenId: number;
  };
  timestamp: string;
}

export interface GameState {
  id: string;
  roomCode?: string;
  mode: GameMode;
  players: Player[];
  activePlayerIndex: number;
  diceValue: number | null;
  diceRolled: boolean;
  consecutiveSixes: number;
  eligibleTokenIds: number[];
  winner: Player | null;
  status: 'waiting' | 'playing' | 'finished';
  moveHistory: GameMoveRecord[];
  bonusRoll: boolean;
  logMessage: string;
}

export interface UserStats {
  id: string;
  username: string;
  email: string;
  avatar: string;
  isGuest?: boolean;
  isLoggedIn?: boolean;
  currentActivity?: 'playing_match' | 'browsing' | 'offline' | 'lobby';
  activeRoomOrMatch?: string;
  lastActiveTimestamp?: string;
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  tokensCaptured: number;
  winRate: number;
  createdAt: string;
  role: 'user' | 'admin';
  status: 'active' | 'blocked';
}

export type AdsterraFormat = 
  | 'banner_728x90'
  | 'banner_300x250'
  | 'banner_468x60'
  | 'banner_320x50'
  | 'banner_160x300'
  | 'banner_160x600'
  | 'native_banner'
  | 'social_bar'
  | 'popunder'
  | 'direct_link'
  | 'footer_banner';

export interface AdsterraAdSlot {
  id: string;
  title: string;
  format: AdsterraFormat;
  placement: 'header' | 'mid_content' | 'footer' | 'sidebar' | 'global_overlay' | 'smart_link';
  enabled: boolean;
  code: string;
  height?: number;
  width?: number;
  description: string;
}

