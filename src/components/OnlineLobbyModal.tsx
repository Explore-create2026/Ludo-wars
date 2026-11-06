/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { roomService, RoomData } from '../services/roomService';
import { statsService } from '../services/statsService';
import { PlayerColor } from '../types/ludo';
import { COLOR_CONFIG } from '../constants/boardGeometry';
import { X, Copy, Check, Play, UserPlus, Users, KeyRound } from 'lucide-react';

interface OnlineLobbyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartMatch: (room: RoomData) => void;
}

export const OnlineLobbyModal: React.FC<OnlineLobbyModalProps> = ({
  isOpen,
  onClose,
  onStartMatch,
}) => {
  const [tab, setTab] = useState<'menu' | 'create' | 'join' | 'lobby'>('menu');
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [currentRoom, setCurrentRoom] = useState<RoomData | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const currentUser = statsService.getCurrentUser();

  if (!isOpen) return null;

  const handleCreateRoom = (maxPlayers: number) => {
    const room = roomService.createRoom(currentUser.username, currentUser.id, maxPlayers);
    setCurrentRoom(room);
    setTab('lobby');
    setErrorMessage(null);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const res = roomService.joinRoom(roomCodeInput, currentUser.username, currentUser.id);
    if (res.success && res.room) {
      setCurrentRoom(res.room);
      setTab('lobby');
      setErrorMessage(null);
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleAddBot = () => {
    if (!currentRoom) return;
    const updated = roomService.addBotToRoom(currentRoom.roomCode);
    if (updated) {
      setCurrentRoom({ ...updated });
    }
  };

  const handleCopyCode = () => {
    if (!currentRoom) return;
    navigator.clipboard.writeText(currentRoom.roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartGame = () => {
    if (!currentRoom) return;
    const res = roomService.startGame(currentRoom.roomCode, currentUser.id);
    if (res.success) {
      onStartMatch(currentRoom);
      onClose();
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#131B30] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0B1020]/60">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-lg text-white">Online Multiplayer Arena</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-semibold">
              {errorMessage}
            </div>
          )}

          {/* MENU VIEW */}
          {tab === 'menu' && (
            <div className="space-y-4">
              <p className="text-slate-400 text-sm">
                Create a private room to invite friends or join an existing game using a 6-character room code.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <button
                  onClick={() => setTab('create')}
                  className="p-6 rounded-2xl bg-[#1E294B] border border-slate-700 hover:border-purple-500 text-left transition transform hover:-translate-y-1 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition">
                    ⚔️
                  </div>
                  <h4 className="font-bold text-base text-white">Create Room</h4>
                  <p className="text-xs text-slate-400 mt-1">Host a private match with 2, 3, or 4 slots</p>
                </button>

                <button
                  onClick={() => setTab('join')}
                  className="p-6 rounded-2xl bg-[#1E294B] border border-slate-700 hover:border-amber-500 text-left transition transform hover:-translate-y-1 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition">
                    🔑
                  </div>
                  <h4 className="font-bold text-base text-white">Join Room</h4>
                  <p className="text-xs text-slate-400 mt-1">Enter a friend's 6-letter room key</p>
                </button>
              </div>
            </div>
          )}

          {/* CREATE ROOM VIEW */}
          {tab === 'create' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-white">Choose Max Players</h4>
              <p className="text-xs text-slate-400">Select how many commanders will battle on the board.</p>

              <div className="grid grid-cols-3 gap-3 py-2">
                {[2, 3, 4].map((count) => (
                  <button
                    key={count}
                    onClick={() => handleCreateRoom(count)}
                    className="p-4 rounded-xl bg-[#1E294B] hover:bg-purple-600/30 border border-slate-700 hover:border-purple-500 text-center transition"
                  >
                    <div className="text-2xl font-mono font-bold text-white mb-1">{count}</div>
                    <div className="text-xs text-slate-400 font-semibold">Players</div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setTab('menu')}
                className="w-full py-2.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
              >
                Back to Options
              </button>
            </div>
          )}

          {/* JOIN ROOM VIEW */}
          {tab === 'join' && (
            <form onSubmit={handleJoinRoom} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Enter 6-Digit Room Code</label>
                <div className="relative">
                  <KeyRound className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    maxLength={6}
                    value={roomCodeInput}
                    onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                    placeholder="e.g. WAR88X"
                    className="w-full pl-11 pr-4 py-3 bg-[#0B1020] border border-slate-700 rounded-xl text-lg font-mono tracking-widest text-white text-center focus:border-amber-400 outline-none uppercase font-bold"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTab('menu')}
                  className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg transition"
                >
                  Join Lobby
                </button>
              </div>
            </form>
          )}

          {/* LOBBY VIEW */}
          {tab === 'lobby' && currentRoom && (
            <div className="space-y-6">
              {/* Room Code Banner */}
              <div className="p-4 rounded-xl bg-[#0B1020] border border-purple-500/40 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Room Code</span>
                  <div className="text-2xl font-mono font-extrabold text-[#F5C76B] tracking-widest">
                    {currentRoom.roomCode}
                  </div>
                </div>

                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-semibold transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>

              {/* Player Slots */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                    Squad ({currentRoom.players.length}/{currentRoom.maxPlayers})
                  </span>
                  {currentRoom.players.length < currentRoom.maxPlayers && (
                    <button
                      onClick={handleAddBot}
                      className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold"
                    >
                      <UserPlus className="w-3.5 h-3.5" /> Add AI Bot
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {currentRoom.players.map((p) => {
                    const cfg = COLOR_CONFIG[p.color];
                    return (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{p.avatar}</span>
                          <div>
                            <div className="font-bold text-white text-sm flex items-center gap-2">
                              <span>{p.name}</span>
                              {p.isHost && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                                  HOST
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] font-semibold" style={{ color: cfg.primary }}>
                              {cfg.name} Army
                            </span>
                          </div>
                        </div>

                        <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                          ● Ready
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Host Start Button */}
              {currentRoom.hostId === currentUser.id ? (
                <button
                  onClick={handleStartGame}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transition"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Launch Match Now</span>
                </button>
              ) : (
                <div className="text-center p-3 text-xs text-slate-400 animate-pulse">
                  Waiting for host {currentRoom.hostName} to launch the match...
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
