'use client';

import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Clipboard, X, Link2, Loader2 } from 'lucide-react';
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
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const currentPlatformObj = PLATFORMS.find((p) => p.id === detectedPlatform);

  return (
    <div className="w-full">
      <motion.div
        animate={{ scale: isLoading ? 0.99 : 1 }}
        transition={{ duration: 0.2 }}
        className="relative flex flex-col sm:flex-row sm:items-center bg-[#0c0c10]/95 backdrop-blur-md border border-[#24242c] focus-within:border-zinc-400 rounded-xl p-2 sm:p-2.5 transition-colors shadow-xl gap-2 sm:gap-1.5 w-full max-w-full overflow-hidden"
      >
        <div className="flex items-center flex-1 min-w-0">
          <div className="pl-2 pr-1 text-zinc-500 flex items-center shrink-0">
            <Link2 className="w-4 h-4" />
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
                : 'Tempel link video atau audio di sini...'
            }
            disabled={isLoading}
            className="flex-1 min-w-0 bg-transparent px-2.5 py-2.5 sm:py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none disabled:opacity-50 font-sans"
            aria-label="Input URL Media"
          />

          <div className="flex items-center gap-1 shrink-0 pr-1">
            <AnimatePresence>
              {detectedPlatform !== 'auto' && (
                <motion.span
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-zinc-800 text-zinc-300 border border-zinc-700"
                >
                  {detectedPlatform.toUpperCase()}
                </motion.span>
              )}
            </AnimatePresence>

            {url ? (
              <motion.button
                type="button"
                onClick={onClear}
                disabled={isLoading}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 sm:p-1.5 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-[#1c1c24] transition-colors cursor-pointer"
                title="Hapus input"
              >
                <X className="w-4 h-4" />
              </motion.button>
            ) : (
              <motion.button
                type="button"
                onClick={handlePaste}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-zinc-400 hover:text-zinc-200 bg-[#14141a] hover:bg-[#1a1a22] border border-[#22222a] transition-colors cursor-pointer"
                title="Tempel dari Clipboard"
              >
                <Clipboard className="w-3.5 h-3.5" />
                <span className="font-mono text-[11px]">Tempel</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Action Button: Full width on mobile, inline on desktop */}
        <div className="flex items-center sm:shrink-0 w-full sm:w-auto">
          <motion.button
            type="button"
            onClick={onSubmit}
            disabled={isLoading || !url.trim()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 sm:py-2 rounded-lg font-semibold text-xs text-black bg-white hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-600 transition-colors cursor-pointer disabled:cursor-not-allowed shadow-md min-h-[42px] sm:min-h-0"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <span>Unduh Media</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2.5 px-3 py-2 rounded-lg bg-[#1a1114] border border-red-900/50 text-red-400 text-xs font-medium flex items-center justify-between"
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
    </div>
  );
};
