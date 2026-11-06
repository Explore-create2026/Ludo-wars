/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BotDifficulty, Player, PlayerColor, Token } from '../types/ludo';
import { getTrackIndex, SAFE_TRACK_INDICES } from '../constants/boardGeometry';

export interface MoveOption {
  tokenId: number;
  fromStep: number;
  toStep: number;
  score: number;
  willCapture: boolean;
  willEnterSafeZone: boolean;
  willSpawn: boolean;
  willFinish: boolean;
}

/**
 * Evaluates candidate moves for a bot player and picks the best token based on difficulty.
 */
export function chooseBotMove(
  botPlayer: Player,
  allPlayers: Player[],
  diceValue: number,
  difficulty: BotDifficulty = 'medium'
): number | null {
  const legalTokens = botPlayer.tokens.filter((t) => canTokenMove(t, diceValue));
  if (legalTokens.length === 0) return null;
  if (legalTokens.length === 1) return legalTokens[0].id;

  // Easy mode: pick randomly among legal tokens
  if (difficulty === 'easy') {
    const randomIndex = Math.floor(Math.random() * legalTokens.length);
    return legalTokens[randomIndex].id;
  }

  // Calculate heuristic score for each candidate move
  const scoredMoves: MoveOption[] = legalTokens.map((token) => {
    let toStep = token.step;
    let willSpawn = false;

    if (token.step === -1) {
      toStep = 0;
      willSpawn = true;
    } else {
      toStep = token.step + diceValue;
    }

    const willFinish = toStep === 56;
    const destTrackIndex = getTrackIndex(token.color, toStep);
    const willEnterSafeZone = destTrackIndex !== null && SAFE_TRACK_INDICES.includes(destTrackIndex);

    // Check if move captures any opponent
    let willCapture = false;
    if (destTrackIndex !== null && !willEnterSafeZone) {
      allPlayers.forEach((opp) => {
        if (opp.id === botPlayer.id) return;
        opp.tokens.forEach((oppToken) => {
          const oppTrack = getTrackIndex(opp.color, oppToken.step);
          if (oppTrack !== null && oppTrack === destTrackIndex) {
            willCapture = true;
          }
        });
      });
    }

    // Check danger: is target cell vulnerable to an opponent within 1-6 cells behind?
    let isInDangerAtTarget = false;
    if (destTrackIndex !== null && !willEnterSafeZone) {
      allPlayers.forEach((opp) => {
        if (opp.id === botPlayer.id) return;
        opp.tokens.forEach((oppToken) => {
          const oppTrack = getTrackIndex(opp.color, oppToken.step);
          if (oppTrack !== null) {
            const dist = (destTrackIndex - oppTrack + 52) % 52;
            if (dist >= 1 && dist <= 6) {
              isInDangerAtTarget = true;
            }
          }
        });
      });
    }

    // Base scoring formula
    let score = 0;

    // 1. Victory / Reach Goal: Massive priority
    if (willFinish) {
      score += 200;
    }

    // 2. Capture Opponent: Extremely high priority (+ bonus turn!)
    if (willCapture) {
      score += 150;
    }

    // 3. Move into Safe Zone
    if (willEnterSafeZone) {
      score += 60;
    }

    // 4. Bringing token out of yard on a 6
    if (willSpawn) {
      score += difficulty === 'hard' ? 75 : 50;
    }

    // 5. Progress towards goal (reward advanced tokens or starting tokens based on difficulty)
    score += toStep * 1.5;

    // 6. Danger penalty (only in hard mode)
    if (difficulty === 'hard' && isInDangerAtTarget) {
      score -= 40;
    }

    // Add small random jitter in medium mode for variety
    if (difficulty === 'medium') {
      score += Math.random() * 20;
    }

    return {
      tokenId: token.id,
      fromStep: token.step,
      toStep,
      score,
      willCapture,
      willEnterSafeZone,
      willSpawn,
      willFinish,
    };
  });

  // Sort by score descending
  scoredMoves.sort((a, b) => b.score - a.score);
  return scoredMoves[0].tokenId;
}

/**
 * Checks if a token can make a legal move with the given dice roll.
 */
export function canTokenMove(token: Token, diceValue: number): boolean {
  if (token.isFinished || token.step >= 56) return false;

  // In Yard: only rolls of 6 can enter the board
  if (token.step === -1) {
    return diceValue === 6;
  }

  // Exact roll required to reach 56 (center goal)
  if (token.step + diceValue > 56) {
    return false;
  }

  return true;
}
