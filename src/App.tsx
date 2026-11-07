/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameMode } from './types/ludo';
import { RoomData } from './services/roomService';
import { statsService } from './services/statsService';
import { GameArena } from './components/GameArena';
import { LeaderboardView } from './components/LeaderboardView';
import { AdminPanel } from './components/AdminPanel';
import { UserProfileModal } from './components/UserProfileModal';
import { AuthModal } from './components/AuthModal';
import { OnlineLobbyModal } from './components/OnlineLobbyModal';
import { RulesGuideModal } from './components/RulesGuideModal';
import { LegalModal, LegalDocType } from './components/LegalModal';
import { PhpDeployModal } from './components/PhpDeployModal';
import { AdsterraAdBanner } from './components/AdsterraAdBanner';
import { downloadPhpPackage } from './services/phpPackageGenerator';
import {
  Trophy,
  Swords,
  Bot,
  Users,
  Globe,
  BookOpen,
  FolderArchive,
  Download,
  HelpCircle,
  Shield,
  ShieldCheck,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';

export default function App() {
  const [view, setView] = useState<'home' | 'game' | 'leaderboard' | 'admin'>('home');
  const [gameMode, setGameMode] = useState<GameMode>('vs_bot');
  const [onlineRoom, setOnlineRoom] = useState<RoomData | null>(null);

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLobbyOpen, setIsLobbyOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isDeployOpen, setIsDeployOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<LegalDocType | null>(null);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const [currentUser, setCurrentUser] = useState(statsService.getCurrentUser());

  const handleStartGame = (mode: GameMode, room?: RoomData) => {
    setGameMode(mode);
    setOnlineRoom(room || null);
    setView('game');
    statsService.setActivity('playing_match', `Mode: ${mode.toUpperCase()}`);
    setCurrentUser(statsService.getCurrentUser());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUserAuthSuccess = (user: typeof currentUser) => {
    setCurrentUser(user);
  };

  if (view === 'admin') {
    return <AdminPanel onBackToGame={() => {
      setView('home');
      statsService.setActivity('browsing', 'Homepage');
      setCurrentUser(statsService.getCurrentUser());
    }} />;
  }

  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* 1. TOP BAR CONTRACT */}
      <header className="sticky top-0 z-40 bg-[#0B1020]/90 backdrop-blur-md border-b border-slate-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => {
              setView('home');
              statsService.setActivity('browsing', 'Homepage');
            }}
            className="text-xl font-black tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <span className="text-2xl">👑</span>
            <span>LUDO <span className="text-[#F5C76B]">WARSS</span></span>
          </button>

          {/* Zone 2: Single-Line Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <button
              onClick={() => {
                setView('home');
                statsService.setActivity('browsing', 'Game Modes');
                const el = document.getElementById('play-modes');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-white transition whitespace-nowrap shrink-0"
            >
              Game Modes
            </button>
            <button
              onClick={() => {
                setView('leaderboard');
                statsService.setActivity('browsing', 'Leaderboards');
              }}
              className={`hover:text-white transition whitespace-nowrap shrink-0 ${view === 'leaderboard' ? 'text-amber-400 font-bold' : ''}`}
            >
              Leaderboards
            </button>
            <button
              onClick={() => setIsRulesOpen(true)}
              className="hover:text-white transition whitespace-nowrap shrink-0"
            >
              How to Play
            </button>
            <button
              onClick={() => setIsDeployOpen(true)}
              className="text-[#F5C76B] hover:text-amber-300 transition whitespace-nowrap shrink-0"
            >
              Hosting Setup
            </button>
            <button
              onClick={() => {
                setView('admin');
                statsService.setActivity('browsing', 'Admin CMS');
              }}
              className="hover:text-purple-400 transition whitespace-nowrap shrink-0"
            >
              Admin CMS
            </button>
          </nav>

          {/* Zone 3: Primary Action & Profile */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsDeployOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-[#F5C76B] border border-amber-500/30 text-xs font-bold transition whitespace-nowrap"
            >
              <FolderArchive className="w-3.5 h-3.5" />
              <span>Download ZIP</span>
            </button>

            {currentUser.isGuest ? (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow transition cursor-pointer"
                title="Sign In or Register (Optional)"
              >
                <span>Sign In</span>
              </button>
            ) : (
              <button
                onClick={() => setIsProfileOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-purple-500 transition cursor-pointer"
                title="View Player Profile"
              >
                <span className="text-lg">{currentUser.avatar}</span>
                <span className="text-xs font-bold text-white hidden sm:inline max-w-[100px] truncate">
                  {currentUser.username}
                </span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. BODY CONTENT ROUTING */}
      <main className="flex-1 w-full">
        {view === 'game' ? (
          <GameArena
            initialMode={gameMode}
            roomData={onlineRoom}
            onOpenLeaderboard={() => setView('leaderboard')}
            onOpenOnlineLobby={() => setIsLobbyOpen(true)}
          />
        ) : view === 'leaderboard' ? (
          <div className="py-6">
            <div className="max-w-5xl mx-auto px-4 mb-4">
              <button
                onClick={() => setView('home')}
                className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1"
              >
                ← Back to Arena
              </button>
            </div>
            <LeaderboardView />
          </div>
        ) : (
          /* HOMEPAGE VIEW */
          <div className="space-y-16 pb-20">
            {/* Adsterra Top Leaderboard Banner (728x90) */}
            <div className="max-w-7xl mx-auto px-4 pt-4">
              <AdsterraAdBanner slotId="adst_header_728x90" fallbackFormat="728x90" />
            </div>

            {/* HERO SECTION */}
            <section className="relative overflow-hidden pt-4 md:pt-10 px-4">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold">
                    <span>👑 Standard International Tournament Ludo Rules</span>
                  </div>

                  <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1] text-balance">
                    Your Next Move. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5C76B] via-amber-300 to-purple-400">
                      Your Victory.
                    </span>
                  </h1>

                  <p className="text-slate-300 text-base md:text-lg max-w-xl leading-relaxed">
                    Battle in authentic 4-player Ludo with adaptive AI bots, pass-and-play couch multiplayer, and seamless private room lobbies. Free to play, zero paywalls.
                  </p>

                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                    <button
                      onClick={() => handleStartGame('vs_bot')}
                      className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm shadow-xl shadow-purple-600/30 hover:scale-105 transition transform cursor-pointer flex items-center gap-2"
                    >
                      <Swords className="w-4 h-4" />
                      <span>Play Now Against AI</span>
                    </button>

                    <button
                      onClick={() => setIsDeployOpen(true)}
                      className="px-6 py-4 rounded-xl bg-[#1E294B] hover:bg-slate-800 text-amber-300 border border-amber-500/40 font-bold text-sm shadow transition flex items-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Deployable PHP ZIP</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-400 pt-4">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>100% Free-to-play</span>
                    </div>
                    <span>·</span>
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-purple-400" />
                      <span>PHP 8.2+ & MySQL</span>
                    </div>
                    <span>·</span>
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span>Web Installer Ready</span>
                    </div>
                  </div>
                </div>

                {/* Hero Showcase Visual */}
                <div className="lg:col-span-5 flex justify-center">
                  <div className="relative w-full max-w-[420px] aspect-square rounded-3xl p-4 bg-gradient-to-br from-[#1E294B]/90 to-[#131B30]/90 border border-purple-500/30 shadow-2xl flex flex-col items-center justify-center text-center">
                    <div className="grid grid-cols-2 gap-4 w-full h-full p-4 place-items-center">
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-red-500 to-red-800 p-3 shadow-xl flex flex-col items-center justify-center text-white font-bold text-xs">
                        <span className="text-3xl mb-1">🔴</span> Red Base
                      </div>
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-green-500 to-green-800 p-3 shadow-xl flex flex-col items-center justify-center text-white font-bold text-xs">
                        <span className="text-3xl mb-1">🟢</span> Green Base
                      </div>
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-yellow-500 to-yellow-800 p-3 shadow-xl flex flex-col items-center justify-center text-white font-bold text-xs">
                        <span className="text-3xl mb-1">🟡</span> Yellow Base
                      </div>
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-800 p-3 shadow-xl flex flex-col items-center justify-center text-white font-bold text-xs">
                        <span className="text-3xl mb-1">🔵</span> Blue Base
                      </div>
                    </div>

                    <div className="absolute inset-0 m-auto w-24 h-24 rounded-full bg-[#0B1020] border-4 border-[#F5C76B] flex items-center justify-center text-4xl shadow-2xl">
                      🎲
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* THREE GAME MODES CARDS */}
            <section id="play-modes" className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-10">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Battle Arenas</span>
                <h2 className="text-3xl font-extrabold text-white mt-1">Select Your Arena Mode</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Play with Computer */}
                <div className="glass-panel p-8 rounded-2xl border border-slate-800 hover:border-purple-500 transition group flex flex-col justify-between">
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition">
                      <Bot className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Play with Computer</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Compete against 1 to 3 computer-controlled AI bots featuring Easy, Medium, and Hard tactical heuristics that hunt down opponent tokens.
                    </p>
                  </div>
                  <button
                    onClick={() => handleStartGame('vs_bot')}
                    className="mt-6 w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Launch AI Match</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 2. Local Multiplayer */}
                <div className="glass-panel p-8 rounded-2xl border border-slate-800 hover:border-amber-500 transition group flex flex-col justify-between">
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-amber-600/20 text-amber-400 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition">
                      <Users className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Local Pass & Play</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Gather 2 to 4 friends on the same desktop, tablet, or phone. Turn-based pass-and-play with zero internet required once loaded.
                    </p>
                  </div>
                  <button
                    onClick={() => handleStartGame('local')}
                    className="mt-6 w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Start Pass & Play</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 3. Online Multiplayer */}
                <div className="glass-panel p-8 rounded-2xl border border-slate-800 hover:border-blue-500 transition group flex flex-col justify-between">
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition">
                      <Globe className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Online Multiplayer</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Host private matches with unique 6-digit room codes. Built for shared hosting via server-validated AJAX polling architecture.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsLobbyOpen(true)}
                    className="mt-6 w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Open Room Lobby</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </section>

            {/* HOW TO PLAY SECTION */}
            <section className="max-w-7xl mx-auto px-4">
              <div className="p-8 md:p-12 rounded-3xl glass-panel-elevated border border-purple-500/30">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Rulebook</span>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
                      How to Play Ludo Warss
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsRulesOpen(true)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-2 self-start"
                  >
                    <BookOpen className="w-4 h-4 text-purple-400" />
                    <span>View Complete Rulebook</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <span className="text-amber-400 font-mono font-bold text-sm">01. Roll a Six</span>
                    <h4 className="font-bold text-white text-sm">Deploy From Base</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Tokens are locked in your corner yard until you roll a 6 to deploy them onto your colored start cell.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-purple-400 font-mono font-bold text-sm">02. Clockwise Circuit</span>
                    <h4 className="font-bold text-white text-sm">Traverse 52 Cells</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Advance tokens along the 52 perimeter cells according to dice rolls, dodging enemy ambushes.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-red-400 font-mono font-bold text-sm">03. Strike & Capture</span>
                    <h4 className="font-bold text-white text-sm">Send Foes Home</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Landing on an opponent's token banishes them to their yard and rewards you with an instant bonus roll.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-emerald-400 font-mono font-bold text-sm">04. Enter Sanctuary</span>
                    <h4 className="font-bold text-white text-sm">Exact Roll Victory</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Navigate the home corridor into the victory center. The first commander to bring 4 tokens home wins!
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Adsterra Mid-Page Unit */}
            <div className="max-w-4xl mx-auto px-4 flex justify-center">
              <AdsterraAdBanner slotId="adst_mid_300x250" fallbackFormat="300x250" />
            </div>

            {/* FAQ SECTION */}
            <section className="max-w-4xl mx-auto px-4">
              <div className="text-center mb-8">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Questions & Answers</span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-1">Frequently Asked Questions</h2>
              </div>

              <div className="space-y-3">
                {[
                  {
                    q: 'Is Ludo Warss really 100% free with no gambling?',
                    a: 'Yes. Ludo Warss strictly prohibits betting, wagering, or real-money gaming. It is engineered entirely for casual and competitive entertainment.',
                  },
                  {
                    q: 'How do I deploy this to my netlify or cPanel shared hosting?',
                    a: 'Simply click "Download ZIP" to download premium-ludo-netlify.zip, upload it to your public_html, extract it, and visit https://yourdomain.com/install/ to run the automatic web installer wizard.',
                  },
                  {
                    q: 'How does website monetization work?',
                    a: 'Ludo Warss integrates official Adsterra ad placements (including 728x90 Header, 300x250 Content, Footer Banner, and Social Bar), which can be managed directly in the Admin Panel without touching source code.',
                  },
                  {
                    q: 'Can guest players play without registration?',
                    a: 'Absolutely. Guest players can play offline against bots or locally with friends immediately without creating an account.',
                  },
                ].map((item, idx) => {
                  const isOpen = faqOpen === idx;
                  return (
                    <div
                      key={idx}
                      className="glass-panel rounded-xl border border-slate-800 overflow-hidden"
                    >
                      <button
                        onClick={() => setFaqOpen(isOpen ? null : idx)}
                        className="w-full p-4 text-left flex items-center justify-between text-sm font-bold text-white hover:text-purple-300 transition"
                      >
                        <span>{item.q}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* 2.5 NON-INTRUSIVE ADSTERRA FOOTER REVENUE BANNER */}
      <div className="w-full max-w-7xl mx-auto px-4 py-3 flex justify-center">
        <AdsterraAdBanner slotId="adst_footer_banner" fallbackFormat="footer" />
      </div>

      {/* 3. FOOTER */}
      <footer className="border-t border-slate-800/80 bg-[#0B1020] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👑</span>
            <div>
              <span className="font-extrabold text-white text-base">LUDO <span className="text-[#F5C76B]">WARSS</span></span>
              <p className="text-xs text-slate-500">Premium Online & Offline Ludo Gaming Platform</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <button onClick={() => setLegalModalType('about')} className="hover:text-white transition">About Us</button>
            <button onClick={() => setLegalModalType('contact')} className="hover:text-white transition">Contact Us</button>
            <button onClick={() => setLegalModalType('privacy')} className="hover:text-white transition">Privacy Policy</button>
            <button onClick={() => setLegalModalType('terms')} className="hover:text-white transition">Terms & Conditions</button>
            <button onClick={() => setLegalModalType('cookies')} className="hover:text-white transition">Cookie Policy</button>
            <button onClick={() => setIsDeployOpen(true)} className="text-amber-400 hover:text-amber-300 font-bold transition">Deployable ZIP</button>
          </div>

          <div className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} Ludo Warss. All rights reserved.
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleUserAuthSuccess}
      />

      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      <OnlineLobbyModal
        isOpen={isLobbyOpen}
        onClose={() => setIsLobbyOpen(false)}
        onStartMatch={(room) => handleStartGame('online', room)}
      />

      <RulesGuideModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      <PhpDeployModal
        isOpen={isDeployOpen}
        onClose={() => setIsDeployOpen(false)}
      />

      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />
    </div>
  );
}
