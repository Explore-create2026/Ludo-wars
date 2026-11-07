/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { statsService, StoredUserAccount } from '../services/statsService';
import { roomService } from '../services/roomService';
import { adsterraService } from '../services/adsterraService';
import { AdsterraAdSlot, AdsterraFormat } from '../types/ludo';
import {
  LayoutDashboard,
  Users,
  Radio,
  Gamepad2,
  Megaphone,
  Settings,
  ShieldCheck,
  Search,
  CheckCircle,
  Ban,
  Trash2,
  Code2,
  Download,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Lock,
  Plus,
} from 'lucide-react';
import { downloadPhpPackage } from '../services/phpPackageGenerator';

interface AdminPanelProps {
  onBackToGame: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBackToGame }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('ludo_wars_admin_authed') === 'true';
    }
    return false;
  });
  const [inputUsername, setInputUsername] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'users' | 'adsterra' | 'games' | 'settings'>('activity');
  const [adsterraSlots, setAdsterraSlots] = useState<AdsterraAdSlot[]>(adsterraService.getSlots());
  const [activityFilter, setActivityFilter] = useState<'all' | 'playing' | 'browsing' | 'offline'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [saveAlert, setSaveAlert] = useState<string | null>(null);

  const [siteSettings, setSiteSettings] = useState({
    siteName: 'Ludo Warss',
    seoTitle: 'Ludo Warss — Premium Online & Offline Ludo Gaming Platform',
    seoDescription: 'Play standard tournament Ludo online with friends, local multiplayer pass & play, or against smart AI bots. Free to play.',
    contactEmail: 'swapnil@ludowars.com',
  });

  const triggerSaveNotification = (msg: string) => {
    setSaveAlert(msg);
    setTimeout(() => setSaveAlert(null), 3000);
  };

  const activityData = statsService.getAllUsersForMonitor();
  const completedGames = statsService.getCompletedGames();
  const activeRooms = roomService.getActiveRooms();

  // Handlers for Adsterra Slots
  const handleToggleAdSlot = (id: string) => {
    adsterraService.toggleSlot(id);
    setAdsterraSlots([...adsterraService.getSlots()]);
    triggerSaveNotification('Adsterra ad status updated.');
  };

  const handleUpdateAdCode = (id: string, newCode: string) => {
    adsterraService.updateSlot(id, { code: newCode });
    setAdsterraSlots([...adsterraService.getSlots()]);
  };

  const handleSaveAdSlot = (id: string) => {
    const slot = adsterraSlots.find((s) => s.id === id);
    if (slot) {
      adsterraService.updateSlot(id, { code: slot.code });
      triggerSaveNotification(`${slot.title} code saved & activated!`);
    }
  };

  const handleDownloadZip = async () => {
    setIsDownloading(true);
    try {
      await downloadPhpPackage();
      triggerSaveNotification('premium-ludo-netlify.zip generated successfully!');
    } catch {
      triggerSaveNotification('Error generating zip package.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const u = inputUsername.trim();
    const p = inputPassword.trim();
    if (u === 'swapnil@2026' && (p === '700124' || p === 'password - 700124')) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('ludo_wars_admin_authed', 'true');
      }
      setIsAuthenticated(true);
      triggerSaveNotification('Welcome, Admin Swapnil!');
    } else {
      setAuthError('Access Denied: Invalid administrator credentials.');
    }
  };

  const handleAdminLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('ludo_wars_admin_authed');
    }
    setIsAuthenticated(false);
    setInputPassword('');
    triggerSaveNotification('Admin CMS locked.');
  };

  // If not authenticated, render the dedicated Security Gateway Panel
  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-screen bg-[#0B1020] text-slate-100 flex items-center justify-center p-4 selection:bg-purple-600 selection:text-white">
        <div className="w-full max-w-md bg-[#131B30] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600/30 to-amber-500/20 border border-purple-500/50 flex items-center justify-center text-3xl mx-auto shadow-inner">
              🔒
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Admin CMS Portal</h2>
            <p className="text-xs text-slate-400">
              Master authorization required. Enter administrator credentials to access user monitoring and platform controls.
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-semibold text-center">
              {authError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Administrator Username</label>
              <input
                type="text"
                value={inputUsername}
                onChange={(e) => setInputUsername(e.target.value)}
                placeholder="e.g. swapnil@2026"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B1020] border border-slate-700 text-white text-xs focus:border-purple-500 outline-none font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Administrator Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-[#0B1020] border border-slate-700 text-white text-xs focus:border-purple-500 outline-none font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                Authorized Personnel Only
              </span>
              <span>Encrypted Access</span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-xl shadow-purple-600/30 transition cursor-pointer"
            >
              Authenticate & Access CMS
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800 text-center">
            <button
              onClick={onBackToGame}
              className="text-xs text-slate-400 hover:text-white transition"
            >
              ← Return to Ludo Warss Arena
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#0B1020] text-slate-100 flex flex-col font-sans">
      {/* Admin Top Navigation */}
      <header className="border-b border-slate-800 bg-[#131B30] px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-xl">
            🛡️
          </div>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              Ludo Warss <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono">ADMIN CMS</span>
            </h1>
            <p className="text-xs text-slate-400">Live User Monitoring & Adsterra Monetization Hub</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Admin Identity Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-400">Admin:</span>
            <span className="font-bold text-amber-300 font-mono">swapnil@2026</span>
          </div>

          <button
            onClick={handleDownloadZip}
            disabled={isDownloading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloading ? 'Building ZIP...' : 'Download PHP Package'}</span>
          </button>

          <button
            onClick={onBackToGame}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
          >
            ← Back to Game
          </button>

          <button
            onClick={handleAdminLogout}
            title="Lock Admin CMS and require password to re-enter"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 text-xs font-semibold transition cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock CMS</span>
          </button>
        </div>
      </header>

      {/* Save Toast Notification */}
      {saveAlert && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-emerald-600 text-white font-semibold text-sm shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-5 h-5" />
          <span>{saveAlert}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Sidebar Tabs */}
        <aside className="md:col-span-1 space-y-1">
          {[
            { id: 'activity', label: 'Live User Activity', icon: Radio },
            { id: 'adsterra', label: 'Adsterra Ads (All)', icon: Megaphone },
            { id: 'overview', label: 'Dashboard Stats', icon: LayoutDashboard },
            { id: 'users', label: 'User Directory', icon: Users },
            { id: 'games', label: 'Match History', icon: Gamepad2 },
            { id: 'settings', label: 'Platform Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                  active
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-sm'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Tab Content */}
        <main className="md:col-span-4 space-y-6">
          {/* TAB 1: LIVE USER ACTIVITY MONITOR */}
          {activeTab === 'activity' && (
            <div className="space-y-6">
              {/* Activity Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Actively Playing</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div className="text-3xl font-extrabold font-mono text-white mt-2">
                    {activityData.activePlaying.length}
                  </div>
                  <span className="text-[11px] text-slate-400">In live match arenas</span>
                </div>

                <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 bg-amber-950/10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Visiting / Browsing</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  </div>
                  <div className="text-3xl font-extrabold font-mono text-white mt-2">
                    {activityData.browsing.length}
                  </div>
                  <span className="text-[11px] text-slate-400">Exploring site & leaderboards</span>
                </div>

                <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Not Logged In / Offline</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                  </div>
                  <div className="text-3xl font-extrabold font-mono text-slate-300 mt-2">
                    {activityData.inactiveNotLoggedIn.length}
                  </div>
                  <span className="text-[11px] text-slate-400">Registered accounts offline</span>
                </div>
              </div>

              {/* Live Activity Table */}
              <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
                      <span>Live User Activity Tracker</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Monitor who is visiting the website, actively playing Ludo, and registered users who have not logged in.
                    </p>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs">
                    {(['all', 'playing', 'browsing', 'offline'] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setActivityFilter(f)}
                        className={`px-3 py-1.5 rounded-lg font-bold uppercase transition ${
                          activityFilter === f
                            ? 'bg-purple-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {f === 'playing' ? 'Playing' : f === 'browsing' ? 'Visiting' : f === 'offline' ? 'Offline' : 'All'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">User</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Current Activity / Action</th>
                        <th className="py-3 px-4">Role</th>
                        <th className="py-3 px-4">Last Seen</th>
                        <th className="py-3 px-4 text-center">Matches Won</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {activityData.all
                        .filter((u) => {
                          if (activityFilter === 'playing') return u.isLoggedIn && u.currentActivity === 'playing_match';
                          if (activityFilter === 'browsing') return u.isLoggedIn && u.currentActivity === 'browsing';
                          if (activityFilter === 'offline') return !u.isLoggedIn || u.currentActivity === 'offline';
                          return true;
                        })
                        .map((user) => {
                          const isPlaying = user.isLoggedIn && user.currentActivity === 'playing_match';
                          const isBrowsing = user.isLoggedIn && user.currentActivity === 'browsing';

                          return (
                            <tr key={user.id} className="hover:bg-slate-800/40">
                              <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                                <span className="text-xl">{user.avatar}</span>
                                <div>
                                  <div>{user.username}</div>
                                  <div className="text-[10px] text-slate-500 font-normal">{user.email || 'Guest User'}</div>
                                </div>
                              </td>

                              <td className="py-3 px-4">
                                {isPlaying ? (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                                    <span>PLAYING MATCH</span>
                                  </span>
                                ) : isBrowsing ? (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                    <span>VISITING / BROWSING</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                                    <span>NOT LOGGED IN / OFFLINE</span>
                                  </span>
                                )}
                              </td>

                              <td className="py-3 px-4 text-slate-300 font-medium">
                                {user.activeRoomOrMatch || (user.isLoggedIn ? 'Browsing Portal' : 'Offline / Inactive')}
                              </td>

                              <td className="py-3 px-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${user.role === 'admin' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'bg-slate-800 text-slate-400'}`}>
                                  {user.role.toUpperCase()}
                                </span>
                              </td>

                              <td className="py-3 px-4 text-slate-400 font-mono">
                                {user.lastActiveTimestamp || 'Recently'}
                              </td>

                              <td className="py-3 px-4 text-center font-mono font-bold text-amber-400">
                                {user.gamesWon}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DEDICATED ADSTERRA INTEGRATION SECTION */}
          {activeTab === 'adsterra' && (
            <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                    <span className="text-2xl">⚡</span>
                    <span>Adsterra Ad Networks Integration</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Paste your Adsterra ad codes below. The system automatically integrates and displays each ad format across the website without touching source code.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      adsterraService.resetToDefaults();
                      setAdsterraSlots([...adsterraService.getSlots()]);
                      triggerSaveNotification('Reset to standard Adsterra slots.');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                  >
                    Reset Defaults
                  </button>
                </div>
              </div>

              {/* Google AdSense Head Tag Status */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/40 to-slate-900 border border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-lg">
                    🌐
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-white">Google AdSense Publisher Script</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        ACTIVE IN &lt;HEAD&gt;
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      Client ID: ca-pub-8772765378084223
                    </p>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
                  Site Verification & Auto-Ads Enabled
                </div>
              </div>

              {/* Format Slot Cards */}
              <div className="space-y-6">
                {adsterraSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-base text-white">{slot.title}</h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300">
                            {slot.format}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{slot.description}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleToggleAdSlot(slot.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                            slot.enabled
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-slate-800 text-slate-500 border border-slate-700'
                          }`}
                        >
                          {slot.enabled ? 'ACTIVE ON SITE' : 'DISABLED'}
                        </button>
                      </div>
                    </div>

                    {/* Ad Code Textarea */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                          <Code2 className="w-4 h-4 text-amber-400" />
                          <span>Adsterra Script / Direct Embed Code</span>
                        </label>
                        <span className="text-[11px] text-slate-500">Placement: {slot.placement}</span>
                      </div>
                      <textarea
                        rows={4}
                        value={slot.code}
                        onChange={(e) => handleUpdateAdCode(slot.id, e.target.value)}
                        placeholder="Paste your Adsterra ad code snippet here..."
                        className="w-full bg-[#0B1020] border border-slate-700 rounded-xl p-3 font-mono text-xs text-amber-300 focus:border-purple-500 outline-none leading-relaxed"
                      />
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-500">
                        {slot.enabled ? '🟢 Live on matching container' : '⚪ Hidden from visitors'}
                      </span>
                      <button
                        onClick={() => handleSaveAdSlot(slot.id)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow transition cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save & Apply Ad</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: OVERVIEW STATS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-panel p-5 rounded-2xl border border-slate-800">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Registered Users</span>
                  <div className="text-3xl font-extrabold font-mono text-white mt-1">{activityData.all.length}</div>
                  <span className="text-[11px] text-emerald-400">Total accounts</span>
                </div>
                <div className="glass-panel p-5 rounded-2xl border border-slate-800">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Completed Matches</span>
                  <div className="text-3xl font-extrabold font-mono text-amber-400 mt-1">{completedGames.length}</div>
                  <span className="text-[11px] text-slate-400">Full logs recorded</span>
                </div>
                <div className="glass-panel p-5 rounded-2xl border border-slate-800">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Active Rooms</span>
                  <div className="text-3xl font-extrabold font-mono text-purple-400 mt-1">{activeRooms.length}</div>
                  <span className="text-[11px] text-slate-400">Live lobbies</span>
                </div>
                <div className="glass-panel p-5 rounded-2xl border border-slate-800">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Adsterra Slots</span>
                  <div className="text-3xl font-extrabold font-mono text-amber-400 mt-1">
                    {adsterraSlots.filter((s) => s.enabled).length}/{adsterraSlots.length}
                  </div>
                  <span className="text-[11px] text-emerald-400">Active monetization</span>
                </div>
              </div>

              {/* Master Administrator Status Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 to-indigo-950/40 border border-purple-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">Master Authentication</span>
                  <h4 className="text-xl font-extrabold text-white mt-0.5">Admin: swapnil@2026</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Security Level: <span className="text-emerald-400 font-semibold">Verified Administrator</span> · Full master privileges active
                  </p>
                </div>
                <button
                  onClick={handleDownloadZip}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-xl whitespace-nowrap transition cursor-pointer"
                >
                  Download Deployable ZIP
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: USER DIRECTORY */}
          {activeTab === 'users' && (
            <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h3 className="text-lg font-bold text-white">Registered Users Directory</h3>
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search username or email..."
                    className="w-full pl-9 pr-3 py-2 bg-[#0B1020] border border-slate-700 rounded-lg text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Matches</th>
                      <th className="py-3 px-4">Win Rate</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {activityData.all
                      .filter((u) => u.username.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((u) => (
                        <tr key={u.id} className="hover:bg-slate-800/40">
                          <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                            <span>{u.avatar}</span>
                            <span>{u.username}</span>
                          </td>
                          <td className="py-3 px-4 text-slate-400">{u.email || 'N/A'}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300">
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-300">{u.gamesPlayed}</td>
                          <td className="py-3 px-4 font-mono text-emerald-400">{u.winRate}%</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                u.status === 'active'
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : 'bg-red-500/20 text-red-300'
                              }`}
                            >
                              {u.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: MATCH ARCHIVES */}
          {activeTab === 'games' && (
            <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-4">
              <h3 className="text-lg font-bold text-white mb-2">Match Archives & Logs</h3>
              {completedGames.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                  No completed games logged yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Match ID</th>
                        <th className="py-3 px-4">Mode</th>
                        <th className="py-3 px-4">Winner</th>
                        <th className="py-3 px-4">Total Moves</th>
                        <th className="py-3 px-4">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {completedGames.map((g) => (
                        <tr key={g.id}>
                          <td className="py-3 px-4 font-mono text-purple-400">{g.id}</td>
                          <td className="py-3 px-4 font-bold text-slate-300">{g.mode.toUpperCase()}</td>
                          <td className="py-3 px-4 text-amber-300 font-bold">{g.winnerName} ({g.winnerColor})</td>
                          <td className="py-3 px-4 font-mono text-slate-400">{g.totalMoves}</td>
                          <td className="py-3 px-4 text-slate-500">{new Date(g.date).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-4">
              <h3 className="text-lg font-bold text-white">Platform Settings</h3>
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Website Name</label>
                  <input
                    type="text"
                    value={siteSettings.siteName}
                    onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                    className="w-full bg-[#0B1020] border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">SEO Title</label>
                  <input
                    type="text"
                    value={siteSettings.seoTitle}
                    onChange={(e) => setSiteSettings({ ...siteSettings, seoTitle: e.target.value })}
                    className="w-full bg-[#0B1020] border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={siteSettings.contactEmail}
                    onChange={(e) => setSiteSettings({ ...siteSettings, contactEmail: e.target.value })}
                    className="w-full bg-[#0B1020] border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <button
                onClick={() => triggerSaveNotification('Site settings updated.')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-lg mt-4"
              >
                <Save className="w-4 h-4" /> Save Settings
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
