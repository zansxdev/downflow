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
      // Storage quota
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
        headers: {
          'Content-Type': 'application/json',
          'x-client-flow': 'downflow-web-v1',
        },
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
      setError(err.message || 'Terjadi gangguan saat menghubungkan ke server.');
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
    <div className="relative flex flex-col min-h-screen">
      <Navbar onOpenHistory={() => setIsHistoryOpen(true)} historyCount={history.length} />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-6 sm:py-14 flex flex-col items-center z-10">
        {/* Animated Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 140 }}
          className="text-center space-y-2.5 max-w-2xl mb-6 sm:mb-8"
        >
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="font-display text-[26px] sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.15] px-1"
          >
            Universal Media Downloader
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-xs sm:text-sm md:text-base text-zinc-400 leading-relaxed font-sans px-2"
          >
            Unduh video, audio, dan foto dari TikTok, Instagram, YouTube, X, Facebook, dan Spotify tanpa iklan.
          </motion.p>
        </motion.div>

        {/* Input & Animated Platform Chips Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.45 }}
          className="w-full space-y-3.5 mb-8"
        >
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
            onSelectPlatform={(p) => setSelectedPlatform(p)}
          />
        </motion.div>

        {/* Dynamic Animated Display Area */}
        <div className="w-full">
          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
              >
                <LoadingSkeleton />
              </motion.div>
            )}

            {!isLoading && result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
              >
                <MediaResultCard result={result} onReset={handleReset} />
              </motion.div>
            )}

            {!isLoading && !result && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center text-xs text-zinc-500 font-mono pt-4"
              >
                Tempel link publik di atas untuk memulai ekstraksi media
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Invisible Honeypot Trap for automated crawlers & scrapers */}
        <div className="hidden" aria-hidden="true">
          <a href="/api/v1/secret-admin-leak" rel="nofollow" tabIndex={-1}>
            Admin Secret Token Leak
          </a>
          <a href="/api/v1/free-api-key" rel="nofollow" tabIndex={-1}>
            Free DownFlow API Key Generator
          </a>
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
