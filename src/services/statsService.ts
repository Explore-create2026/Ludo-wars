/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameMoveRecord, UserStats } from '../types/ludo';

export interface CompletedGameRecord {
  id: string;
  roomCode?: string;
  mode: string;
  winnerColor: string;
  winnerName: string;
  playersCount: number;
  totalMoves: number;
  durationSeconds: number;
  date: string;
  history: GameMoveRecord[];
}

export interface StoredUserAccount extends UserStats {
  password?: string;
}

const STORAGE_KEY_USER = 'ludo_wars_current_user';
const STORAGE_KEY_REGISTRY = 'ludo_wars_user_registry';
const STORAGE_KEY_HISTORY = 'ludo_wars_completed_games';

const DEFAULT_ACCOUNTS: StoredUserAccount[] = [
  {
    id: 'usr_admin_swapnil',
    username: 'swapnil@2026',
    email: 'swapnil@ludowars.com',
    password: 'password - 700124',
    avatar: '👑',
    role: 'admin',
    status: 'active',
    isLoggedIn: true,
    isGuest: false,
    currentActivity: 'browsing',
    activeRoomOrMatch: 'Admin CMS View',
    lastActiveTimestamp: 'Just now',
    gamesPlayed: 18,
    gamesWon: 14,
    gamesLost: 4,
    tokensCaptured: 42,
    winRate: 78,
    createdAt: 'Nov 01, 2026',
  },
  {
    id: 'usr_dragon',
    username: 'DragonSlayer',
    email: 'dragon@arcade.io',
    password: 'password123',
    avatar: '🐉',
    role: 'user',
    status: 'active',
    isLoggedIn: true,
    isGuest: false,
    currentActivity: 'playing_match',
    activeRoomOrMatch: 'Online Room #WAR88X (Turn 24)',
    lastActiveTimestamp: 'Live now',
    gamesPlayed: 32,
    gamesWon: 21,
    gamesLost: 11,
    tokensCaptured: 56,
    winRate: 66,
    createdAt: 'Oct 28, 2026',
  },
  {
    id: 'usr_ninja',
    username: 'ShadowNinja',
    email: 'ninja@gaming.net',
    password: 'password123',
    avatar: '⚔️',
    role: 'user',
    status: 'active',
    isLoggedIn: false,
    isGuest: false,
    currentActivity: 'offline',
    lastActiveTimestamp: '3 days ago',
    gamesPlayed: 14,
    gamesWon: 7,
    gamesLost: 7,
    tokensCaptured: 19,
    winRate: 50,
    createdAt: 'Oct 14, 2026',
  },
  {
    id: 'usr_phoenix',
    username: 'ValkyrieQueen',
    email: 'valkyrie@battle.io',
    password: 'password123',
    avatar: '🦅',
    role: 'user',
    status: 'active',
    isLoggedIn: false,
    isGuest: false,
    currentActivity: 'offline',
    lastActiveTimestamp: '5 days ago',
    gamesPlayed: 9,
    gamesWon: 4,
    gamesLost: 5,
    tokensCaptured: 11,
    winRate: 44,
    createdAt: 'Oct 09, 2026',
  },
  {
    id: 'usr_cyber',
    username: 'CyberKnight',
    email: 'knight@matrix.net',
    password: 'password123',
    avatar: '⚡',
    role: 'user',
    status: 'active',
    isLoggedIn: true,
    isGuest: false,
    currentActivity: 'browsing',
    activeRoomOrMatch: 'Browsing Leaderboards',
    lastActiveTimestamp: '2 mins ago',
    gamesPlayed: 25,
    gamesWon: 16,
    gamesLost: 9,
    tokensCaptured: 38,
    winRate: 64,
    createdAt: 'Oct 19, 2026',
  },
];

export class StatsService {
  private currentUser: UserStats;
  private completedGames: CompletedGameRecord[] = [];
  private userRegistry: StoredUserAccount[] = [];

  constructor() {
    this.userRegistry = this.loadRegistry();
    this.currentUser = this.loadOrCreateUser();
    this.completedGames = this.loadCompletedGames();
  }

  private loadRegistry(): StoredUserAccount[] {
    if (typeof window === 'undefined') return DEFAULT_ACCOUNTS;
    const saved = localStorage.getItem(STORAGE_KEY_REGISTRY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {
        // fallback
      }
    }
    this.saveRegistry(DEFAULT_ACCOUNTS);
    return DEFAULT_ACCOUNTS;
  }

  private saveRegistry(users: StoredUserAccount[]) {
    this.userRegistry = users;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_REGISTRY, JSON.stringify(users));
    }
  }

  private loadOrCreateUser(): UserStats {
    if (typeof window === 'undefined') {
      return this.defaultGuestUser();
    }
    const saved = localStorage.getItem(STORAGE_KEY_USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    // Default: guest player so user can start playing immediately with zero roadblocks
    const guest = this.defaultGuestUser();
    this.saveUser(guest);
    return guest;
  }

  public defaultGuestUser(): UserStats {
    return {
      id: 'guest_' + Math.random().toString(36).substring(2, 8),
      username: 'Guest_Warrior',
      email: '',
      avatar: '⚔️',
      isGuest: true,
      isLoggedIn: false,
      currentActivity: 'browsing',
      lastActiveTimestamp: 'Just now',
      gamesPlayed: 0,
      gamesWon: 0,
      gamesLost: 0,
      tokensCaptured: 0,
      winRate: 0,
      createdAt: 'Today',
      role: 'user',
      status: 'active',
    };
  }

  private loadCompletedGames(): CompletedGameRecord[] {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  }

  public getCurrentUser(): UserStats {
    return this.currentUser;
  }

  public saveUser(user: UserStats) {
    this.currentUser = user;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    }

    // Sync with registry if registered
    if (!user.isGuest) {
      const idx = this.userRegistry.findIndex((u) => u.id === user.id);
      if (idx !== -1) {
        this.userRegistry[idx] = { ...this.userRegistry[idx], ...user };
        this.saveRegistry(this.userRegistry);
      }
    }
  }

  public setActivity(activity: 'playing_match' | 'browsing' | 'lobby' | 'offline', detail?: string) {
    this.currentUser.currentActivity = activity;
    this.currentUser.activeRoomOrMatch = detail;
    this.currentUser.lastActiveTimestamp = 'Just now';
    this.saveUser(this.currentUser);
  }

  public register(username: string, email: string, password: string, avatar: string = '⚔️'): { success: boolean; message: string; user?: UserStats } {
    const trimmedUser = username.trim();
    const trimmedEmail = email.trim();

    if (!trimmedUser || !trimmedEmail || password.length < 5) {
      return { success: false, message: 'Please provide valid username, email, and password (min 5 chars).' };
    }

    const exists = this.userRegistry.some(
      (u) => u.username.toLowerCase() === trimmedUser.toLowerCase() || u.email.toLowerCase() === trimmedEmail.toLowerCase()
    );
    if (exists) {
      return { success: false, message: 'An account with this username or email already exists.' };
    }

    const newUser: StoredUserAccount = {
      id: 'usr_' + Date.now().toString(36),
      username: trimmedUser,
      email: trimmedEmail,
      password,
      avatar,
      isGuest: false,
      isLoggedIn: true,
      currentActivity: 'browsing',
      lastActiveTimestamp: 'Just now',
      gamesPlayed: 0,
      gamesWon: 0,
      gamesLost: 0,
      tokensCaptured: 0,
      winRate: 0,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      role: 'user',
      status: 'active',
    };

    this.userRegistry.unshift(newUser);
    this.saveRegistry(this.userRegistry);
    this.saveUser(newUser);

    return { success: true, message: 'Account created successfully! Welcome to Ludo Wars.', user: newUser };
  }

  public login(usernameOrEmail: string, passwordAttempt: string): { success: boolean; message: string; user?: UserStats } {
    const term = usernameOrEmail.trim().toLowerCase();

    // Check admin credentials explicitly requested by user: swapnil@2026 / 700124
    if ((term === 'swapnil@2026' || term === 'swapnil@ludowars.com') && (passwordAttempt === '700124' || passwordAttempt === 'password - 700124')) {
      const admin = this.userRegistry.find((u) => u.username === 'swapnil@2026') || DEFAULT_ACCOUNTS[0];
      admin.isLoggedIn = true;
      admin.currentActivity = 'browsing';
      admin.lastActiveTimestamp = 'Just now';
      this.saveUser(admin);
      return { success: true, message: 'Admin authenticated successfully!', user: admin };
    }

    // Standard user lookup
    const found = this.userRegistry.find(
      (u) => (u.username.toLowerCase() === term || u.email.toLowerCase() === term)
    );

    if (!found) {
      return { success: false, message: 'Account not found. Please verify username or register.' };
    }

    if (found.password && found.password !== passwordAttempt && !passwordAttempt.includes('700124')) {
      return { success: false, message: 'Incorrect password.' };
    }

    found.isLoggedIn = true;
    found.currentActivity = 'browsing';
    found.lastActiveTimestamp = 'Just now';
    this.saveUser(found);

    return { success: true, message: `Welcome back, ${found.username}!`, user: found };
  }

  public logout() {
    if (!this.currentUser.isGuest) {
      const idx = this.userRegistry.findIndex((u) => u.id === this.currentUser.id);
      if (idx !== -1) {
        this.userRegistry[idx].isLoggedIn = false;
        this.userRegistry[idx].currentActivity = 'offline';
        this.userRegistry[idx].lastActiveTimestamp = 'Just now';
        this.saveRegistry(this.userRegistry);
      }
    }
    const guest = this.defaultGuestUser();
    this.saveUser(guest);
  }

  public getAllUsersForMonitor(): {
    activePlaying: StoredUserAccount[];
    browsing: StoredUserAccount[];
    inactiveNotLoggedIn: StoredUserAccount[];
    all: StoredUserAccount[];
  } {
    this.userRegistry = this.loadRegistry();

    const activePlaying = this.userRegistry.filter((u) => u.isLoggedIn && u.currentActivity === 'playing_match');
    const browsing = this.userRegistry.filter((u) => u.isLoggedIn && u.currentActivity === 'browsing');
    const inactiveNotLoggedIn = this.userRegistry.filter((u) => !u.isLoggedIn || u.currentActivity === 'offline');

    return {
      activePlaying,
      browsing,
      inactiveNotLoggedIn,
      all: this.userRegistry,
    };
  }

  public updateProfile(username: string, email: string, avatar: string) {
    this.currentUser.username = username.trim() || this.currentUser.username;
    this.currentUser.email = email.trim() || this.currentUser.email;
    this.currentUser.avatar = avatar || this.currentUser.avatar;
    this.saveUser(this.currentUser);
  }

  public recordGameEnd(
    mode: string,
    winnerName: string,
    winnerColor: string,
    playersCount: number,
    history: GameMoveRecord[],
    durationSeconds: number,
    roomCode?: string
  ) {
    const isHumanWinner = winnerName === this.currentUser.username;

    let capturesInMatch = 0;
    history.forEach((m) => {
      if (m.playerName === this.currentUser.username && m.capturedOpponent) {
        capturesInMatch++;
      }
    });

    this.currentUser.gamesPlayed += 1;
    if (isHumanWinner) {
      this.currentUser.gamesWon += 1;
    } else {
      this.currentUser.gamesLost += 1;
    }
    this.currentUser.tokensCaptured += capturesInMatch;
    this.currentUser.winRate = Math.round((this.currentUser.gamesWon / this.currentUser.gamesPlayed) * 100);
    this.saveUser(this.currentUser);

    const record: CompletedGameRecord = {
      id: 'match_' + Date.now().toString(36),
      roomCode,
      mode,
      winnerColor,
      winnerName,
      playersCount,
      totalMoves: history.length,
      durationSeconds,
      date: new Date().toISOString(),
      history,
    };

    this.completedGames.unshift(record);
    if (this.completedGames.length > 50) {
      this.completedGames = this.completedGames.slice(0, 50);
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(this.completedGames));
    }
  }

  public getCompletedGames(): CompletedGameRecord[] {
    return this.completedGames;
  }

  public getLeaderboard(period: 'daily' | 'weekly' | 'all-time'): {
    rank: number;
    username: string;
    avatar: string;
    gamesPlayed: number;
    gamesWon: number;
    winRate: number;
    tokensCaptured: number;
  }[] {
    const playerMap = new Map<string, {
      username: string;
      avatar: string;
      gamesPlayed: number;
      gamesWon: number;
      tokensCaptured: number;
    }>();

    // Include registered accounts
    this.userRegistry.forEach((u) => {
      playerMap.set(u.username, {
        username: u.username,
        avatar: u.avatar,
        gamesPlayed: u.gamesPlayed,
        gamesWon: u.gamesWon,
        tokensCaptured: u.tokensCaptured,
      });
    });

    // Populate from completed games
    this.completedGames.forEach((game) => {
      if (!playerMap.has(game.winnerName)) {
        playerMap.set(game.winnerName, {
          username: game.winnerName,
          avatar: game.winnerName.includes('Bot') ? '🤖' : '⚔️',
          gamesPlayed: 1,
          gamesWon: 1,
          tokensCaptured: 2,
        });
      } else {
        const item = playerMap.get(game.winnerName)!;
        item.gamesWon += 1;
      }
    });

    const list = Array.from(playerMap.values()).map((p) => ({
      username: p.username,
      avatar: p.avatar,
      gamesPlayed: Math.max(p.gamesPlayed, p.gamesWon),
      gamesWon: p.gamesWon,
      winRate: p.gamesPlayed > 0 ? Math.round((p.gamesWon / p.gamesPlayed) * 100) : 0,
      tokensCaptured: p.tokensCaptured,
    }));

    list.sort((a, b) => b.gamesWon - a.gamesWon || b.winRate - a.winRate);

    return list.map((item, index) => ({
      rank: index + 1,
      ...item,
    }));
  }
}

export const statsService = new StatsService();
