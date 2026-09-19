'use client';

import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { sounds } from '@/lib/sounds';

export const SoundToggle: React.FC = () => {
  const [muted, setMuted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setMuted(sounds.isMuted());
    const unsub = sounds.subscribe((isMuted) => setMuted(isMuted));
    return () => unsub();
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] opacity-0" />
    );
  }

  const handleToggle = () => {
    sounds.toggleMute();
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`relative flex items-center justify-center w-9 h-9 rounded-xl border transition-all cursor-pointer shadow-sm neo-box ${
        muted
          ? 'bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-[var(--text-primary)]'
          : 'bg-[var(--bg-surface-elevated)] text-[var(--btn-primary-bg)] border-[var(--border-strong)]'
      }`}
      aria-label={muted ? 'Aktifkan Efek Suara SFX' : 'Matikan Efek Suara SFX'}
      title={muted ? 'Efek Suara: Senyap (Klik untuk aktifkan)' : 'Efek Suara: Aktif (Klik untuk senyapkan)'}
    >
      {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
    </button>
  );
};
