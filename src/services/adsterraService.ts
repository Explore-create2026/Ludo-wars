/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AdsterraAdSlot } from '../types/ludo';

const STORAGE_KEY = 'ludo_warss_adsterra_slots_v2';

export const DEFAULT_ADSTERRA_SLOTS: AdsterraAdSlot[] = [
  {
    id: 'adst_header_728x90',
    title: 'Top Leaderboard Banner (728x90)',
    format: 'banner_728x90',
    placement: 'header',
    enabled: true,
    width: 728,
    height: 90,
    description: 'Prominent desktop leaderboard banner placed under top navigation for maximum viewability.',
    code: `<script>
  atOptions = {
    'key' : '99ae394df84fb5dbacac4a5773b0626e',
    'format' : 'iframe',
    'height' : 90,
    'width' : 728,
    'params' : {}
  };
</script>
<script src="https://czernik.org/22/99ae394df84fb5dbacac4a5773b0626e"></script>`,
  },
  {
    id: 'adst_mobile_320x50',
    title: 'Mobile Header & Sticky Banner (320x50)',
    format: 'banner_320x50',
    placement: 'header',
    enabled: true,
    width: 320,
    height: 50,
    description: 'Crisp mobile banner optimized specifically for smartphones and handheld viewports.',
    code: `<script>
  atOptions = {
    'key' : 'ca2af78c8c1f739de966cf8102ca1283',
    'format' : 'iframe',
    'height' : 50,
    'width' : 320,
    'params' : {}
  };
</script>
<script src="https://czernik.org/22/ca2af78c8c1f739de966cf8102ca1283"></script>`,
  },
  {
    id: 'adst_mid_300x250',
    title: 'Content Area Medium Rectangle (300x250)',
    format: 'banner_300x250',
    placement: 'mid_content',
    enabled: true,
    width: 300,
    height: 250,
    description: 'High-performing medium rectangle banner rendered naturally beside the Ludo arena and content sections.',
    code: `<script>
  atOptions = {
    'key' : 'fb1b0f2ec70de09ae5c2c67f485eff53',
    'format' : 'iframe',
    'height' : 250,
    'width' : 300,
    'params' : {}
  };
</script>
<script src="https://czernik.org/22/fb1b0f2ec70de09ae5c2c67f485eff53"></script>`,
  },
  {
    id: 'adst_footer_468x60',
    title: 'Footer Balanced Banner (468x60)',
    format: 'banner_468x60',
    placement: 'footer',
    enabled: true,
    width: 468,
    height: 60,
    description: 'Non-intrusive, visually balanced banner right above the website footer for added monetization.',
    code: `<script>
  atOptions = {
    'key' : '95a3a992e4ee6f9c6e5013b7eefa0b44',
    'format' : 'iframe',
    'height' : 60,
    'width' : 468,
    'params' : {}
  };
</script>
<script src="https://czernik.org/22/95a3a992e4ee6f9c6e5013b7eefa0b44"></script>`,
  },
  {
    id: 'adst_sidebar_160x300',
    title: 'Vertical Skyscraper Banner (160x300)',
    format: 'banner_160x300',
    placement: 'sidebar',
    enabled: true,
    width: 160,
    height: 300,
    description: 'Sleek vertical skyscraper ad unit ideal for sidebars, leaderboard margins, and desktop desktop borders.',
    code: `<script>
  atOptions = {
    'key' : '396297b4bbf90d1531e767518431bad1',
    'format' : 'iframe',
    'height' : 300,
    'width' : 160,
    'params' : {}
  };
</script>
<script src="https://czernik.org/22/396297b4bbf90d1531e767518431bad1"></script>`,
  },
  {
    id: 'adst_native_banner',
    title: 'Native Content Recommendation Widget',
    format: 'native_banner',
    placement: 'mid_content',
    enabled: true,
    description: 'Blends seamlessly into game cards and lists with high engagement and click-through rates.',
    code: `<script async="async" data-cfasync="false" src="https://czernik.org/21/7ccd7ba14592e4945465757d2208a513"></script>
<div id="container-7ccd7ba14592e4945465757d2208a513"></div>`,
  },
  {
    id: 'adst_social_bar',
    title: 'Social Bar / In-Page Push',
    format: 'social_bar',
    placement: 'global_overlay',
    enabled: true,
    description: 'Interactive push/notification ad format that does not interfere with dice rolling or gameplay.',
    code: `<script data-cfasync="false" src="https://czernik.org/14/d03561cac0ca46d5723022c7ffbe1c43"></script>`,
  },
  {
    id: 'adst_popunder',
    title: 'Popunder High-CPM Trigger',
    format: 'popunder',
    placement: 'global_overlay',
    enabled: true,
    description: 'Opens high-paying background sponsor windows upon natural user interaction.',
    code: `<script data-cfasync="false" src="https://capitalhospitals.org/1/f96912afd7f79f02978c9c9b659d647a"></script>`,
  },
  {
    id: 'adst_direct_link',
    title: 'Smart Direct Link (Smartlink)',
    format: 'direct_link',
    placement: 'smart_link',
    enabled: true,
    description: 'High-earning monetization URL used on Claim Rewards and Special Offer call-to-action buttons.',
    code: `https://budgetezy.org/4/e44752077ce27723c24599dd1147fba1`,
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
          // Check if parsed has all current IDs, otherwise merge
          const existingIds = new Set(parsed.map((p: AdsterraAdSlot) => p.id));
          const merged = [...parsed];
          for (const def of DEFAULT_ADSTERRA_SLOTS) {
            if (!existingIds.has(def.id)) {
              merged.push(def);
            }
          }
          return merged;
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

  public getDirectLinkUrl(): string {
    const directLink = this.getSlot('adst_direct_link');
    if (directLink && directLink.enabled && directLink.code.trim().startsWith('http')) {
      return directLink.code.trim();
    }
    return 'https://budgetezy.org/4/e44752077ce27723c24599dd1147fba1';
  }

  /**
   * Injects or removes global scripts like Popunder and Social Bar when enabled
   */
  private applyGlobalScripts() {
    if (typeof window === 'undefined') return;

    // 1. Popunder script injection
    const popunder = this.getSlot('adst_popunder');
    const existingPopunder = document.getElementById('adsterra-popunder-tag');
    if (popunder && popunder.enabled && popunder.code.trim()) {
      if (!existingPopunder) {
        try {
          const match = popunder.code.match(/src=["'](.*?)["']/);
          if (match && match[1]) {
            const script = document.createElement('script');
            script.id = 'adsterra-popunder-tag';
            script.src = match[1];
            script.setAttribute('data-cfasync', 'false');
            script.async = true;
            document.head.appendChild(script);
          }
        } catch {
          // ignore error
        }
      }
    } else if (existingPopunder) {
      existingPopunder.remove();
    }

    // 2. Social Bar script injection
    const socialBar = this.getSlot('adst_social_bar');
    const existingSocial = document.getElementById('adsterra-socialbar-tag');
    if (socialBar && socialBar.enabled && socialBar.code.trim()) {
      if (!existingSocial) {
        try {
          const match = socialBar.code.match(/src=["'](.*?)["']/);
          if (match && match[1]) {
            const script = document.createElement('script');
            script.id = 'adsterra-socialbar-tag';
            script.src = match[1];
            script.setAttribute('data-cfasync', 'false');
            script.async = true;
            document.head.appendChild(script);
          }
        } catch {
          // ignore error
        }
      }
    } else if (existingSocial) {
      existingSocial.remove();
    }
  }
}

export const adsterraService = new AdsterraService();
