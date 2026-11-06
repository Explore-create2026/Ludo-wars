/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BoardCoordinate, PlayerColor } from '../types/ludo';

/**
 * Standard 15x15 Ludo Board Coordinate System
 * Grid bounds: x: 0..14, y: 0..14.
 * Each cell is 100x100 SVG units within a 1500x1500 viewport.
 */

// 52 common track cells in clockwise sequence starting at Red's entry point (x: 1, y: 8)
export const TRACK_COORDINATES: BoardCoordinate[] = [
  // Red Arm bottom-left -> moving right
  { x: 1, y: 8 },  // 0  - Red Start (Safe)
  { x: 2, y: 8 },  // 1
  { x: 3, y: 8 },  // 2
  { x: 4, y: 8 },  // 3
  { x: 5, y: 8 },  // 4
  // Down into Bottom arm
  { x: 6, y: 9 },  // 5
  { x: 6, y: 10 }, // 6
  { x: 6, y: 11 }, // 7
  { x: 6, y: 12 }, // 8  - Safe Star (Bottom arm left)
  { x: 6, y: 13 }, // 9
  { x: 6, y: 14 }, // 10
  { x: 7, y: 14 }, // 11
  { x: 8, y: 14 }, // 12
  // Up Bottom arm right
  { x: 8, y: 13 }, // 13 - Blue Start (Safe)
  { x: 8, y: 12 }, // 14
  { x: 8, y: 11 }, // 15
  { x: 8, y: 10 }, // 16
  { x: 8, y: 9 },  // 17
  // Right into Right arm
  { x: 9, y: 8 },  // 18
  { x: 10, y: 8 }, // 19
  { x: 11, y: 8 }, // 20
  { x: 12, y: 8 }, // 21 - Safe Star (Right arm bottom)
  { x: 13, y: 8 }, // 22
  { x: 14, y: 8 }, // 23
  { x: 14, y: 7 }, // 24
  { x: 14, y: 6 }, // 25
  // Left Right arm top
  { x: 13, y: 6 }, // 26 - Yellow Start (Safe)
  { x: 12, y: 6 }, // 27
  { x: 11, y: 6 }, // 28
  { x: 10, y: 6 }, // 29
  { x: 9, y: 6 },  // 30
  // Up into Top arm
  { x: 8, y: 5 },  // 31
  { x: 8, y: 4 },  // 32
  { x: 8, y: 3 },  // 33
  { x: 8, y: 2 },  // 34 - Safe Star (Top arm right)
  { x: 8, y: 1 },  // 35
  { x: 8, y: 0 },  // 36
  { x: 7, y: 0 },  // 37
  { x: 6, y: 0 },  // 38
  // Down Top arm left
  { x: 6, y: 1 },  // 39 - Green Start (Safe)
  { x: 6, y: 2 },  // 40
  { x: 6, y: 3 },  // 41
  { x: 6, y: 4 },  // 42
  { x: 6, y: 5 },  // 43
  // Left into Left arm
  { x: 5, y: 6 },  // 44
  { x: 4, y: 6 },  // 45
  { x: 3, y: 6 },  // 46
  { x: 2, y: 6 },  // 47 - Safe Star (Left arm top)
  { x: 1, y: 6 },  // 48
  { x: 0, y: 6 },  // 49
  { x: 0, y: 7 },  // 50 - Red Home column turn point
  { x: 0, y: 8 },  // 51
];

// Start offsets on the common 52-cell track
export const COLOR_TRACK_OFFSETS: Record<PlayerColor, number> = {
  red: 0,     // Start at cell 0 (x: 1, y: 8)
  blue: 13,   // Start at cell 13 (x: 8, y: 13)
  yellow: 26, // Start at cell 26 (x: 13, y: 6)
  green: 39,  // Start at cell 39 (x: 6, y: 1)
};

// Safe track indices on the common 52-cell track
export const SAFE_TRACK_INDICES = [0, 8, 13, 21, 26, 34, 39, 47];

// Home column 5 cells leading to the center goal for each color (steps 51..55)
export const HOME_COLUMNS: Record<PlayerColor, BoardCoordinate[]> = {
  red: [
    { x: 1, y: 7 },
    { x: 2, y: 7 },
    { x: 3, y: 7 },
    { x: 4, y: 7 },
    { x: 5, y: 7 },
  ],
  green: [
    { x: 7, y: 1 },
    { x: 7, y: 2 },
    { x: 7, y: 3 },
    { x: 7, y: 4 },
    { x: 7, y: 5 },
  ],
  yellow: [
    { x: 13, y: 7 },
    { x: 12, y: 7 },
    { x: 11, y: 7 },
    { x: 10, y: 7 },
    { x: 9, y: 7 },
  ],
  blue: [
    { x: 7, y: 13 },
    { x: 7, y: 12 },
    { x: 7, y: 11 },
    { x: 7, y: 10 },
    { x: 7, y: 9 },
  ],
};

// Center goal finish position for step 56
export const GOAL_COORDINATES: Record<PlayerColor, BoardCoordinate> = {
  red: { x: 6, y: 7 },
  green: { x: 7, y: 6 },
  yellow: { x: 8, y: 7 },
  blue: { x: 7, y: 8 },
};

// Yard positions for 4 tokens inside each player's 6x6 base
export const YARD_COORDINATES: Record<PlayerColor, BoardCoordinate[]> = {
  red: [
    { x: 1.8, y: 10.8 },
    { x: 3.8, y: 10.8 },
    { x: 1.8, y: 12.8 },
    { x: 3.8, y: 12.8 },
  ],
  green: [
    { x: 1.8, y: 1.8 },
    { x: 3.8, y: 1.8 },
    { x: 1.8, y: 3.8 },
    { x: 3.8, y: 3.8 },
  ],
  yellow: [
    { x: 10.8, y: 1.8 },
    { x: 12.8, y: 1.8 },
    { x: 10.8, y: 3.8 },
    { x: 12.8, y: 3.8 },
  ],
  blue: [
    { x: 10.8, y: 10.8 },
    { x: 12.8, y: 10.8 },
    { x: 10.8, y: 12.8 },
    { x: 12.8, y: 12.8 },
  ],
};

export const COLOR_CONFIG: Record<PlayerColor, {
  name: string;
  primary: string;
  light: string;
  dark: string;
  border: string;
  glow: string;
  textColor: string;
}> = {
  red: {
    name: 'Red',
    primary: '#EF4444',
    light: '#FCA5A5',
    dark: '#991B1B',
    border: '#DC2626',
    glow: 'rgba(239, 68, 68, 0.45)',
    textColor: '#FFFFFF',
  },
  green: {
    name: 'Green',
    primary: '#22C55E',
    light: '#86EFAC',
    dark: '#166534',
    border: '#16A34A',
    glow: 'rgba(34, 197, 94, 0.45)',
    textColor: '#FFFFFF',
  },
  yellow: {
    name: 'Yellow',
    primary: '#FACC15',
    light: '#FEF08A',
    dark: '#854D0E',
    border: '#EAB308',
    glow: 'rgba(250, 204, 21, 0.45)',
    textColor: '#1E293B',
  },
  blue: {
    name: 'Blue',
    primary: '#3B82F6',
    light: '#93C5FD',
    dark: '#1E40AF',
    border: '#2563EB',
    glow: 'rgba(59, 130, 246, 0.45)',
    textColor: '#FFFFFF',
  },
};

/**
 * Returns exact SVG center (cx, cy) in pixels (0..1500) for a token
 */
export function getTokenSvgPosition(color: PlayerColor, tokenId: number, step: number): { cx: number; cy: number } {
  const cellSize = 100;
  
  // 1. In Yard
  if (step === -1) {
    const coord = YARD_COORDINATES[color][tokenId];
    return {
      cx: coord.x * cellSize + cellSize / 2,
      cy: coord.y * cellSize + cellSize / 2,
    };
  }

  // 2. Finished Goal
  if (step === 56) {
    const coord = GOAL_COORDINATES[color];
    // Slightly offset tokens within the center goal so multiple finished tokens don't overlap completely
    const offsets = [
      { dx: -12, dy: -12 },
      { dx: 12, dy: -12 },
      { dx: -12, dy: 12 },
      { dx: 12, dy: 12 },
    ];
    const off = offsets[tokenId] || { dx: 0, dy: 0 };
    return {
      cx: coord.x * cellSize + cellSize / 2 + off.dx,
      cy: coord.y * cellSize + cellSize / 2 + off.dy,
    };
  }

  // 3. In Home Column (51..55)
  if (step >= 51 && step <= 55) {
    const colIndex = step - 51;
    const coord = HOME_COLUMNS[color][colIndex];
    return {
      cx: coord.x * cellSize + cellSize / 2,
      cy: coord.y * cellSize + cellSize / 2,
    };
  }

  // 4. On Common Track (0..50)
  const offset = COLOR_TRACK_OFFSETS[color];
  const trackIndex = (offset + step) % 52;
  const coord = TRACK_COORDINATES[trackIndex];
  return {
    cx: coord.x * cellSize + cellSize / 2,
    cy: coord.y * cellSize + cellSize / 2,
  };
}

/**
 * Calculates the common track index (0..51) for a token if on track, or null if in yard/home/goal
 */
export function getTrackIndex(color: PlayerColor, step: number): number | null {
  if (step < 0 || step > 50) return null;
  return (COLOR_TRACK_OFFSETS[color] + step) % 52;
}
