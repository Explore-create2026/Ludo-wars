/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, FileText, Mail, ShieldAlert } from 'lucide-react';

export type LegalDocType = 'about' | 'contact' | 'privacy' | 'terms' | 'cookies';

interface LegalModalProps {
  type: LegalDocType | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  const contentMap: Record<LegalDocType, { title: string; body: React.ReactNode }> = {
    about: {
      title: 'About Ludo Wars',
      body: (
        <div className="space-y-4">
          <p>
            Welcome to <strong>Ludo Wars</strong>, a premium, free-to-play digital board game platform designed for authentic strategy, friendship, and fair competition.
          </p>
          <p>
            Built using modern web technologies and standard international tournament rules, Ludo Wars offers a zero-compromise experience with intelligent AI bots, pass-and-play local multiplayer, and custom room lobbies for remote matches with friends.
          </p>
          <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 text-purple-200 text-xs">
            <strong>Strict Fair-Play Guarantee:</strong> Ludo Wars contains zero gambling mechanics, zero cash wagering, zero betting, and zero pay-to-win boosters. All dice rolls are mathematically generated and validated.
          </div>
        </div>
      ),
    },
    contact: {
      title: 'Contact Platform Support',
      body: (
        <div className="space-y-4">
          <p>
            Have feedback, questions about game balance, or technical inquiries regarding hosting deployment? Our support team is here to assist.
          </p>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-400" />
              <span>Email: <strong>support@ludowars.com</strong></span>
            </div>
            <div>Operating Hours: Monday – Friday, 09:00 – 18:00 UTC</div>
            <div>Response Time: Within 24 business hours</div>
          </div>
        </div>
      ),
    },
    privacy: {
      title: 'Privacy Policy',
      body: (
        <div className="space-y-4 text-xs leading-relaxed">
          <p>
            <strong>Last Updated: November 2026</strong>
          </p>
          <p>
            Your privacy is of utmost importance to us. This Privacy Policy outlines our standards concerning data handling:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Local Gameplay:</strong> Guest sessions, offline matches, and audio preferences are stored exclusively on your device via browser local storage.</li>
            <li><strong>User Accounts:</strong> When creating an account, your chosen username and email are encrypted and protected with modern industry cryptographic hashing (BCRYPT).</li>
            <li><strong>No Tracking of Sensitive Data:</strong> We never harvest banking information, physical location, or biometric data.</li>
            <li><strong>Advertising:</strong> Third-party advertising partners (such as Google AdSense) may utilize non-personally identifiable cookies to serve relevant contextual ads in accordance with standard GDPR and CCPA regulations.</li>
          </ul>
        </div>
      ),
    },
    terms: {
      title: 'Terms of Service',
      body: (
        <div className="space-y-4 text-xs leading-relaxed">
          <p>
            By accessing or playing Ludo Wars, you agree to abide by these Terms of Service:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Entertainment Purpose:</strong> Ludo Wars is provided solely for personal entertainment. No real-money gambling or speculative betting is permitted.</li>
            <li><strong>Fair Competition:</strong> The use of external memory injectors, botting exploits in online rooms, or abuse of the multiplayer synchronization API is strictly prohibited.</li>
            <li><strong>Account Responsibility:</strong> Users are responsible for safeguarding their login credentials and maintaining sportsmanlike conduct in chat and room creation.</li>
          </ul>
        </div>
      ),
    },
    cookies: {
      title: 'Cookie & Storage Policy',
      body: (
        <div className="space-y-4 text-xs leading-relaxed">
          <p>
            Ludo Wars utilizes lightweight cookies and local storage tokens solely to maintain your session state, persist audio volume preferences, and record offline match history.
          </p>
          <p>
            You can clear local cookies at any time via your browser settings without impacting your ability to play as a guest.
          </p>
        </div>
      ),
    },
  };

  const item = contentMap[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#131B30] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0B1020]/60">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-lg text-white">{item.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 text-sm text-slate-300 max-h-[70vh] overflow-y-auto">
          {item.body}
        </div>

        <div className="p-4 border-t border-slate-800 bg-[#0B1020]/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
