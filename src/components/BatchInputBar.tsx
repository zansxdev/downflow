'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Clipboard, Trash2, ArrowRight, Layers, AlertCircle, CheckCircle2 } from 'lucide-react';
import { detectPlatform, PLATFORMS } from '@/lib/url-detector';
import { PlatformId } from '@/lib/types';
import { sounds } from '@/lib/sounds';

interface BatchInputBarProps {
  onStartBatch: (urls: string[]) => void;
  isProcessing: boolean;
}

export const BatchInputBar: React.FC<BatchInputBarProps> = ({
  onStartBatch,
  isProcessing,
}) => {
  const [rawText, setRawText] = useState('');

  // Parse lines and extract valid URLs
  const parsedUrls = useMemo(() => {
    const lines = rawText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const validUrls: { url: string; platform: PlatformId }[] = [];
    const seen = new Set<string>();

    for (const line of lines) {
      // Find URLs in line
      const match = line.match(/https?:\/\/[^\s]+/i);
      if (match) {
        const cleanUrl = match[0];
        if (!seen.has(cleanUrl)) {
          seen.add(cleanUrl);
          const platform = detectPlatform(cleanUrl);
          validUrls.push({ url: cleanUrl, platform });
        }
      }
    }

    return validUrls.slice(0, 10); // Max 10 URLs in batch
  }, [rawText]);

  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          sounds.playPop();
          setRawText((prev) => (prev ? `${prev}\n${text}` : text));
        }
      }
    } catch {
      // Clipboard unavailable
    }
  };

  const handleClear = () => {
    sounds.playTrash();
    setRawText('');
  };

  const handleSubmit = () => {
    if (parsedUrls.length === 0 || isProcessing) return;
    sounds.playPop();
    onStartBatch(parsedUrls.map((p) => p.url));
  };

  return (
    <div className="w-full space-y-3">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-[var(--bg-surface)] backdrop-blur-xl border border-[var(--border-subtle)] focus-within:border-[var(--border-strong)] rounded-2xl p-3.5 sm:p-4 transition-all shadow-[var(--card-shadow)] space-y-3 liquid-glass-card"
      >
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[var(--btn-primary-bg)]" />
            <span className="font-bold text-xs sm:text-sm text-[var(--text-primary)] font-sans">
              Batch Downloader
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
              Maks 10 URL
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePaste}
              disabled={isProcessing}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--chip-active-bg)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
              title="Tempel dari Clipboard"
            >
              <Clipboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-mono text-[11px]">Tempel</span>
            </button>

            {rawText && (
              <button
                type="button"
                onClick={handleClear}
                disabled={isProcessing}
                className="p-1 rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                title="Bersihkan Semua"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Textarea for Multi URLs */}
        <div className="relative">
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            disabled={isProcessing}
            rows={4}
            placeholder={`Tempel beberapa link sekaligus (1 link per baris):\nhttps://www.tiktok.com/@user/video/...\nhttps://www.instagram.com/p/...\nhttps://open.spotify.com/track/...`}
            className="w-full bg-transparent p-2 text-xs sm:text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] font-mono focus:outline-none resize-y min-h-[90px] max-h-[220px]"
          />
        </div>

        {/* Detected URLs Chip Summary */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--border-subtle)] text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            {parsedUrls.length > 0 ? (
              <>
                <span className="inline-flex items-center gap-1 font-mono font-medium text-emerald-400 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {parsedUrls.length} Link Terdeteksi:
                </span>
                <div className="flex items-center gap-1 flex-wrap">
                  {parsedUrls.map((p, idx) => {
                    const info = PLATFORMS.find((plat) => plat.id === p.platform);
                    return (
                      <span
                        key={idx}
                        className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)]"
                      >
                        {info ? info.name : 'Web'}
                      </span>
                    );
                  })}
                </div>
              </>
            ) : (
              <span className="inline-flex items-center gap-1 text-[var(--text-muted)] text-[11px]">
                <AlertCircle className="w-3.5 h-3.5" />
                Masukkan satu atau beberapa link media (TikTok, IG, YouTube, Spotify, dll)
              </span>
            )}
          </div>

          <motion.button
            type="button"
            onClick={handleSubmit}
            disabled={isProcessing || parsedUrls.length === 0}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: 'var(--btn-primary-bg)',
              color: 'var(--btn-primary-text)',
              border: '1px solid var(--btn-primary-border)',
              boxShadow: 'var(--btn-primary-shadow)',
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2 rounded-xl font-bold text-xs hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer neo-btn-action"
          >
            <span>Proses Antrean ({parsedUrls.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
