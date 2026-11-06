/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  COLOR_CONFIG,
  getTokenSvgPosition,
  SAFE_TRACK_INDICES,
  TRACK_COORDINATES,
} from '../constants/boardGeometry';
import { Player, PlayerColor, Token } from '../types/ludo';

interface LudoBoardProps {
  players: Player[];
  activeColor: PlayerColor;
  eligibleTokenIds: number[];
  diceRolled: boolean;
  onTokenClick: (tokenId: number) => void;
  winnerColor?: PlayerColor | null;
}

export const LudoBoard: React.FC<LudoBoardProps> = ({
  players,
  activeColor,
  eligibleTokenIds,
  diceRolled,
  onTokenClick,
  winnerColor,
}) => {
  const cellSize = 100;

  // Active player tokens lookup
  const activePlayer = players.find((p) => p.color === activeColor);

  return (
    <div className="relative w-full max-w-[580px] aspect-square mx-auto rounded-2xl shadow-2xl p-2 md:p-3 bg-gradient-to-br from-[#1E294B] to-[#0F172A] border border-slate-700/80">
      <svg
        viewBox="0 0 1500 1500"
        className="w-full h-full rounded-xl select-none"
        style={{ filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.6))' }}
      >
        <defs>
          {/* Subtle drop shadows */}
          <filter id="token-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000000" floodOpacity="0.6" />
          </filter>
          <filter id="active-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#F5C76B" floodOpacity="0.8" />
          </filter>

          {/* Player Token Gradients */}
          <radialGradient id="grad-red" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#F87171" />
            <stop offset="70%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#991B1B" />
          </radialGradient>
          <radialGradient id="grad-green" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#4ADE80" />
            <stop offset="70%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#14532D" />
          </radialGradient>
          <radialGradient id="grad-yellow" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="70%" stopColor="#FACC15" />
            <stop offset="100%" stopColor="#854D0E" />
          </radialGradient>
          <radialGradient id="grad-blue" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="70%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </radialGradient>
        </defs>

        {/* Board Background */}
        <rect x="0" y="0" width="1500" height="1500" fill="#0B1020" rx="20" />

        {/* 1. TOP-LEFT YARD: GREEN (6x6) */}
        <g id="yard-green">
          <rect x="0" y="0" width="600" height="600" fill="#14532D" stroke="#1E293B" strokeWidth="3" />
          <rect x="80" y="80" width="440" height="440" rx="24" fill="#0B1020" stroke="#22C55E" strokeWidth="4" />
          {/* 4 Yard Circles */}
          {[
            { cx: 230, cy: 230 },
            { cx: 430, cy: 230 },
            { cx: 230, cy: 430 },
            { cx: 430, cy: 430 },
          ].map((pt, i) => (
            <circle key={i} cx={pt.cx} cy={pt.cy} r="48" fill="#14532D" stroke="#22C55E" strokeWidth="4" />
          ))}
          <text x="300" y="340" fill="#86EFAC" fontSize="40" fontWeight="bold" textAnchor="middle" opacity="0.3">
            GREEN
          </text>
        </g>

        {/* 2. TOP-RIGHT YARD: YELLOW (6x6) */}
        <g id="yard-yellow">
          <rect x="900" y="0" width="600" height="600" fill="#713F12" stroke="#1E293B" strokeWidth="3" />
          <rect x="980" y="80" width="440" height="440" rx="24" fill="#0B1020" stroke="#FACC15" strokeWidth="4" />
          {[
            { cx: 1130, cy: 230 },
            { cx: 1330, cy: 230 },
            { cx: 1130, cy: 430 },
            { cx: 1330, cy: 430 },
          ].map((pt, i) => (
            <circle key={i} cx={pt.cx} cy={pt.cy} r="48" fill="#713F12" stroke="#FACC15" strokeWidth="4" />
          ))}
          <text x="1200" y="340" fill="#FEF08A" fontSize="40" fontWeight="bold" textAnchor="middle" opacity="0.3">
            YELLOW
          </text>
        </g>

        {/* 3. BOTTOM-LEFT YARD: RED (6x6) */}
        <g id="yard-red">
          <rect x="0" y="900" width="600" height="600" fill="#7F1D1D" stroke="#1E293B" strokeWidth="3" />
          <rect x="80" y="980" width="440" height="440" rx="24" fill="#0B1020" stroke="#EF4444" strokeWidth="4" />
          {[
            { cx: 230, cy: 1130 },
            { cx: 430, cy: 1130 },
            { cx: 230, cy: 1330 },
            { cx: 430, cy: 1330 },
          ].map((pt, i) => (
            <circle key={i} cx={pt.cx} cy={pt.cy} r="48" fill="#7F1D1D" stroke="#EF4444" strokeWidth="4" />
          ))}
          <text x="300" y="1240" fill="#FCA5A5" fontSize="40" fontWeight="bold" textAnchor="middle" opacity="0.3">
            RED
          </text>
        </g>

        {/* 4. BOTTOM-RIGHT YARD: BLUE (6x6) */}
        <g id="yard-blue">
          <rect x="900" y="900" width="600" height="600" fill="#1E3A8A" stroke="#1E293B" strokeWidth="3" />
          <rect x="980" y="980" width="440" height="440" rx="24" fill="#0B1020" stroke="#3B82F6" strokeWidth="4" />
          {[
            { cx: 1130, cy: 1130 },
            { cx: 1330, cy: 1130 },
            { cx: 1130, cy: 1330 },
            { cx: 1330, cy: 1330 },
          ].map((pt, i) => (
            <circle key={i} cx={pt.cx} cy={pt.cy} r="48" fill="#1E3A8A" stroke="#3B82F6" strokeWidth="4" />
          ))}
          <text x="1200" y="1240" fill="#93C5FD" fontSize="40" fontWeight="bold" textAnchor="middle" opacity="0.3">
            BLUE
          </text>
        </g>

        {/* 5. 52 COMMON PATH CELLS */}
        <g id="common-cells">
          {TRACK_COORDINATES.map((coord, idx) => {
            const isSafe = SAFE_TRACK_INDICES.includes(idx);
            const isRedStart = idx === 0;
            const isBlueStart = idx === 13;
            const isYellowStart = idx === 26;
            const isGreenStart = idx === 39;

            let fill = '#131B30';
            if (isRedStart) fill = '#DC2626';
            else if (isBlueStart) fill = '#2563EB';
            else if (isYellowStart) fill = '#CA8A04';
            else if (isGreenStart) fill = '#16A34A';

            return (
              <g key={`track-${idx}`}>
                <rect
                  x={coord.x * cellSize}
                  y={coord.y * cellSize}
                  width={cellSize}
                  height={cellSize}
                  fill={fill}
                  stroke="#1E294B"
                  strokeWidth="2"
                />
                {/* Safe Star Icon */}
                {isSafe && !isRedStart && !isBlueStart && !isYellowStart && !isGreenStart && (
                  <text
                    x={coord.x * cellSize + cellSize / 2}
                    y={coord.y * cellSize + cellSize / 2 + 15}
                    fill="#F5C76B"
                    fontSize="42"
                    fontWeight="bold"
                    textAnchor="middle"
                    className="select-none"
                  >
                    ★
                  </text>
                )}
                {/* Start Arrow / Star indicators on starting cells */}
                {(isRedStart || isBlueStart || isYellowStart || isGreenStart) && (
                  <text
                    x={coord.x * cellSize + cellSize / 2}
                    y={coord.y * cellSize + cellSize / 2 + 13}
                    fill="#FFFFFF"
                    fontSize="36"
                    fontWeight="bold"
                    textAnchor="middle"
                    className="select-none"
                  >
                    ★
                  </text>
                )}
              </g>
            );
          })}
        </g>

        {/* 6. HOME COLUMNS (5 cells each) */}
        {/* Red Home Column (x: 1..5, y: 7) */}
        <g id="home-red">
          {[1, 2, 3, 4, 5].map((x) => (
            <rect
              key={`home-red-${x}`}
              x={x * cellSize}
              y={7 * cellSize}
              width={cellSize}
              height={cellSize}
              fill="#EF4444"
              stroke="#B91C1C"
              strokeWidth="2"
            />
          ))}
        </g>

        {/* Green Home Column (x: 7, y: 1..5) */}
        <g id="home-green">
          {[1, 2, 3, 4, 5].map((y) => (
            <rect
              key={`home-green-${y}`}
              x={7 * cellSize}
              y={y * cellSize}
              width={cellSize}
              height={cellSize}
              fill="#22C55E"
              stroke="#15803D"
              strokeWidth="2"
            />
          ))}
        </g>

        {/* Yellow Home Column (x: 9..13, y: 7) */}
        <g id="home-yellow">
          {[13, 12, 11, 10, 9].map((x) => (
            <rect
              key={`home-yellow-${x}`}
              x={x * cellSize}
              y={7 * cellSize}
              width={cellSize}
              height={cellSize}
              fill="#FACC15"
              stroke="#A16207"
              strokeWidth="2"
            />
          ))}
        </g>

        {/* Blue Home Column (x: 7, y: 9..13) */}
        <g id="home-blue">
          {[13, 12, 11, 10, 9].map((y) => (
            <rect
              key={`home-blue-${y}`}
              x={7 * cellSize}
              y={y * cellSize}
              width={cellSize}
              height={cellSize}
              fill="#3B82F6"
              stroke="#1D4ED8"
              strokeWidth="2"
            />
          ))}
        </g>

        {/* 7. CENTER 3x3 VICTORY TRIANGLES */}
        <g id="center-goal">
          {/* Red Left Triangle */}
          <polygon points="600,600 750,750 600,900" fill="#DC2626" stroke="#991B1B" strokeWidth="2" />
          {/* Green Top Triangle */}
          <polygon points="600,600 750,750 900,600" fill="#16A34A" stroke="#14532D" strokeWidth="2" />
          {/* Yellow Right Triangle */}
          <polygon points="900,600 750,750 900,900" fill="#CA8A04" stroke="#713F12" strokeWidth="2" />
          {/* Blue Bottom Triangle */}
          <polygon points="600,900 750,750 900,900" fill="#2563EB" stroke="#1E3A8A" strokeWidth="2" />

          {/* Center Crown / Trophy */}
          <circle cx="750" cy="750" r="45" fill="#0B1020" stroke="#F5C76B" strokeWidth="4" />
          <text x="750" y="763" fill="#F5C76B" fontSize="38" textAnchor="middle" className="select-none">
            👑
          </text>
        </g>

        {/* 8. RENDER ALL 16 TOKENS */}
        <g id="tokens-layer">
          {players.map((player) =>
            player.tokens.map((token) => {
              const pos = getTokenSvgPosition(token.color, token.id, token.step);
              const isEligible =
                diceRolled &&
                player.color === activeColor &&
                eligibleTokenIds.includes(token.id);

              return (
                <g
                  key={`token-${player.color}-${token.id}`}
                  transform={`translate(${pos.cx}, ${pos.cy})`}
                  onClick={() => {
                    if (isEligible) {
                      onTokenClick(token.id);
                    }
                  }}
                  className={`transition-all duration-200 ${isEligible ? 'cursor-pointer' : ''}`}
                >
                  {/* Glowing halo if eligible to move */}
                  {isEligible && (
                    <circle
                      r="44"
                      fill="none"
                      stroke="#F5C76B"
                      strokeWidth="6"
                      strokeDasharray="10 4"
                      className="animate-spin"
                      style={{ animationDuration: '4s' }}
                    />
                  )}

                  {/* Token Body */}
                  <circle
                    r="34"
                    fill={`url(#grad-${token.color})`}
                    stroke="#FFFFFF"
                    strokeWidth="3.5"
                    filter="url(#token-shadow)"
                  />

                  {/* Inner ring */}
                  <circle
                    r="20"
                    fill="none"
                    stroke="rgba(255,255,255,0.6)"
                    strokeWidth="2.5"
                  />

                  {/* Token Identifier or Crown icon */}
                  <text
                    x="0"
                    y="7"
                    fill="#FFFFFF"
                    fontSize="18"
                    fontWeight="800"
                    textAnchor="middle"
                    className="select-none pointer-events-none"
                  >
                    {token.isFinished ? '✓' : token.id + 1}
                  </text>
                </g>
              );
            })
          )}
        </g>
      </svg>
    </div>
  );
};
