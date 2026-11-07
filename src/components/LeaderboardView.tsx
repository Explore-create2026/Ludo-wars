/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { statsService } from '../services/statsService';
import { AdsterraAdBanner } from './AdsterraAdBanner';
import { GoogleAdSenseBanner } from './GoogleAdSenseBanner';
import { Trophy, Medal, Crown, Flame, Search } from 'lucide-react';

export const LeaderboardView: React.FC = () => {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'all-time'>('all-time');
  const [search, setSearch] = useState('');

  const leaderboard = statsService.getLeaderboard(period);
  const filtered = leaderboard.filter((item) =>
    item.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm mb-1">
            <Trophy className="w-4 h-4" />
            <span>HALL OF CHAMPIONS</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Global Leaderboards
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Real competitive standings calculated from tournament-grade matches.
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-xl">
          {(['daily', 'weekly', 'all-time'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 text-xs font-bold rounded-lg uppercase tracking-wider transition-all ${
                period === p
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {p.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      {filtered.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Rank 2 */}
          <div className="order-2 md:order-1 glass-panel rounded-2xl p-6 text-center border border-slate-700/60 relative overflow-hidden flex flex-col items-center justify-between">
            <div className="absolute top-3 left-4 text-2xl font-black text-slate-500">#2</div>
            <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-slate-400 flex items-center justify-center text-3xl shadow-lg my-2">
              {filtered[1].avatar}
            </div>
            <div>
              <div className="font-bold text-lg text-white">{filtered[1].username}</div>
              <div className="text-xs text-slate-400 mt-1">{filtered[1].gamesWon} Wins · {filtered[1].winRate}% Win Rate</div>
            </div>
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
              <Medal className="w-3.5 h-3.5 text-slate-400" /> Silver Master
            </div>
          </div>

          {/* Rank 1 (Gold) */}
          <div className="order-1 md:order-2 glass-panel-elevated rounded-2xl p-6 text-center border-2 border-amber-400/50 relative overflow-hidden flex flex-col items-center justify-between bg-gradient-to-b from-[#1E294B] to-[#131B30]">
            <div className="absolute top-3 left-4 text-2xl font-black text-amber-400">#1</div>
            <div className="w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-4xl shadow-xl shadow-amber-500/20 my-2">
              {filtered[0].avatar}
            </div>
            <div>
              <div className="font-extrabold text-xl text-white flex items-center justify-center gap-1.5">
                <span>{filtered[0].username}</span>
                <Crown className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-xs text-amber-200 mt-1">{filtered[0].gamesWon} Wins · {filtered[0].winRate}% Win Rate</div>
            </div>
            <div className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold shadow">
              <Flame className="w-3.5 h-3.5 text-amber-400" /> Apex Champion
            </div>
          </div>

          {/* Rank 3 */}
          <div className="order-3 glass-panel rounded-2xl p-6 text-center border border-slate-700/60 relative overflow-hidden flex flex-col items-center justify-between">
            <div className="absolute top-3 left-4 text-2xl font-black text-amber-700">#3</div>
            <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-amber-700 flex items-center justify-center text-3xl shadow-lg my-2">
              {filtered[2].avatar}
            </div>
            <div>
              <div className="font-bold text-lg text-white">{filtered[2].username}</div>
              <div className="text-xs text-slate-400 mt-1">{filtered[2].gamesWon} Wins · {filtered[2].winRate}% Win Rate</div>
            </div>
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-amber-500 text-xs font-semibold">
              <Medal className="w-3.5 h-3.5 text-amber-600" /> Bronze Veteran
            </div>
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search warrior by username..."
          className="w-full pl-11 pr-4 py-3 bg-[#131B30] border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
        />
      </div>

      {/* Leaderboard Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-4 px-6 text-center">Rank</th>
                <th className="py-4 px-6">Player</th>
                <th className="py-4 px-6 text-center">Matches</th>
                <th className="py-4 px-6 text-center">Victories</th>
                <th className="py-4 px-6 text-center">Win Rate</th>
                <th className="py-4 px-6 text-center">Captures</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filtered.map((player) => (
                <tr
                  key={player.username}
                  className="hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-4 px-6 text-center font-mono font-bold text-slate-300">
                    {player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : player.rank === 3 ? '🥉' : `#${player.rank}`}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{player.avatar}</span>
                      <span className="font-bold text-white">{player.username}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center font-mono text-slate-400">
                    {player.gamesPlayed}
                  </td>
                  <td className="py-4 px-6 text-center font-mono font-bold text-amber-400">
                    {player.gamesWon}
                  </td>
                  <td className="py-4 px-6 text-center font-mono text-emerald-400 font-bold">
                    {player.winRate}%
                  </td>
                  <td className="py-4 px-6 text-center font-mono text-purple-400">
                    {player.tokensCaptured}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adsterra Leaderboard Banner */}
      <div className="mt-8 flex justify-center">
        <AdsterraAdBanner slotId="adst_mid_300x250" fallbackFormat="300x250" />
      </div>

      {/* Google AdSense Recommended / Auto-Relaxed Unit */}
      <div className="mt-6">
        <GoogleAdSenseBanner slot="9192070017" client="ca-pub-8772765378084223" format="autorelaxed" />
      </div>
    </div>
  );
};
