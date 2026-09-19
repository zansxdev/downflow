'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RotateCw,
  Copy,
  ExternalLink,
  Film,
  Music,
  Clock,
  Sparkles,
  Check,
} from 'lucide-react';
import { BatchQueueItem, DownloadOption } from '@/lib/types';
import { sounds } from '@/lib/sounds';

interface BatchQueueViewProps {
  items: BatchQueueItem[];
  onRetryItem: (id: string) => void;
  onClearQueue: () => void;
  isProcessing: boolean;
}

export const BatchQueueView: React.FC<BatchQueueViewProps> = ({
  items,
  onRetryItem,
  onClearQueue,
  isProcessing,
}) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [batchDownloading, setBatchDownloading] = useState(false);

  const completedCount = items.filter((i) => i.status === 'success').length;
  const errorCount = items.filter((i) => i.status === 'error').length;
  const readyItems = items.filter((i) => i.status === 'success' && i.result);

  const handleDownloadSingle = (item: BatchQueueItem, opt: DownloadOption) => {
    sounds.playDownload();
    setDownloadingId(opt.id);
    setTimeout(() => setDownloadingId(null), 2500);

    const link = document.createElement('a');
    link.href = opt.downloadUrl || opt.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('download', `${(item.result?.title || 'media').substring(0, 30)}.${opt.format}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyLink = async (opt: DownloadOption) => {
    try {
      sounds.playPop();
      await navigator.clipboard.writeText(opt.url);
      setCopiedId(opt.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownloadAll = async () => {
    if (readyItems.length === 0 || batchDownloading) return;
    setBatchDownloading(true);
    sounds.playDownload();

    for (let i = 0; i < readyItems.length; i++) {
      const item = readyItems[i];
      const opt = item.result?.downloads?.[0];
      if (opt) {
        const link = document.createElement('a');
        link.href = opt.downloadUrl || opt.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.setAttribute('download', `${(item.result?.title || 'media').substring(0, 30)}.${opt.format}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      // Polite delay between downloads
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    setBatchDownloading(false);
  };

  if (items.length === 0) return null;

  const progressPercent = Math.round((completedCount / items.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-4"
    >
      {/* Batch Header & Summary Card */}
      <div className="w-full bg-[var(--bg-surface)] backdrop-blur-xl border border-[var(--border-subtle)] rounded-2xl p-4 sm:p-5 shadow-[var(--card-shadow)] liquid-glass-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-[var(--text-primary)] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--btn-primary-bg)]" />
              Antrean Batch Downloader
            </h3>
            <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">
              {completedCount} dari {items.length} media berhasil diproses
              {errorCount > 0 && ` (${errorCount} gagal)`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {readyItems.length > 0 && (
              <motion.button
                type="button"
                onClick={handleDownloadAll}
                disabled={batchDownloading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: 'var(--btn-primary-bg)',
                  color: 'var(--btn-primary-text)',
                  border: '1px solid var(--btn-primary-border)',
                  boxShadow: 'var(--btn-primary-shadow)',
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs cursor-pointer disabled:opacity-50 transition-all neo-btn-action"
              >
                {batchDownloading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Mengunduh...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh Semua Siap ({readyItems.length})</span>
                  </>
                )}
              </motion.button>
            )}

            {!isProcessing && (
              <button
                type="button"
                onClick={onClearQueue}
                className="px-3 py-1.5 rounded-xl text-xs font-medium text-[var(--text-secondary)] hover:text-red-400 bg-[var(--bg-surface-elevated)] hover:bg-red-500/10 border border-[var(--border-subtle)] transition-colors cursor-pointer"
              >
                Tutup Antrean
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[var(--bg-surface-elevated)] rounded-full h-1.5 overflow-hidden mt-3">
          <motion.div
            className="h-full bg-[var(--btn-primary-bg)]"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Queue Items List */}
      <div className="space-y-3">
        {items.map((item, index) => {
          const res = item.result;
          const videoOpt = res?.downloads.find((d) => d.format === 'mp4' || d.label.toLowerCase().includes('video'));
          const audioOpt = res?.downloads.find((d) => d.format === 'mp3' || d.label.toLowerCase().includes('audio') || d.label.toLowerCase().includes('mp3'));

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="w-full bg-[var(--bg-surface)] backdrop-blur-xl border border-[var(--border-subtle)] rounded-xl p-3.5 sm:p-4 shadow-sm neo-box flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              {/* Media Info */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span className="font-mono text-[11px] text-[var(--text-muted)] w-5 shrink-0">
                  #{index + 1}
                </span>

                {/* Thumbnail / Status Icon */}
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] shrink-0 overflow-hidden flex items-center justify-center">
                  {item.status === 'processing' ? (
                    <Loader2 className="w-5 h-5 text-[var(--btn-primary-bg)] animate-spin" />
                  ) : item.status === 'error' ? (
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  ) : res?.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={res.thumbnail}
                      alt={res.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Film className="w-5 h-5 text-[var(--text-muted)]" />
                  )}
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium uppercase bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                      {item.platform}
                    </span>

                    {/* Status Badge */}
                    {item.status === 'pending' && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-400 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        Menunggu
                      </span>
                    )}
                    {item.status === 'processing' && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                        <Loader2 className="w-2.5 h-2.5 animate-spin" />
                        Mengambil data...
                      </span>
                    )}
                    {item.status === 'success' && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        Siap Diunduh
                      </span>
                    )}
                    {item.status === 'error' && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-red-500/10 text-red-400 border border-red-500/30 flex items-center gap-1">
                        <AlertCircle className="w-2.5 h-2.5" />
                        Gagal
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-[var(--text-primary)] truncate font-sans">
                    {res?.title || item.url}
                  </p>

                  {item.status === 'error' ? (
                    <p className="text-[11px] text-red-400/90 font-mono truncate">
                      {item.error || 'Gagal memproses media dari URL'}
                    </p>
                  ) : (
                    <p className="text-[11px] text-[var(--text-muted)] font-mono truncate">
                      {res?.author?.name ? `@${res.author.name} • ` : ''}
                      {res?.duration ? `${res.duration} • ` : ''}
                      <span className="opacity-70">{item.url}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons for this item */}
              <div className="flex items-center gap-1.5 shrink-0 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-[var(--border-subtle)]">
                {item.status === 'success' && res && (
                  <>
                    {videoOpt && (
                      <button
                        type="button"
                        onClick={() => handleDownloadSingle(item, videoOpt)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[var(--btn-primary-text)] bg-[var(--btn-primary-bg)] border border-[var(--btn-primary-border)] hover:opacity-90 transition-all cursor-pointer neo-btn-action"
                        title="Unduh Video"
                      >
                        <Download className="w-3 h-3" />
                        <span>Video HD</span>
                      </button>
                    )}

                    {audioOpt && (
                      <button
                        type="button"
                        onClick={() => handleDownloadSingle(item, audioOpt)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--chip-active-bg)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
                        title="Unduh Audio MP3"
                      >
                        <Music className="w-3 h-3" />
                        <span>MP3</span>
                      </button>
                    )}

                    {res.downloads[0] && (
                      <button
                        type="button"
                        onClick={() => handleCopyLink(res.downloads[0])}
                        className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
                        title="Salin Link Download"
                      >
                        {copiedId === res.downloads[0].id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </>
                )}

                {item.status === 'error' && (
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playPop();
                      onRetryItem(item.id);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
                  >
                    <RotateCw className="w-3 h-3" />
                    <span>Coba Lagi</span>
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
