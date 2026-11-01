'use client';

import { useEffect } from 'react';

export const ConsolePrank: React.FC = () => {
  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;

    const banner = String.raw`
  ██████╗  ██████╗ ██╗    ██╗███╗   ██╗███████╗██╗      ██████╗ ██╗    ██╗
  ██╔══██╗██╔═══██╗██║    ██║████╗  ██║██╔════╝██║     ██╔═══██╗██║    ██║
  ██║  ██║██║   ██║██║ █╗ ██║██╔██╗ ██║█████╗  ██║     ██║   ██║██║ █╗ ██║
  ██║  ██║██║   ██║██║███╗██║██║╚██╗██║██╔══╝  ██║     ██║   ██║██║███╗██║
  ██████╔╝╚██████╔╝╚███╔███╔╝██║ ╚████║██║     ███████╗╚██████╔╝╚███╔███╔╝
  ╚═════╝  ╚═════╝  ╚══╝╚══╝ ╚═╝  ╚═══╝╚═╝     ╚══════╝ ╚═════╝  ╚══╝╚══╝ 
    `;

    console.log(`%c${banner}`, 'color: #38bdf8; font-family: monospace; font-weight: bold;');
    console.log(
      '%c⚠️ STOP! NGAPAIN BUKA DEVTOOLS / CONSOLE BANG? WKWKWK! 😂',
      'background: #dc2626; color: white; font-size: 14px; font-weight: bold; padding: 6px 14px; border-radius: 6px;'
    );
    console.log(
      '%c👀 Mau nyari endpoint API downloader ya? Bikin sendiri lah dek jangan modal copy-paste doang wkwk.',
      'color: #facc15; font-size: 13px; font-weight: 600; padding: 4px 0;'
    );
    console.log(
      '%c💡 Kalau butuh bantuan atau mau izin, sungkem & follow dulu author-nya:\n👉 GitHub: https://github.com/zansxdev\n👉 Instagram: @zansxart\n👉 TikTok: @zansxart',
      'color: #a1a1aa; font-size: 12px; font-family: monospace;'
    );
    console.log(
      '%c[Honeypot Hint] Secret Admin Key: zansx_jangan_dicolong_tolol_69420 (JANGAN DIPAKE YA BJIR!)',
      'color: #10b981; font-size: 11px; font-style: italic;'
    );
  }, []);

  return null;
};
