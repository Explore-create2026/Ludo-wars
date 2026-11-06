/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, BookOpen, Shield, Dices, Award, Swords, Sparkles } from 'lucide-react';

interface RulesGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesGuideModal: React.FC<RulesGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#131B30] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0B1020]/60">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-lg text-white">Official Rules of Ludo Wars</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
          {/* Rule 1: Deployment & The Six */}
          <div className="flex gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center shrink-0">
              <Dices className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white mb-1">1. Deploying Tokens (The Power of Six)</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                All four tokens begin stationed inside their respective corner yards. A player must roll a <strong className="text-amber-400 font-bold">6</strong> to mobilize a token out of the yard onto the designated starting square. Rolling a 6 also awards an immediate <strong className="text-purple-300">bonus dice roll</strong>.
              </p>
            </div>
          </div>

          {/* Rule 2: Movement & Track Traversal */}
          <div className="flex gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white mb-1">2. Movement & Clockwise Traversal</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tokens advance clockwise around the perimeter along the 52 common path cells according to the dice number rolled. If you have multiple movable tokens, you may select whichever one best fits your tactical advantage.
              </p>
            </div>
          </div>

          {/* Rule 3: Capturing Opponents */}
          <div className="flex gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center shrink-0">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white mb-1">3. Opponent Capture & Bonus Turns</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Landing on a cell occupied by an opponent's token eliminates that token, banishing it back to their corner yard! Additionally, capturing an opponent awards the attacker an immediate <strong className="text-amber-400">bonus roll</strong>.
              </p>
            </div>
          </div>

          {/* Rule 4: Safe Zones */}
          <div className="flex gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white mb-1">4. Safe Sanctuary Zones</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tokens resting on the 4 starting cells or the 4 cells adorned with a golden star (<span className="text-amber-400 font-bold">★</span>) are immune to elimination. Multiple tokens from different players may safely co-exist on these cells.
              </p>
            </div>
          </div>

          {/* Rule 5: Home Column & Exact Finish */}
          <div className="flex gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white mb-1">5. Home Entrance & Exact Victory Finish</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                After completing a full circuit around the board, tokens enter their colored home corridor leading towards the center triangle. To enter the center victory sanctuary, an <strong className="text-amber-400">exact dice roll</strong> is required. The first player to bring all four tokens safely home wins the war!
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0B1020]/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg transition"
          >
            I Understand the Rules
          </button>
        </div>
      </div>
    </div>
  );
};
