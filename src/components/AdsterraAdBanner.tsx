/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { adsterraService } from '../services/adsterraService';

interface AdsterraAdBannerProps {
  slotId: string;
  fallbackFormat?: '728x90' | '300x250' | '468x60' | 'footer';
  className?: string;
}

export const AdsterraAdBanner: React.FC<AdsterraAdBannerProps> = ({
  slotId,
  fallbackFormat = '728x90',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const slot = adsterraService.getSlot(slotId);

  useEffect(() => {
    if (!containerRef.current || !slot || !slot.enabled || !slot.code) return;

    try {
      const slotDiv = containerRef.current;
      slotDiv.innerHTML = ''; // clear previous

      // Parse and execute script tags safely
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = slot.code;

      const scripts = tempDiv.getElementsByTagName('script');
      for (let i = 0; i < scripts.length; i++) {
        const s = document.createElement('script');
        s.type = 'text/javascript';
        if (scripts[i].src) {
          s.src = scripts[i].src;
        } else {
          s.text = scripts[i].innerHTML;
        }
        slotDiv.appendChild(s);
      }
    } catch {
      // safe fallback
    }
  }, [slot?.code, slot?.enabled]);

  // If slot doesn't exist or is disabled by admin, return null
  if (!slot || !slot.enabled) {
    return null;
  }

  const isFooter = slotId === 'adst_footer_banner' || fallbackFormat === 'footer' || fallbackFormat === '468x60';
  const isMid = slotId === 'adst_mid_300x250' || fallbackFormat === '300x250';

  const containerSizing = isFooter
    ? 'w-full max-w-[468px] min-h-[60px]'
    : isMid
    ? 'w-full max-w-[300px] min-h-[250px]'
    : 'w-full max-w-[728px] min-h-[90px]';

  return (
    <aside
      aria-label="Sponsored Adsterra Promotion"
      className={`mx-auto my-3 flex flex-col items-center justify-center p-2 rounded-xl bg-[#131B30]/70 border border-slate-800/80 shadow-md overflow-hidden ${containerSizing} ${className}`}
    >
      <div className="w-full flex items-center justify-between px-2 pb-1 text-[9px] text-slate-500 uppercase tracking-widest font-semibold border-b border-slate-800/40 mb-1">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>Sponsored</span>
        </span>
        <span className="text-purple-400 font-mono text-[9px]">Adsterra</span>
      </div>

      <div
        ref={containerRef}
        className="w-full flex items-center justify-center text-center overflow-hidden"
      >
        {/* Placeholder shown if no external script executes */}
        <div className="p-2 text-center text-slate-400 text-xs">
          <div className="font-semibold text-slate-300 text-[11px]">{slot.title}</div>
          <div className="text-[10px] text-slate-500 font-mono">Format: {slot.format}</div>
        </div>
      </div>
    </aside>
  );
};
