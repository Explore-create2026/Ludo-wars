/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface GoogleAdSenseBannerProps {
  slot?: string;
  client?: string;
  format?: string;
  className?: string;
}

export const GoogleAdSenseBanner: React.FC<GoogleAdSenseBannerProps> = ({
  slot = '9192070017',
  client = 'ca-pub-8772765378084223',
  format = 'autorelaxed',
  className = '',
}) => {
  const adRef = useRef<HTMLModElement>(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    if (!pushedRef.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushedRef.current = true;
      } catch {
        // Suppress if ad blocker is active or already pushed
      }
    }
  }, []);

  return (
    <aside
      aria-label="Google AdSense Sponsored Content"
      className={`mx-auto my-4 w-full max-w-5xl p-3 sm:p-4 rounded-2xl bg-[#131B30]/80 border border-slate-800/80 shadow-lg overflow-hidden ${className}`}
    >
      {/* Header Tag */}
      <div className="w-full flex items-center justify-between px-2 pb-1.5 text-[9px] text-slate-500 uppercase tracking-widest font-semibold border-b border-slate-800/40 mb-2">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          <span>Recommended Content</span>
        </span>
        <span className="text-blue-400 font-mono text-[9px]">Google AdSense</span>
      </div>

      {/* AdSense ins Container */}
      <div className="w-full flex justify-center items-center min-h-[90px] overflow-hidden">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minHeight: '90px' }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format={format}
        />
      </div>
    </aside>
  );
};
