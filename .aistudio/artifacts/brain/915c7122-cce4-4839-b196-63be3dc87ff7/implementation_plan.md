# Ludo Wars — Premium Ludo Gaming Platform & Deployable PHP Package

Ludo Wars is a complete, production-grade Ludo gaming platform featuring an interactive SVG game engine with classic rules, smart computer bots, local pass-and-play, online multiplayer room architecture, synthesized Web Audio effects, player dashboards, leaderboards, AdSense management, and an admin CMS—accompanied by a fully standalone, downloadable PHP 8.2+ / MySQL package (`premium-ludo-netlify.zip`) with an automated graphical web installer ready for direct deployment on shared hosting (hPanel/cPanel).

## User Review & Critical Decisions

> [!IMPORTANT]
> Based on your answers to the clarification questions, the platform will be structured as follows:
> - **Interactive Live Preview + Deployable PHP Package**: The browser preview will be fully playable and interactive with full game logic, room lobbies, bots, sound effects, stats, and an admin panel, while also building and bundling the entire standalone PHP 8.2 / MySQL application into `premium-ludo-netlify.zip` with an instant 1-click download button.
> - **Audio Experience**: Dynamic Web Audio sound synthesis for realistic dice rolling clicks, rhythmic token hop steps, opponent capture crunch, safe star chimes, and victory fanfare (with instant mute toggle).
> - **Classic Ludo Rules**: Authentic 15×15 coordinate board system requiring a roll of 6 to enter the board, bonus turns on rolling 6 or capturing an opponent, safe zones (starting squares and star cells), home entrance lanes, and exact dice rolls to reach the central victory triangle.

- **Confirmed Decision 1**: Dual delivery: full interactive playable experience in the web runtime + standalone production PHP/MySQL package with graphical installer for shared hosting.
- **Confirmed Decision 2**: Web Audio API oscillator synthesis avoids missing sound file 404s and external latency while providing crisp audio feedback.
- **Confirmed Decision 3**: Strict 15×15 grid board geometry matching international Ludo tournament specifications (Red: bottom-left, Green: top-left, Yellow: top-right, Blue: bottom-right).

---

## 1. Overview & Core Concept

- **What It Does**: A comprehensive Ludo gaming portal offering three complete game modes (Play vs Intelligent AI with 3 difficulty tiers, Local Pass & Play for 2–4 players, and Online Multiplayer Rooms with server-side validation logic), detailed player profiles and match analytics, competitive leaderboards (Daily, Weekly, All-Time), an Admin Control Panel for user and ad management, Google AdSense compliant ad slot placeholders, and an automated deployment pipeline generating `premium-ludo-netlify.zip`.
- **Target Audience**: Casual board game players, friends and families playing locally or across devices, and website operators looking to deploy a turnkey monetization-ready gaming site on shared hosting without technical hassle.
- **Key Value**: Delivers both immediate playable gratification in the preview and a plug-and-play PHP 8.2 / MySQL production zip with a zero-code web installer.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Homepage & Navigation**: Hero showcase with animated dice and 3D token badges, quick play cards for "Play vs Computer", "Pass & Play", and "Online Multiplayer", real-time leaderboard previews, feature highlights, "How to Play" interactive rules guide, and prominent Download PHP Package CTA.
2. **Game Board Experience**:
   - Clean 15×15 SVG board with high-contrast player tracks (Red, Green, Yellow, Blue), safe stars, home columns, and center triangle.
   - Interactive 3D CSS dice with rolling animations, pip rendering, turn indicators, and valid token glow rings.
   - Auto-bot turns with configurable difficulty (Easy: random legal, Medium: balanced, Hard: aggressive capture & home rushing).
   - Pass & Play turn switcher displaying active player avatar and score.
   - Online room lobby: generate room codes, wait for opponents, copy shareable room invite links, and sync state.
3. **Player Hub & Stats**: Win/Loss ratio, total games, tokens captured, streaks, and match history with real-time recalculation.
4. **Admin Dashboard**: Secure control panel to inspect active/finished matches, toggle AdSense units, view platform metrics, manage user accounts, and customize site settings.
5. **Download & Web Installer**: Dedicated package modal and installer simulator demonstrating the 4-step shared hosting setup (server requirement verification, PDO database connection, automatic schema migration, and admin creation).

### Visual Identity & Theme
- **Color Palette**:
  - Dominant Canvas (60%): `#0B1020` (Obsidian Navy) and `#131B30` (Midnight Slate).
  - Structural Surfaces (30%): `#1E294B` with subtle glassmorphic borders (`rgba(255,255,255,0.08)`).
  - Player Tokens & Tracks: Red (`#EF4444`), Green (`#22C55E`), Yellow (`#FACC15`), Blue (`#3B82F6`).
  - Accent Budget (10%): Royal Purple (`#8B5CF6`) and Golden Champion (`#F5C76B`).
- **Typography**: `Outfit` / `Plus Jakarta Sans` for geometric display headings, clean body text for rules and statistics, and tabular monospace numerals (`tabular-nums`) for scores, timers, and coordinates.
- **Micro-Interactions**: Smooth 180ms CSS compositor transitions for token movement hops, rolling 3D dice rotation, and gentle sound pulses.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: SVG Coordinate System vs Canvas or Divs**
  - *Chosen Approach*: Pure SVG 1500×1500 viewport mapped to standard 15×15 grid (100×100 per cell).
  - *Why*: SVG offers crisp scaling across mobile phones and 4K desktop screens, native DOM click targeting on tokens, and seamless CSS drop-shadow/glow animation styling.
  - *Alternatives Considered*: Canvas 2D is harder to make accessible and responsive; pure CSS divs require brittle nested percentages.
- **Decision 2: Web Audio API Synthesis vs External Audio Assets**
  - *Chosen Approach*: Programmatic Web Audio API synthesizers for dice shakes, clicks, hops, captures, and victory chimes.
  - *Why*: Zero external network dependencies, no broken audio file links, instant playback without buffering, and zero lag on mobile browsers.
- **Decision 3: Dual-Mode Architecture (Client Engine + PHP Shared Hosting Engine)**
  - *Chosen Approach*: The client app contains a self-contained Ludo engine with full offline and online simulation, while a dedicated script builds `premium-ludo-netlify.zip` containing the full PHP 8.2 backend, PDO database migrations, REST API endpoints, web installer, and documentation.
  - *Why*: Allows the client to test and play immediately in AI Studio while satisfying all deployment requirements for cPanel/hPanel shared hosting.

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        LUDO WARS ARCHITECTURE                          │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌────────────────────────┐      ┌──────────────────────────────────┐  │
│  │   Interactive Frontend │      │   Standalone PHP 8.2+ Package    │  │
│  │   (React 19 + Tailwind)│      │   (Deployable ZIP for cPanel)    │  │
│  ├────────────────────────┤      ├──────────────────────────────────┤  │
│  │ • 15x15 SVG Game Board │      │ • /install (Web Setup Wizard)    │  │
│  │ • Ludo Rule Engine     │      │ • /app/Controllers & Models      │  │
│  │ • AI Bot Strategic AI  │      │ • /app/Config/database.php (PDO) │  │
│  │ • Pass & Play Engine   │      │ • /database/schema.sql (InnoDB)  │  │
│  │ • Web Audio Synthesizer│      │ • /public (SVG board + Vanilla JS│  │
│  │ • Admin & Ads Console  │      │ • .htaccess (Security & Gzip)    │  │
│  │ • ZIP Generator Module │      │ • premium-ludo-netlify.zip       │  │
│  └───────────┬────────────┘      └──────────────────────────────────┘  │
│              │                                                         │
│              ▼                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                      CORE LUDO ENGINE                            │  │
│  │  Coordinates (0..14, 0..14) ── Path (52 common + 5 home cells)   │  │
│  │  State Machine: ROLL_DICE -> SELECT_TOKEN -> MOVE -> NEXT_TURN   │  │
│  │  Collision Detection: Safe Stars [8, 21, 34, 47 + starting cells]│  │
│  │  Rule Validator: 6 to Spawn, Extra Turn, Exact Finish Target     │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Model & Entities
- **User / Player**: `id`, `username`, `email`, `avatar`, `games_played`, `games_won`, `tokens_captured`, `win_rate`, `created_at`.
- **Game Session**: `id`, `room_code`, `mode` (`vs_bot`, `local`, `online`), `status` (`waiting`, `active`, `finished`), `current_turn`, `dice_value`, `winner`, `players` (array of 2–4 players), `history` (log of moves).
- **Token State**: `id` (`0..3`), `player_color` (`red`, `green`, `yellow`, `blue`), `position` (`-1` for yard, `0..51` for track, `100..105` for home stretch, `999` for finished).
- **Leaderboard Records**: Daily, weekly, all-time aggregations sorted by total wins, win rate, and total captures.
- **Admin & Ad Settings**: Configurable slots (`header_banner`, `sidebar_square`, `post_game_interstitial`), site metadata, and activity audit logs.

---

## 5. Implementation Roadmap

1. **Ludo Core Engine & 15×15 SVG Board**:
   - Mathematical coordinate map for all 52 main path cells, 4 starting yards (4 tokens each), 4 home entrance columns (5 cells each), 8 safe star cells, and central goal.
   - Complete rules implementation (6 to exit yard, capture opponent token back to yard, safe cells immune to capture, extra roll on 6 and capture, exact roll to finish).
2. **Game Modes & Bot AI**:
   - Single Player vs AI with Easy, Medium, and Hard heuristic evaluators (assesses token vulnerability, distance to goal, capture opportunities, and safe haven distance).
   - Local Pass & Play for 2, 3, or 4 players with custom names and color selection.
   - Online Multiplayer Room simulator with room code generation, shareable links, host start, and synchronized move logs.
3. **Web Audio Sound Effects**:
   - Synthesizer utility using Web Audio API for dice rattles, token jump taps, capture strikes, safe zone chimes, and celebration fanfares with toggle.
4. **User Portal, Leaderboard, & Ad Management**:
   - Player profile with match history, stats, and achievements.
   - Daily, Weekly, and All-Time leaderboards with search and filter.
   - Admin CMS with user management, match observer, and Google AdSense ad slot configuration.
5. **Standalone PHP 8.2 / MySQL Package Generator**:
   - Complete directory structure of the PHP project (`app/`, `database/schema.sql`, `database/seed.sql`, `install/`, `public/`, `.htaccess`, `README.md`).
   - Automated Web Installer script (`install/index.php`) with step-by-step UI: environment check, PDO MySQL connection test, schema installer, admin creator, and `installed.lock` creation.
   - Bundling into `premium-ludo-netlify.zip` with instant 1-click download button and modal instructions.
6. **Polishing & Verification**:
   - Verify responsiveness on mobile, tablet, and desktop.
   - Test all game rule edge cases (three consecutive 6s prevention, exact home entry requirement, multi-token stacking on safe cells).
   - Ensure clean compilation and zero linter warnings.
