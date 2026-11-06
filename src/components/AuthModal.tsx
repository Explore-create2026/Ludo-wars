/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { statsService } from '../services/statsService';
import { UserStats } from '../types/ludo';
import { X, LogIn, UserPlus, Play, CheckCircle2, Shield, Eye, EyeOff } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserStats) => void;
}

const AVATARS = ['👑', '⚔️', '🦁', '🐉', '⚡', '🔥', '🛡️', '🎯', '🦅', '🐺'];

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('👑');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = statsService.login(username, password);
    if (res.success && res.user) {
      setSuccess(res.message);
      setTimeout(() => {
        onSuccess(res.user!);
        onClose();
      }, 700);
    } else {
      setError(res.message);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = statsService.register(username, email, password, selectedAvatar);
    if (res.success && res.user) {
      setSuccess(res.message);
      setTimeout(() => {
        onSuccess(res.user!);
        onClose();
      }, 700);
    } else {
      setError(res.message);
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#131B30] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0B1020]/60">
          <div className="flex items-center gap-2">
            <span className="text-xl">👑</span>
            <h3 className="font-bold text-base text-white">Warrior Access</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Guest Banner */}
        <div className="bg-purple-950/40 border-b border-purple-500/20 px-6 py-2.5 flex items-center justify-between text-xs">
          <span className="text-purple-300">Registration is optional.</span>
          <button
            onClick={onClose}
            className="font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <span>Play as Guest</span>
            <Play className="w-3 h-3 fill-current" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1.5 mx-6 mt-4 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => {
              setTab('login');
              setError(null);
            }}
            className={`py-2 text-xs font-bold rounded-lg transition ${
              tab === 'login' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setTab('register');
              setError(null);
            }}
            className={`py-2 text-xs font-bold rounded-lg transition ${
              tab === 'register' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Body Form */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-semibold">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>{success}</span>
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Username or Email</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. swapnil@2026"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0B1020] border border-slate-700 text-white text-xs focus:border-purple-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-3 py-2.5 pr-9 rounded-xl bg-[#0B1020] border border-slate-700 text-white text-xs focus:border-purple-500 outline-none font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500">
                <span>Free to play for all warriors</span>
                <span className="text-purple-400">Guest mode active</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg transition"
              >
                Sign In to Battle
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Desired Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. SpartanWarrior"
                  className="w-full px-3 py-2 rounded-xl bg-[#0B1020] border border-slate-700 text-white text-xs focus:border-purple-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full px-3 py-2 rounded-xl bg-[#0B1020] border border-slate-700 text-white text-xs focus:border-purple-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Password (min 5 chars)</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Choose password"
                  className="w-full px-3 py-2 rounded-xl bg-[#0B1020] border border-slate-700 text-white text-xs focus:border-purple-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Pick Champion Avatar</label>
                <div className="flex flex-wrap gap-2">
                  {AVATARS.map((av) => (
                    <button
                      type="button"
                      key={av}
                      onClick={() => setSelectedAvatar(av)}
                      className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center border transition ${
                        selectedAvatar === av
                          ? 'border-amber-400 bg-amber-400/20 scale-105'
                          : 'border-slate-800 bg-[#0B1020] hover:border-slate-600'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg transition mt-2"
              >
                Create Free Account
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
