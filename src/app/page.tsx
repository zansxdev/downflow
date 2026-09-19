'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { PlatformChips } from '@/components/PlatformChips';
import { UrlInputBar } from '@/components/UrlInputBar';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { MediaResultCard } from '@/components/MediaResultCard';
import { HistoryDrawer } from '@/components/HistoryDrawer';
import { Footer } from '@/components/Footer';
import { detectPlatform } from '@/lib/url-detector';
import { PlatformId, NormalizedMediaResult, DownloadHistoryItem } from '@/lib/types';
import { DownloadCloud, Sparkles, CheckCircle2, ShieldAlert, Film, Music } from 'lucide-react';

const STORAGE_KEY = 'downflow_history_v1';

export default function HomePage() {
  const [url, setUrl] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId>('auto');
  const [detectedPlatform, setDetectedPlatform] = useState<PlatformId>('auto');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<NormalizedMediaResult | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [history, setHistory] = useState<DownloadHistoryItem[]>([]);

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch {
      // Ignored
    }
  }, []);

  // Auto-detect platform when URL changes
  useEffect(() => {
    if (url.trim()) {
      const detected = detectPlatform(url);
      setDetectedPlatform(detected);
      if (detected !== 'auto') {
        setSelectedPlatform(detected);
      }
    } else {
      setDetectedPlatform('auto');
    }
  }, [url]);

  const saveToHistory = (item: NormalizedMediaResult) => {
    try {
      const newItem: DownloadHistoryItem = {
        id: item.id,
        title: item.title,
        platform: item.platform,
        platformName: item.platformName,
        thumbnail: item.thumbnail,
        authorName: item.author?.name,
        originalUrl: item.originalUrl,
        timestamp: Date.now(),
      };

      const updated = [newItem, ...history.filter((h) => h.originalUrl !== item.originalUrl)].slice(0, 30);
      setHistory(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Storage quota or error
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignored
    }
  };

  const handleSelectHistoryItem = (item: DownloadHistoryItem) => {
    setUrl(item.originalUrl);
    setSelectedPlatform(item.platform);
    setIsHistoryOpen(false);
    handleDownloadMedia(item.originalUrl, item.platform);
  };

  const handleDownloadMedia = async (targetUrl = url, platform = selectedPlatform) => {
    const clean = targetUrl.trim();
    if (!clean) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: clean,
          platform,
        }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok || !json.status) {
        throw new Error(json.message || 'Gagal memproses media dari URL yang diberikan.');
      }

      setResult(json.data);
      saveToHistory(json.data);
    } catch (err: any) {
      setError(err.message || 'Terjadi gangguan saat menghubungkan ke server downloader.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setUrl('');
    setResult(null);
    setError(null);
    setDetectedPlatform('auto');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onOpenHistory={() => setIsHistoryOpen(true)} historyCount={history.length} />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 sm:py-16 flex flex-col items-center">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center space-y-4 max-w-2xl mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111116] border border-[#22222d] text-xs font-mono text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Unduh Cepat Tanpa Watermark</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Unduh Media Bersih, <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Kualitas Maksimal
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-sans">
            Ekstraksi video, audio, dan foto dari TikTok, Instagram, YouTube, X, Facebook, dan Spotify tanpa batasan iklan.
          </p>
        </motion.div>

        {/* Input & Platform Filter Container */}
        <div className="w-full space-y-4 mb-8">
          <UrlInputBar
            url={url}
            onChangeUrl={setUrl}
            detectedPlatform={detectedPlatform}
            isLoading={isLoading}
            onSubmit={() => handleDownloadMedia()}
            onClear={handleReset}
            error={error}
          />

          <PlatformChips
            selectedPlatform={selectedPlatform}
            onSelectPlatform={(p) => {
              setSelectedPlatform(p);
            }}
          />
        </div>

        {/* Dynamic Display Area: Loading / Result / Empty Feature Showcase */}
        <div className="w-full">
          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <LoadingSkeleton />
              </motion.div>
            )}

            {!isLoading && result && (
              <motion.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <MediaResultCard result={result} onReset={handleReset} />
              </motion.div>
            )}

            {!isLoading && !result && (
              <motion.div
                key="empty-guide"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4"
              >
                <div className="p-4 rounded-xl bg-[#0b0b0e] border border-[#1b1b22] space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-[#14141c] border border-[#242432] flex items-center justify-center text-emerald-400">
                    <DownloadCloud className="w-4 h-4" />
                  </div>
                  <h2 className="text-xs font-bold text-zinc-200 uppercase font-mono">Bebas Watermark</h2>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Menyimpan video TikTok dan Reels dalam resolusi HD murni tanpa logo yang mengganggu.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#0b0b0e] border border-[#1b1b22] space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-[#14141c] border border-[#242432] flex items-center justify-center text-cyan-400">
                    <Music className="w-4 h-4" />
                  </div>
                  <h2 className="text-xs font-bold text-zinc-200 uppercase font-mono">Ekstrak Audio MP3</h2>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Ubah video YouTube atau lagu Spotify menjadi file MP3 bitrate tinggi secara otomatis.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#0b0b0e] border border-[#1b1b22] space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-[#14141c] border border-[#242432] flex items-center justify-center text-emerald-400">
                    <Film className="w-4 h-4" />
                  </div>
                  <h2 className="text-xs font-bold text-zinc-200 uppercase font-mono">Multi Format</h2>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Dukungan video HD, foto slide, dan audio dalam satu klik tanpa registrasi.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistory={handleSelectHistoryItem}
        onClearHistory={handleClearHistory}
      />

      <Footer />
    </div>
  );
}
