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
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0c0c10] border-l border-[#202026] z-50 p-4 sm:p-6 flex flex-col justify-between shadow-2xl overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#1c1c24]">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-zinc-400" />
                  <h3 className="font-bold text-sm text-zinc-100 font-sans">
                    Riwayat Unduhan
                  </h3>
                  <span className="text-[10px] font-mono bg-[#16161f] text-zinc-400 px-2 py-0.5 rounded border border-[#242430]">
                    {history.length}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-[#181822] transition-colors cursor-pointer"
                  aria-label="Tutup Riwayat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 overflow-y-auto max-h-[calc(100vh-160px)] space-y-2 pr-1">
                {history.length === 0 ? (
                  <div className="py-16 text-center text-zinc-500 space-y-2">
                    <p className="text-xs font-mono">Belum ada riwayat unduhan.</p>
                  </div>
                ) : (
                  history.map((item) => (
                    <div
                      key={item.id}
                      className="group flex items-center justify-between p-2.5 rounded-lg bg-[#111116] border border-[#1e1e24] hover:border-zinc-700 transition-colors"
                    >
                      <div
                        onClick={() => onSelectHistory(item)}
                        className="flex items-center gap-3 cursor-pointer min-w-0 flex-1"
                      >
                        <div className="w-12 h-12 rounded bg-[#16161e] border border-[#22222d] shrink-0 overflow-hidden flex items-center justify-center">
                          {item.thumbnail ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.thumbnail}
                              alt={item.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Film className="w-4 h-4 text-zinc-600" />
                          )}
                        </div>

                        <div className="min-w-0 pr-2">
                          <p className="text-xs font-medium text-zinc-200 truncate group-hover:text-white transition-colors">
                            {item.title}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5 text-[10px] font-mono text-zinc-500">
                            <span className="text-zinc-400 uppercase font-semibold">
                              {item.platformName}
                            </span>
                            <span>•</span>
                            <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <a
                        href={item.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
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
              <div className="pt-4 border-t border-[#1c1c24]">
                <button
                  type="button"
                  onClick={onClearHistory}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-4 rounded text-xs font-medium text-zinc-400 hover:text-red-400 bg-[#16161f] hover:bg-red-950/20 border border-[#242430] hover:border-red-900/30 transition-colors cursor-pointer"
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
