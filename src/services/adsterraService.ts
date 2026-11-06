/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AdsterraAdSlot, AdsterraFormat } from '../types/ludo';

const STORAGE_KEY = 'ludo_wars_adsterra_slots';

export const DEFAULT_ADSTERRA_SLOTS: AdsterraAdSlot[] = [
  {
    id: 'adst_header_728x90',
    title: 'Top Leaderboard Banner (728x90)',
    format: 'banner_728x90',
    placement: 'header',
    enabled: true,
    width: 728,
    height: 90,
    description: 'Prominent banner placed directly under the top navigation for maximum viewability.',
    code: `<script type="text/javascript">
\tatOptions = {
\t\t'key' : '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d',
\t\t'format' : 'iframe',
\t\t'height' : 90,
\t\t'width' : 728,
\t\t'params' : {}
\t};
</script>
<script type="text/javascript" src="//www.topcreativeformat.com/9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d/invoke.js"></script>`,
  },
  {
    id: 'adst_mid_300x250',
    title: 'Content Area Rectangle (300x250)',
    format: 'banner_300x250',
    placement: 'mid_content',
    enabled: true,
    width: 300,
    height: 250,
    description: 'High-performing medium rectangle banner rendered naturally within content sections.',
    code: `<script type="text/javascript">
\tatOptions = {
\t\t'key' : '5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f',
\t\t'format' : 'iframe',
\t\t'height' : 250,
\t\t'width' : 300,
\t\t'params' : {}
\t};
</script>
<script type="text/javascript" src="//www.topcreativeformat.com/5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f/invoke.js"></script>`,
  },
  {
    id: 'adst_footer_banner',
    title: 'Footer Revenue Banner (468x60 / Responsive)',
    format: 'footer_banner',
    placement: 'footer',
    enabled: true,
    width: 468,
    height: 60,
    description: 'Non-intrusive, visually balanced banner right above the website footer for added monetization.',
    code: `<script type="text/javascript">
\tatOptions = {
\t\t'key' : '4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b',
\t\t'format' : 'iframe',
\t\t'height' : 60,
\t\t'width' : 468,
\t\t'params' : {}
\t};
</script>
<script type="text/javascript" src="//www.topcreativeformat.com/4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b/invoke.js"></script>`,
  },
  {
    id: 'adst_social_bar',
    title: 'Social Bar / In-Page Push',
    format: 'social_bar',
    placement: 'global_overlay',
    enabled: true,
    description: 'Modern engaging format that does not block gameplay and generates top-tier CPM rates.',
    code: `<script type="text/javascript" src="//pl2026700124.profitablecpmrate.com/adsterra-social.js"></script>`,
  },
  {
    id: 'adst_popunder',
    title: 'Popunder Trigger Script',
    format: 'popunder',
    placement: 'global_overlay',
    enabled: false,
    description: 'Opens a background tab on user click without interrupting gameplay flow.',
    code: `<script type="text/javascript" src="//pl9988776655.profitablecpmrate.com/adsterra-popunder.js"></script>`,
  },
  {
    id: 'adst_direct_link',
    title: 'Smart Direct Link (Smartlink)',
    format: 'direct_link',
    placement: 'smart_link',
    enabled: true,
    description: 'Special high-payout direct monetization URL for bonus rewards or CTA actions.',
    code: `https://www.profitablecpmrate.com/smartlink/700124_ludowars`,
  },
];

class AdsterraService {
  private slots: AdsterraAdSlot[] = [];

  constructor() {
    this.slots = this.loadSlots();
    this.applyGlobalScripts();
  }

  private loadSlots(): AdsterraAdSlot[] {
    if (typeof window === 'undefined') return DEFAULT_ADSTERRA_SLOTS;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {
        // fallback
      }
    }
    this.saveSlots(DEFAULT_ADSTERRA_SLOTS);
    return DEFAULT_ADSTERRA_SLOTS;
  }

  public saveSlots(slots: AdsterraAdSlot[]) {
    this.slots = slots;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(slots));
    }
    this.applyGlobalScripts();
  }

  public getSlots(): AdsterraAdSlot[] {
    return this.slots;
  }

  public getSlot(id: string): AdsterraAdSlot | undefined {
    return this.slots.find((s) => s.id === id);
  }

  public updateSlot(id: string, updates: Partial<AdsterraAdSlot>) {
    this.slots = this.slots.map((s) => (s.id === id ? { ...s, ...updates } : s));
    this.saveSlots(this.slots);
  }

  public toggleSlot(id: string) {
    this.slots = this.slots.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s));
    this.saveSlots(this.slots);
  }

  public resetToDefaults() {
    this.saveSlots(DEFAULT_ADSTERRA_SLOTS);
  }

  /**
   * Evaluates global scripts like Popunder or Social Bar when enabled
   */
  private applyGlobalScripts() {
    if (typeof window === 'undefined') return;

    // Popunder handler
    const popunder = this.getSlot('adst_popunder');
    if (popunder && popunder.enabled && popunder.code.trim()) {
      try {
        if (!document.getElementById('adsterra-popunder-tag')) {
          const match = popunder.code.match(/src=["'](.*?)["']/);
          if (match && match[1]) {
            const script = document.createElement('script');
            script.id = 'adsterra-popunder-tag';
            script.src = match[1];
            script.async = true;
            document.head.appendChild(script);
          }
        }
      } catch {
        // ignore script errors
      }
    }
  }
}

export const adsterraService = new AdsterraService();
