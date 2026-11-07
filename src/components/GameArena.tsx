/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  BotDifficulty,
  GameMode,
  Player,
  PlayerColor,
  Token,
  GameMoveRecord,
} from '../types/ludo';
import { COLOR_CONFIG, getTrackIndex, SAFE_TRACK_INDICES } from '../constants/boardGeometry';
import { canTokenMove, chooseBotMove } from '../services/ludoAi';
import { soundService } from '../services/sound';
import { statsService } from '../services/statsService';
import { RoomData } from '../services/roomService';
import { LudoBoard } from './LudoBoard';
import { Dice } from './Dice';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Bot,
  Users,
  Globe,
  Trophy,
  Swords,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

interface GameArenaProps {
  initialMode?: GameMode;
  roomData?: RoomData | null;
  onOpenLeaderboard: () => void;
  onOpenOnlineLobby: () => void;
}

export const GameArena: React.FC<GameArenaProps> = ({
  initialMode = 'vs_bot',
  roomData,
  onOpenLeaderboard,
  onOpenOnlineLobby,
}) => {
  const [mode, setMode] = useState<GameMode>(initialMode);
  const [botDifficulty, setBotDifficulty] = useState<BotDifficulty>('medium');
  const [isMuted, setIsMuted] = useState(soundService.getIsMuted());

  // Game State
  const [players, setPlayers] = useState<Player[]>([]);
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [diceRolled, setDiceRolled] = useState(false);
  const [consecutiveSixes, setConsecutiveSixes] = useState(0);
  const [eligibleTokenIds, setEligibleTokenIds] = useState<number[]>([]);
  const [winner, setWinner] = useState<Player | null>(null);
  const [moveHistory, setMoveHistory] = useState<GameMoveRecord[]>([]);
  const [logMessage, setLogMessage] = useState<string>('Welcome to Ludo Warss! Roll dice to start.');
  const [matchStartTime, setMatchStartTime] = useState<number>(Date.now());

  const botTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Players based on selected Mode
  const initGame = (selectedMode: GameMode, selectedDiff: BotDifficulty = botDifficulty) => {
    if (botTimerRef.current) clearTimeout(botTimerRef.current);

    const currentUser = statsService.getCurrentUser();
    let initialPlayers: Player[] = [];

    const createTokens = (color: PlayerColor): Token[] => [
      { id: 0, color, step: -1, isHome: true, isFinished: false },
      { id: 1, color, step: -1, isHome: true, isFinished: false },
      { id: 2, color, step: -1, isHome: true, isFinished: false },
      { id: 3, color, step: -1, isHome: true, isFinished: false },
    ];

    if (selectedMode === 'vs_bot') {
      initialPlayers = [
        {
          id: currentUser.id,
          name: currentUser.username,
          color: 'red',
          isBot: false,
          isConnected: true,
          avatar: currentUser.avatar,
          tokens: createTokens('red'),
        },
        {
          id: 'bot_green',
          name: 'Viper Bot',
          color: 'green',
          isBot: true,
          botDifficulty: selectedDiff,
          isConnected: true,
          avatar: '🤖',
          tokens: createTokens('green'),
        },
        {
          id: 'bot_yellow',
          name: 'Titan Bot',
          color: 'yellow',
          isBot: true,
          botDifficulty: selectedDiff,
          isConnected: true,
          avatar: '⚡',
          tokens: createTokens('yellow'),
        },
        {
          id: 'bot_blue',
          name: 'Nexus Bot',
          color: 'blue',
          isBot: true,
          botDifficulty: selectedDiff,
          isConnected: true,
          avatar: '🛡️',
          tokens: createTokens('blue'),
        },
      ];
    } else if (selectedMode === 'local') {
      initialPlayers = [
        {
          id: 'local_1',
          name: 'Commander Red',
          color: 'red',
          isBot: false,
          isConnected: true,
          avatar: '🔴',
          tokens: createTokens('red'),
        },
        {
          id: 'local_2',
          name: 'Commander Green',
          color: 'green',
          isBot: false,
          isConnected: true,
          avatar: '🟢',
          tokens: createTokens('green'),
        },
        {
          id: 'local_3',
          name: 'Commander Yellow',
          color: 'yellow',
          isBot: false,
          isConnected: true,
          avatar: '🟡',
          tokens: createTokens('yellow'),
        },
        {
          id: 'local_4',
          name: 'Commander Blue',
          color: 'blue',
          isBot: false,
          isConnected: true,
          avatar: '🔵',
          tokens: createTokens('blue'),
        },
      ];
    } else if (selectedMode === 'online' && roomData) {
      initialPlayers = roomData.players.map((p) => ({
        id: p.id,
        name: p.name,
        color: p.color,
        isBot: p.name.includes('Bot'),
        botDifficulty: 'medium',
        isConnected: true,
        avatar: p.avatar,
        tokens: createTokens(p.color),
      }));
    }

    setPlayers(initialPlayers);
    setActivePlayerIndex(0);
    setDiceValue(null);
    setDiceRolled(false);
    setConsecutiveSixes(0);
    setEligibleTokenIds([]);
    setWinner(null);
    setMoveHistory([]);
    setMatchStartTime(Date.now());
    setLogMessage(`Battle initiated in ${selectedMode.toUpperCase()} mode. Roll the dice!`);
  };

  useEffect(() => {
    initGame(mode, botDifficulty);
    return () => {
      if (botTimerRef.current) clearTimeout(botTimerRef.current);
    };
  }, [mode]);

  const activePlayer = players[activePlayerIndex];

  // Automated Bot Turn Handling
  useEffect(() => {
    if (!activePlayer || winner) return;

    if (activePlayer.isBot) {
      if (!diceRolled && !isRolling) {
        // Bot automatically rolls after 800ms
        botTimerRef.current = setTimeout(() => {
          handleRollDice();
        }, 800);
      } else if (diceRolled && diceValue !== null) {
        // Bot picks token after rolling
        botTimerRef.current = setTimeout(() => {
          if (eligibleTokenIds.length === 0) {
            passTurn();
            return;
          }
          const chosenTokenId = chooseBotMove(
            activePlayer,
            players,
            diceValue,
            activePlayer.botDifficulty || 'medium'
          );
          if (chosenTokenId !== null) {
            handleMoveToken(chosenTokenId);
          } else {
            passTurn();
          }
        }, 900);
      }
    }
  }, [activePlayerIndex, diceRolled, isRolling, winner]);

  // Dice Roll Handler
  const handleRollDice = () => {
    if (isRolling || diceRolled || winner) return;

    setIsRolling(true);
    soundService.playDiceRoll();

    setTimeout(() => {
      const rolled = Math.floor(Math.random() * 6) + 1;
      setDiceValue(rolled);
      setIsRolling(false);
      setDiceRolled(true);

      // Check consecutive sixes
      let newSixes = consecutiveSixes;
      if (rolled === 6) {
        newSixes += 1;
        setConsecutiveSixes(newSixes);
      } else {
        setConsecutiveSixes(0);
      }

      // Three consecutive 6s penalty: cancel turn
      if (newSixes === 3) {
        setLogMessage(`${activePlayer.name} rolled three consecutive 6s! Turn forfeited.`);
        setTimeout(() => {
          setConsecutiveSixes(0);
          passTurn();
        }, 1200);
        return;
      }

      // Calculate legal tokens
      const legalTokens = activePlayer.tokens
        .filter((token) => canTokenMove(token, rolled))
        .map((t) => t.id);

      setEligibleTokenIds(legalTokens);

      if (legalTokens.length === 0) {
        setLogMessage(`${activePlayer.name} rolled a ${rolled}. No legal moves possible.`);
        setTimeout(() => {
          passTurn();
        }, 1200);
      } else {
        setLogMessage(
          `${activePlayer.name} rolled a ${rolled}! Select a token to advance.`
        );
      }
    }, 600);
  };

  // Move Token Handler
  const handleMoveToken = (tokenId: number) => {
    if (!diceRolled || diceValue === null || winner) return;

    const token = activePlayer.tokens.find((t) => t.id === tokenId);
    if (!token || !canTokenMove(token, diceValue)) return;

    let fromStep = token.step;
    let toStep = fromStep;
    let willSpawn = false;

    if (fromStep === -1) {
      toStep = 0; // Exits yard to start position
      willSpawn = true;
      soundService.playTokenSpawn();
    } else {
      toStep = fromStep + diceValue;
      soundService.playTokenStep();
    }

    const isFinished = toStep === 56;
    let capturedOpponent: { color: PlayerColor; tokenId: number } | undefined = undefined;

    // Check Opponent Collision on common track
    const destTrackIndex = getTrackIndex(token.color, toStep);
    if (destTrackIndex !== null && !SAFE_TRACK_INDICES.includes(destTrackIndex)) {
      // Find any opponent token on same cell
      players.forEach((opp) => {
        if (opp.id === activePlayer.id) return;
        opp.tokens.forEach((oppToken) => {
          const oppTrack = getTrackIndex(opp.color, oppToken.step);
          if (oppTrack !== null && oppTrack === destTrackIndex) {
            // Captured! Send back to yard
            oppToken.step = -1;
            oppToken.isHome = true;
            capturedOpponent = { color: opp.color, tokenId: oppToken.id };
            soundService.playTokenCapture();
          }
        });
      });
    } else if (destTrackIndex !== null && SAFE_TRACK_INDICES.includes(destTrackIndex)) {
      soundService.playSafeZone();
    }

    // Update moving token
    token.step = toStep;
    token.isHome = toStep === -1;
    token.isFinished = isFinished;

    // Record Move
    const record: GameMoveRecord = {
      id: 'mv_' + Date.now().toString(36),
      playerColor: activePlayer.color,
      playerName: activePlayer.name,
      diceValue,
      tokenId,
      fromStep,
      toStep,
      capturedOpponent,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMoveHistory((prev) => [record, ...prev.slice(0, 15)]);

    // Check Victory Condition: All 4 tokens at step 56
    const allFinished = activePlayer.tokens.every((t) => t.step === 56);
    if (allFinished) {
      setWinner(activePlayer);
      soundService.playVictory();
      setLogMessage(`🏆 GLORY! ${activePlayer.name} has conquered Ludo Warss!`);
      const durationSeconds = Math.round((Date.now() - matchStartTime) / 1000);
      statsService.recordGameEnd(
        mode,
        activePlayer.name,
        activePlayer.color,
        players.length,
        moveHistory,
        durationSeconds,
        roomData?.roomCode
      );
      return;
    }

    // Check Bonus Roll: Rolled 6, Captured Opponent, or Reached Finish
    const bonusEarned = diceValue === 6 || !!capturedOpponent || isFinished;
    if (bonusEarned) {
      setLogMessage(
        `${activePlayer.name} earned a BONUS ROLL! (${
          diceValue === 6 ? 'Rolled 6' : capturedOpponent ? 'Captured Enemy' : 'Token Home'
        })`
      );
      setDiceValue(null);
      setDiceRolled(false);
      setEligibleTokenIds([]);
    } else {
      passTurn();
    }
  };

  // Turn Progression
  const passTurn = () => {
    setDiceValue(null);
    setDiceRolled(false);
    setEligibleTokenIds([]);
    const nextIndex = (activePlayerIndex + 1) % players.length;
    setActivePlayerIndex(nextIndex);
    const nextPlayer = players[nextIndex];
    setLogMessage(`Turn: ${nextPlayer.name} (${nextPlayer.color.toUpperCase()})`);
  };

  const handleToggleSound = () => {
    const muted = soundService.toggleMute();
    setIsMuted(muted);
  };

  if (!activePlayer) return null;

  return (
    <div className="w-full max-w-7xl mx-auto py-4 sm:py-6 px-2 sm:px-4 flex flex-col gap-5 sm:gap-6">
      {/* Top Status & Controls Header */}
      <div className="glass-panel p-3 sm:p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Row 1: Brand & Status on left, Quick Utilities (Sound + Restart) on right for mobile */}
        <div className="flex items-center justify-between w-full sm:w-auto gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl">👑</span>
            <span className="font-extrabold text-white text-base sm:text-lg tracking-tight">
              LUDO <span className="text-[#F5C76B]">WARSS</span>
            </span>
            <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wide">
              {mode === 'vs_bot' ? 'VS BOT' : mode === 'local' ? 'PASS & PLAY' : 'ONLINE'}
            </span>
          </div>

          {/* Mobile Utilities (Sound + Restart) placed in top row so they never get pushed outside */}
          <div className="flex items-center gap-1.5 sm:hidden">
            <button
              onClick={handleToggleSound}
              aria-label="Toggle Sound"
              className="p-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 transition shrink-0"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
            <button
              onClick={() => initGame(mode)}
              title="Restart Match"
              className="p-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 transition shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mode Selectors + Desktop Utilities */}
        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
          {/* Mode Tabs Grid on Mobile, Flex on Desktop */}
          <div className="grid grid-cols-3 sm:flex items-center gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => setMode('vs_bot')}
              className={`flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition ${
                mode === 'vs_bot'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white bg-slate-900/60'
              }`}
            >
              <Bot className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">vs Computer</span>
            </button>

            <button
              onClick={() => setMode('local')}
              className={`flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition ${
                mode === 'local'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white bg-slate-900/60'
              }`}
            >
              <Users className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Pass & Play</span>
            </button>

            <button
              onClick={onOpenOnlineLobby}
              className="flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold text-amber-300 hover:text-amber-200 bg-amber-500/10 border border-amber-500/30 transition"
            >
              <Globe className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Online Room</span>
            </button>
          </div>

          {/* Desktop Utilities (Sound + Restart) */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              onClick={handleToggleSound}
              aria-label="Toggle Sound"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            <button
              onClick={() => initGame(mode)}
              title="Restart Match"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Board & Command Panel Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* SVG Board Container */}
        <div className="lg:col-span-8 flex flex-col items-center">
          <LudoBoard
            players={players}
            activeColor={activePlayer.color}
            eligibleTokenIds={eligibleTokenIds}
            diceRolled={diceRolled}
            onTokenClick={handleMoveToken}
            winnerColor={winner?.color}
          />
        </div>

        {/* Tactical Control Console */}
        <div className="lg:col-span-4 flex flex-col gap-5 w-full">
          {/* Active Player Card */}
          <div
            className="glass-panel p-5 rounded-2xl border transition-all"
            style={{ borderColor: COLOR_CONFIG[activePlayer.color].border }}
          >
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Active Turn
            </span>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{activePlayer.avatar}</span>
                <div>
                  <h3 className="font-extrabold text-xl text-white">{activePlayer.name}</h3>
                  <span
                    className="text-xs font-bold"
                    style={{ color: COLOR_CONFIG[activePlayer.color].primary }}
                  >
                    {COLOR_CONFIG[activePlayer.color].name} Commander
                  </span>
                </div>
              </div>

              {activePlayer.isBot && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300">
                  AI ({activePlayer.botDifficulty})
                </span>
              )}
            </div>
          </div>

          {/* Dice & Action Center */}
          <div className="glass-panel-elevated p-6 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden">
            <Dice
              value={diceValue}
              isRolling={isRolling}
              disabled={diceRolled || activePlayer.isBot || !!winner}
              activeColor={activePlayer.color}
              onRoll={handleRollDice}
            />

            {/* Combat Status Ticker */}
            <div className="mt-4 p-3 rounded-xl bg-slate-900/90 border border-slate-800 w-full text-xs text-slate-300 font-medium">
              {logMessage}
            </div>

            {/* AI Bot Difficulty Selector (when in vs_bot mode) */}
            {mode === 'vs_bot' && (
              <div className="mt-4 pt-4 border-t border-slate-800 w-full flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-semibold">Bot Strategy:</span>
                <div className="flex gap-1">
                  {(['easy', 'medium', 'hard'] as const).map((diff) => (
                    <button
                      key={diff}
                      onClick={() => {
                        setBotDifficulty(diff);
                        initGame('vs_bot', diff);
                      }}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition ${
                        botDifficulty === diff
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Roster & Token Progress */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
              Fleet Readiness
            </span>

            <div className="space-y-2">
              {players.map((p, idx) => {
                const finishedCount = p.tokens.filter((t) => t.isFinished).length;
                const yardCount = p.tokens.filter((t) => t.step === -1).length;
                const isActive = idx === activePlayerIndex;

                return (
                  <div
                    key={p.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      isActive
                        ? 'bg-[#1E294B] border-purple-500/50 shadow-md'
                        : 'bg-slate-900/40 border-slate-800/80 opacity-80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-3.5 h-3.5 rounded-full"
                        style={{ backgroundColor: COLOR_CONFIG[p.color].primary }}
                      />
                      <span className="font-bold text-xs text-white">{p.name}</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono">
                      <span className="text-slate-400" title="Tokens in Yard">
                        Yard: {yardCount}
                      </span>
                      <span className="text-amber-400 font-bold" title="Tokens Finished">
                        Home: {finishedCount}/4
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Victory Modal */}
      {winner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="glass-panel-elevated p-8 rounded-3xl max-w-md w-full text-center border-2 border-amber-400 relative overflow-hidden shadow-2xl">
            <div className="text-6xl mb-3 animate-bounce">🏆</div>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
              CONQUEROR OF THE REALM
            </span>
            <h3 className="text-3xl font-black text-white mt-1">{winner.name}</h3>
            <p className="text-xs text-slate-300 mt-2">
              All 4 tokens successfully completed their perilous journey to the sanctuary!
            </p>

            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={() => initGame(mode)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl transition"
              >
                Play Another Match
              </button>
              <button
                onClick={onOpenLeaderboard}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm transition"
              >
                View Hall of Fame
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
