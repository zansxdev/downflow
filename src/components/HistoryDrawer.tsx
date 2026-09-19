'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ExternalLink, Clock, Film } from 'lucide-react';
import { DownloadHistoryItem } from '@/lib/types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: DownloadHistoryItem[];
  onSelectHistory: (item: DownloadHistoryItem) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectHistory,
  onClearHistory,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-50 cursor-pointer"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 240 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[var(--bg-surface)] backdrop-blur-2xl border-l border-[var(--border-subtle)] z-50 p-4 sm:p-6 flex flex-col justify-between shadow-2xl overflow-hidden liquid-glass-card"
          >
            <div>
              <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[var(--text-secondary)]" />
                  <h3 className="font-bold text-sm text-[var(--text-primary)] font-sans">
                    Riwayat Unduhan
                  </h3>
                  <span className="text-[10px] font-mono bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] px-2 py-0.5 rounded-md border border-[var(--border-subtle)]">
                    {history.length}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors cursor-pointer"
                  aria-label="Tutup Riwayat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 overflow-y-auto max-h-[calc(100vh-160px)] space-y-2 pr-1">
                {history.length === 0 ? (
                  <div className="py-16 text-center text-[var(--text-muted)] space-y-2">
                    <p className="text-xs font-mono">Belum ada riwayat unduhan.</p>
                  </div>
                ) : (
                  history.map((item) => (
                    <div
                      key={item.id}
                      className="group flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-colors neo-box"
                    >
                      <div
                        onClick={() => onSelectHistory(item)}
                        className="flex items-center gap-3 cursor-pointer min-w-0 flex-1"
                      >
                        <div className="w-12 h-12 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] shrink-0 overflow-hidden flex items-center justify-center neo-box">
                          {item.thumbnail ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.thumbnail}
                              alt={item.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Film className="w-4 h-4 text-[var(--text-muted)]" />
                          )}
                        </div>

                        <div className="min-w-0 pr-2">
                          <p className="text-xs font-medium text-[var(--text-primary)] truncate group-hover:opacity-80 transition-opacity">
                            {item.title}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5 text-[10px] font-mono text-[var(--text-muted)]">
                            <span className="text-[var(--text-secondary)] uppercase font-semibold">
                              {item.platformName}
                            </span>
                            {item.authorName && (
                              <>
                                <span>•</span>
                                <span className="truncate">{item.authorName}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <a
                        href={item.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                        title="Buka link asli"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ))
                )}
              </div>
            </div>

            {history.length > 0 && (
              <div className="pt-4 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={onClearHistory}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl text-xs font-medium text-[var(--text-secondary)] hover:text-red-400 bg-[var(--bg-surface-elevated)] hover:bg-red-500/10 border border-[var(--border-subtle)] hover:border-red-500/30 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Bersihkan Riwayat</span>
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
