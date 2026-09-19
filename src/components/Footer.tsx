'use client';

import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full max-w-4xl mx-auto px-4 py-8 border-t border-[#18181f] text-xs text-zinc-600 font-mono flex flex-col sm:flex-row items-center justify-between gap-2 relative z-10">
      <span className="text-zinc-500">DownFlow Media Extractor</span>
      <span className="text-zinc-600">Gunakan untuk konten publik dan penggunaan pribadi</span>
    </footer>
  );
};
