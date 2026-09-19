'use client';

import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Clipboard, X, Link2, Sparkles, Loader2 } from 'lucide-react';
import { PlatformId } from '@/lib/types';
import { PLATFORMS } from '@/lib/url-detector';

interface UrlInputBarProps {
  url: string;
  onChangeUrl: (val: string) => void;
  detectedPlatform: PlatformId;
  isLoading: boolean;
  onSubmit: () => void;
  onClear: () => void;
  error?: string | null;
}

export const UrlInputBar: React.FC<UrlInputBarProps> = ({
  url,
  onChangeUrl,
  detectedPlatform,
  isLoading,
  onSubmit,
  onClear,
  error,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          onChangeUrl(text);
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }
      }
    } catch {
      // Clipboard permissions denied or not supported in this context
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const currentPlatformObj = PLATFORMS.find((p) => p.id === detectedPlatform);

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative group"
      >
        <div className="relative flex items-center bg-[#0a0a0d] border border-[#22222b] group-focus-within:border-emerald-500/60 rounded-2xl p-2 sm:p-2.5 transition-all shadow-2xl shadow-black">
          <div className="pl-2 pr-1 text-zinc-500 flex items-center">
            <Link2 className="w-5 h-5" />
          </div>

          <input
            ref={inputRef}
            type="url"
            value={url}
            onChange={(e) => onChangeUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isLoading && url.trim()) {
                onSubmit();
              }
            }}
            placeholder={
              currentPlatformObj && currentPlatformObj.id !== 'auto'
                ? currentPlatformObj.placeholder
                : 'Tempel link video TikTok, IG Reels, YouTube, X, atau Spotify...'
            }
            disabled={isLoading}
            className="w-full bg-transparent px-2 sm:px-3 py-2 text-sm sm:text-base text-zinc-100 placeholder:text-zinc-600 focus:outline-none disabled:opacity-50 font-sans"
            aria-label="Input URL Media"
          />

          <div className="flex items-center gap-1.5 sm:gap-2">
            <AnimatePresence>
              {detectedPlatform !== 'auto' && (
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                >
                  {detectedPlatform.toUpperCase()}
                </motion.span>
              )}
            </AnimatePresence>

            {url ? (
              <button
                type="button"
                onClick={onClear}
                disabled={isLoading}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-[#181822] transition-colors cursor-pointer"
                title="Hapus input"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePaste}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-200 bg-[#121217] hover:bg-[#181822] border border-[#23232e] transition-colors cursor-pointer"
                title="Tempel dari Clipboard"
              >
                <Clipboard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline font-mono">Tempel</span>
              </button>
            )}

            <motion.button
              type="button"
              onClick={onSubmit}
              disabled={isLoading || !url.trim()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-black bg-emerald-400 hover:bg-emerald-300 disabled:bg-zinc-800 disabled:text-zinc-600 transition-colors shadow-lg shadow-emerald-950/40 cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                  <span className="hidden sm:inline text-zinc-300">Memproses...</span>
                </>
              ) : (
                <>
                  <span>Ambil</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2.5 px-3 py-2 rounded-lg bg-red-950/30 border border-red-900/40 text-red-400 text-xs font-medium flex items-center justify-between"
          >
            <span>{error}</span>
            <button
              type="button"
              onClick={onClear}
              className="text-red-400/80 hover:text-red-200 text-xs underline cursor-pointer ml-3"
            >
              Reset
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
