/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Player, PlayerColor } from '../types/ludo';

export interface RoomData {
  roomCode: string;
  hostId: string;
  hostName: string;
  createdAt: string;
  status: 'waiting' | 'in_game' | 'finished';
  maxPlayers: number;
  players: {
    id: string;
    name: string;
    color: PlayerColor;
    isHost: boolean;
    isReady: boolean;
    isConnected: boolean;
    avatar: string;
  }[];
}

const STORAGE_ROOMS_KEY = 'ludo_wars_online_rooms';

class RoomService {
  private rooms: Map<string, RoomData> = new Map();

  constructor() {
    this.loadRooms();
  }

  private loadRooms() {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem(STORAGE_ROOMS_KEY);
    if (saved) {
      try {
        const arr: RoomData[] = JSON.parse(saved);
        arr.forEach((r) => this.rooms.set(r.roomCode, r));
      } catch {
        // fallback
      }
    }
  }

  private persistRooms() {
    if (typeof window === 'undefined') return;
    const arr = Array.from(this.rooms.values());
    localStorage.setItem(STORAGE_ROOMS_KEY, JSON.stringify(arr));
  }

  public generateRoomCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  public createRoom(hostName: string, hostId: string, maxPlayers: number = 4): RoomData {
    const roomCode = this.generateRoomCode();
    const room: RoomData = {
      roomCode,
      hostId,
      hostName,
      createdAt: new Date().toISOString(),
      status: 'waiting',
      maxPlayers,
      players: [
        {
          id: hostId,
          name: hostName,
          color: 'red',
          isHost: true,
          isReady: true,
          isConnected: true,
          avatar: '👑',
        },
      ],
    };

    this.rooms.set(roomCode, room);
    this.persistRooms();
    return room;
  }

  public joinRoom(roomCode: string, playerName: string, playerId: string): { success: boolean; message: string; room?: RoomData } {
    const room = this.rooms.get(roomCode.toUpperCase().trim());
    if (!room) {
      return { success: false, message: 'Room not found. Please verify the 6-character code.' };
    }

    if (room.status !== 'waiting') {
      return { success: false, message: 'Game has already started in this room.' };
    }

    const existingPlayer = room.players.find((p) => p.id === playerId);
    if (existingPlayer) {
      existingPlayer.isConnected = true;
      this.persistRooms();
      return { success: true, message: 'Reconnected to room.', room };
    }

    if (room.players.length >= room.maxPlayers) {
      return { success: false, message: 'Room is already full.' };
    }

    const availableColors: PlayerColor[] = ['green', 'yellow', 'blue', 'red'];
    const takenColors = room.players.map((p) => p.color);
    const assignedColor = availableColors.find((c) => !takenColors.includes(c)) || 'blue';

    room.players.push({
      id: playerId,
      name: playerName,
      color: assignedColor,
      isHost: false,
      isReady: true,
      isConnected: true,
      avatar: '⚔️',
    });

    this.persistRooms();
    return { success: true, message: 'Joined room successfully!', room };
  }

  public getRoom(roomCode: string): RoomData | null {
    this.loadRooms();
    return this.rooms.get(roomCode.toUpperCase().trim()) || null;
  }

  public addBotToRoom(roomCode: string): RoomData | null {
    const room = this.rooms.get(roomCode);
    if (!room || room.players.length >= room.maxPlayers) return null;

    const availableColors: PlayerColor[] = ['green', 'yellow', 'blue', 'red'];
    const takenColors = room.players.map((p) => p.color);
    const assignedColor = availableColors.find((c) => !takenColors.includes(c)) || 'blue';

    const botNumber = room.players.filter((p) => p.name.includes('Bot')).length + 1;

    room.players.push({
      id: 'bot_' + Math.random().toString(36).substring(2, 7),
      name: `AI Bot ${botNumber}`,
      color: assignedColor,
      isHost: false,
      isReady: true,
      isConnected: true,
      avatar: '🤖',
    });

    this.persistRooms();
    return room;
  }

  public startGame(roomCode: string, hostId: string): { success: boolean; message: string } {
    const room = this.rooms.get(roomCode);
    if (!room) return { success: false, message: 'Room does not exist.' };
    if (room.hostId !== hostId) return { success: false, message: 'Only the room host can start the match.' };
    if (room.players.length < 2) return { success: false, message: 'At least 2 players are needed to start.' };

    room.status = 'in_game';
    this.persistRooms();
    return { success: true, message: 'Match starting!' };
  }

  public getActiveRooms(): RoomData[] {
    this.loadRooms();
    return Array.from(this.rooms.values());
  }

  public deleteRoom(roomCode: string) {
    this.rooms.delete(roomCode);
    this.persistRooms();
  }
}

export const roomService = new RoomService();
