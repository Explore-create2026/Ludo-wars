/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PlayerColor } from '../types/ludo';
import { COLOR_CONFIG } from '../constants/boardGeometry';

interface DiceProps {
  value: number | null;
  isRolling: boolean;
  disabled: boolean;
  activeColor: PlayerColor;
  onRoll: () => void;
}

export const Dice: React.FC<DiceProps> = ({
  value,
  isRolling,
  disabled,
  activeColor,
  onRoll,
}) => {
  const [internalAnimation, setInternalAnimation] = useState(false);
  const colorCfg = COLOR_CONFIG[activeColor];

  const handleClick = () => {
    if (disabled || isRolling) return;
    setInternalAnimation(true);
    setTimeout(() => setInternalAnimation(false), 500);
    onRoll();
  };

  // Render dots for each number 1..6
  const renderDots = (num: number) => {
    switch (num) {
      case 1:
        return (
          <div className="flex items-center justify-center w-full h-full">
            <span className="w-5 h-5 rounded-full bg-slate-900 shadow-inner" />
          </div>
        );
      case 2:
        return (
          <div className="flex justify-between w-full h-full p-2.5">
            <span className="w-4 h-4 rounded-full bg-slate-900 shadow-inner self-start" />
            <span className="w-4 h-4 rounded-full bg-slate-900 shadow-inner self-end" />
          </div>
        );
      case 3:
        return (
          <div className="flex justify-between w-full h-full p-2.5">
            <span className="w-4 h-4 rounded-full bg-slate-900 shadow-inner self-start" />
            <span className="w-4 h-4 rounded-full bg-slate-900 shadow-inner self-center" />
            <span className="w-4 h-4 rounded-full bg-slate-900 shadow-inner self-end" />
          </div>
        );
      case 4:
        return (
          <div className="grid grid-cols-2 gap-4 w-full h-full p-2.5 place-items-center">
            <span className="w-4 h-4 rounded-full bg-slate-900 shadow-inner" />
            <span className="w-4 h-4 rounded-full bg-slate-900 shadow-inner" />
            <span className="w-4 h-4 rounded-full bg-slate-900 shadow-inner" />
            <span className="w-4 h-4 rounded-full bg-slate-900 shadow-inner" />
          </div>
        );
      case 5:
        return (
          <div className="relative w-full h-full p-2.5">
            <span className="absolute top-2.5 left-2.5 w-4 h-4 rounded-full bg-slate-900 shadow-inner" />
            <span className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-slate-900 shadow-inner" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-900 shadow-inner" />
            <span className="absolute bottom-2.5 left-2.5 w-4 h-4 rounded-full bg-slate-900 shadow-inner" />
            <span className="absolute bottom-2.5 right-2.5 w-4 h-4 rounded-full bg-slate-900 shadow-inner" />
          </div>
        );
      case 6:
        return (
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full h-full p-2.5 place-items-center">
            <span className="w-4 h-4 rounded-full bg-slate-900 shadow-inner" />
            <span className="w-4 h-4 rounded-full bg-slate-900 shadow-inner" />
            <span className="w-4 h-4 rounded-full bg-slate-900 shadow-inner" />
            <span className="w-4 h-4 rounded-full bg-slate-900 shadow-inner" />
            <span className="w-4 h-4 rounded-full bg-slate-900 shadow-inner" />
            <span className="w-4 h-4 rounded-full bg-slate-900 shadow-inner" />
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center w-full h-full text-slate-400 font-bold text-2xl">
            ?
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleClick}
        disabled={disabled || isRolling}
        aria-label="Roll Dice"
        className={`relative w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-b from-white to-slate-200 border-2 border-slate-300 shadow-2xl flex items-center justify-center transition-all transform ${
          disabled ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105 active:scale-95 cursor-pointer'
        } ${isRolling || internalAnimation ? 'animate-bounce rotate-12 scale-110' : ''}`}
        style={{
          boxShadow: disabled
            ? '0 4px 10px rgba(0,0,0,0.3)'
            : `0 12px 25px -4px ${colorCfg.glow}, 0 0 15px 2px ${colorCfg.primary}`,
        }}
      >
        {renderDots(value || 1)}

        {/* Glow Ring for active turn */}
        {!disabled && !isRolling && (
          <span className="absolute -inset-1 rounded-2xl border-2 border-amber-400/80 animate-ping opacity-30 pointer-events-none" />
        )}
      </button>

      <span className="text-xs font-semibold tracking-wide text-slate-300 uppercase">
        {isRolling ? 'Rolling...' : disabled ? 'Waiting...' : 'Click to Roll'}
      </span>
    </div>
  );
};
