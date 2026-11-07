/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { adsterraService } from '../services/adsterraService';

interface AdsterraAdBannerProps {
  slotId: string;
  fallbackFormat?: '728x90' | '300x250' | '468x60' | '320x50' | '160x300' | 'native';
  className?: string;
}

export const AdsterraAdBanner: React.FC<AdsterraAdBannerProps> = ({
  slotId,
  fallbackFormat = '728x90',
  className = '',
}) => {
  const slot = adsterraService.getSlot(slotId);

  // If slot doesn't exist or is disabled by admin in CMS, don't render anything
  if (!slot || !slot.enabled || !slot.code) {
    return null;
  }

  // Determine Dimensions
  const targetWidth = slot.width || (fallbackFormat === '300x250' ? 300 : fallbackFormat === '468x60' ? 468 : fallbackFormat === '320x50' ? 320 : fallbackFormat === '160x300' ? 160 : 728);
  const targetHeight = slot.height || (fallbackFormat === '300x250' ? 250 : fallbackFormat === '468x60' ? 60 : fallbackFormat === '320x50' ? 50 : fallbackFormat === '160x300' ? 300 : 90);

  // Build sandboxed HTML document so Adsterra scripts and atOptions execute cleanly in isolated context
  const sandboxedSrcDoc = useMemo(() => {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: transparent;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
  </style>
</head>
<body>
  ${slot.code}
</body>
</html>`;
  }, [slot.code]);

  return (
    <aside
      aria-label="Sponsored Adsterra Advertisement"
      className={`mx-auto my-3 flex flex-col items-center justify-center p-2 rounded-2xl bg-[#131B30]/80 border border-slate-800/80 shadow-lg overflow-hidden max-w-full ${className}`}
      style={{ minHeight: `${targetHeight + 28}px` }}
    >
      {/* Sponsored Header Tag */}
      <div className="w-full flex items-center justify-between px-2 pb-1 text-[9px] text-slate-500 uppercase tracking-widest font-semibold border-b border-slate-800/40 mb-1.5">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>Sponsored Promotion</span>
        </span>
        <span className="text-purple-400 font-mono text-[9px]">Adsterra</span>
      </div>

      {/* Sandboxed Ad Frame */}
      <div className="w-full flex items-center justify-center overflow-hidden">
        <iframe
          title={slot.title}
          srcDoc={sandboxedSrcDoc}
          width={targetWidth}
          height={targetHeight}
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          scrolling="no"
          className="border-0 overflow-hidden max-w-full"
          style={{
            width: `${targetWidth}px`,
            height: `${targetHeight}px`,
            maxWidth: '100%',
          }}
        />
      </div>
    </aside>
  );
};
