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
    <div className="flex flex-col min-h-screen">
      <Navbar onOpenHistory={() => setIsHistoryOpen(true)} historyCount={history.length} />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-10 sm:py-16 flex flex-col items-center">
        {/* Clean Hero Header - No gradients, no sparkle pills */}
        <div className="text-center space-y-3 max-w-xl mb-8">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Universal Media Downloader
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-sans">
            Unduh video, audio, dan foto dari TikTok, Instagram, YouTube, X, Facebook, dan Spotify tanpa iklan.
          </p>
        </div>

        {/* Input & Platform Filter Container */}
        <div className="w-full space-y-3.5 mb-8">
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
        </div>

        {/* Dynamic State Area */}
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
              <div className="text-center text-xs text-zinc-600 font-mono pt-4">
                Tempel link publik di atas untuk memulai ekstraksi media
              </div>
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
