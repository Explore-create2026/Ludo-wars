/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { statsService } from '../services/statsService';
import { UserStats } from '../types/ludo';
import { X, Trophy, Swords, ShieldCheck, Calendar, Check } from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated?: (user: UserStats) => void;
}

const AVATAR_OPTIONS = ['👑', '⚔️', '🦁', '🐉', '⚡', '🔥', '🛡️', '🎯', '🦅', '🐺'];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onUserUpdated,
}) => {
  const [user, setUser] = useState<UserStats>(statsService.getCurrentUser());
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [avatar, setAvatar] = useState(user.avatar);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    statsService.updateProfile(username, email, avatar);
    const updated = statsService.getCurrentUser();
    setUser(updated);
    if (onUserUpdated) onUserUpdated(updated);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const completedGames = statsService.getCompletedGames();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#131B30] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0B1020]/60">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-lg text-white">Warrior Profile & Dossier</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {saveSuccess && (
            <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4" /> Profile details saved successfully!
            </div>
          )}

          {/* User Bio Card */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-xl bg-[#1E294B]/70 border border-slate-700/60">
            <div className="w-20 h-20 rounded-2xl bg-[#0B1020] border-2 border-purple-500/50 flex items-center justify-center text-4xl shadow-inner">
              {user.avatar}
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h4 className="text-2xl font-bold text-white">{user.username}</h4>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {user.role.toUpperCase()}
                </span>
              </div>
              <p className="text-slate-400 text-sm mt-0.5">{user.email}</p>
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-slate-500 mt-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>Joined {user.createdAt}</span>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 rounded-lg text-xs font-bold border border-slate-600 text-slate-200 hover:bg-slate-800 transition"
            >
              {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </button>
          </div>

          {/* Edit Form */}
          {isEditing && (
            <form onSubmit={handleSave} className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0B1020] border border-slate-700 text-white text-sm focus:border-purple-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0B1020] border border-slate-700 text-white text-sm focus:border-purple-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">Choose Avatar</label>
                <div className="flex flex-wrap gap-2">
                  {AVATAR_OPTIONS.map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => setAvatar(opt)}
                      className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border transition ${
                        avatar === opt ? 'border-amber-400 bg-amber-400/20 scale-110' : 'border-slate-700 bg-slate-800 hover:border-slate-500'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-bold shadow-lg"
              >
                Save Profile Changes
              </button>
            </form>
          )}

          {/* Real Statistics Grid */}
          <div>
            <h5 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-3">Combat Statistics</h5>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#1E294B]/50 border border-slate-800 rounded-xl p-4 text-center">
                <div className="text-2xl font-mono font-bold text-white">{user.gamesPlayed}</div>
                <div className="text-xs text-slate-400 mt-1">Games Played</div>
              </div>
              <div className="bg-[#1E294B]/50 border border-slate-800 rounded-xl p-4 text-center">
                <div className="text-2xl font-mono font-bold text-amber-400">{user.gamesWon}</div>
                <div className="text-xs text-slate-400 mt-1">Victories</div>
              </div>
              <div className="bg-[#1E294B]/50 border border-slate-800 rounded-xl p-4 text-center">
                <div className="text-2xl font-mono font-bold text-emerald-400">{user.winRate}%</div>
                <div className="text-xs text-slate-400 mt-1">Win Rate</div>
              </div>
              <div className="bg-[#1E294B]/50 border border-slate-800 rounded-xl p-4 text-center">
                <div className="text-2xl font-mono font-bold text-purple-400">{user.tokensCaptured}</div>
                <div className="text-xs text-slate-400 mt-1">Tokens Captured</div>
              </div>
            </div>
          </div>

          {/* Recent Match History */}
          <div>
            <h5 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-3">Recent Match History</h5>
            {completedGames.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
                No completed matches yet. Jump into a game to start logging your legacy!
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {completedGames.slice(0, 6).map((match) => {
                  const won = match.winnerName === user.username;
                  return (
                    <div
                      key={match.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full ${won ? 'bg-emerald-400' : 'bg-red-400'}`} />
                        <div>
                          <div className="font-bold text-white">
                            {match.mode.toUpperCase()} · Winner: {match.winnerName}
                          </div>
                          <div className="text-slate-500 text-[11px]">
                            {new Date(match.date).toLocaleDateString()} · {match.totalMoves} moves
                          </div>
                        </div>
                      </div>
                      <span className={`font-bold px-2 py-0.5 rounded ${won ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                        {won ? 'VICTORY' : 'DEFEAT'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
