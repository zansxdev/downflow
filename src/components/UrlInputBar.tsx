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
      <div className="relative flex items-center bg-[#0c0c10] border border-[#222228] focus-within:border-zinc-500 rounded-xl p-2 transition-colors">
        <div className="pl-2 pr-1 text-zinc-500 flex items-center">
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
          className="w-full bg-transparent px-2.5 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none disabled:opacity-50 font-sans"
          aria-label="Input URL Media"
        />

        <div className="flex items-center gap-1.5">
          <AnimatePresence>
            {detectedPlatform !== 'auto' && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-zinc-800 text-zinc-300 border border-zinc-700"
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
              className="p-1.5 rounded text-zinc-400 hover:text-zinc-100 hover:bg-[#1c1c24] transition-colors cursor-pointer"
              title="Hapus input"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePaste}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium text-zinc-400 hover:text-zinc-200 bg-[#14141a] hover:bg-[#1a1a22] border border-[#22222a] transition-colors cursor-pointer"
              title="Tempel dari Clipboard"
            >
              <Clipboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-mono">Tempel</span>
            </button>
          )}

          <button
            type="button"
            onClick={onSubmit}
            disabled={isLoading || !url.trim()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-xs text-black bg-white hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-600 transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span className="hidden sm:inline">Memproses</span>
              </>
            ) : (
              <>
                <span>Unduh</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-2.5 px-3 py-2 rounded-lg bg-[#1a1114] border border-red-900/50 text-red-400 text-xs font-medium flex items-center justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={onClear}
            className="text-red-400/80 hover:text-red-200 text-xs underline cursor-pointer ml-3"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
};
