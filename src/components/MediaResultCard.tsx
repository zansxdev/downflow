'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Copy,
  Check,
  Film,
  Music,
  Image as ImageIcon,
  ExternalLink,
  User,
  Clock,
  Sparkles,
  Share2,
} from 'lucide-react';
import { NormalizedMediaResult, DownloadOption } from '@/lib/types';

interface MediaResultCardProps {
  result: NormalizedMediaResult;
  onReset: () => void;
}

export const MediaResultCard: React.FC<MediaResultCardProps> = ({ result, onReset }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(
    result.images && result.images.length > 0 ? result.images[0] : null
  );

  const handleCopyLink = async (opt: DownloadOption) => {
    try {
      await navigator.clipboard.writeText(opt.url);
      setCopiedId(opt.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownload = (opt: DownloadOption) => {
    setDownloadingId(opt.id);
    setTimeout(() => setDownloadingId(null), 3000);

    // Trigger direct download via window.open or anchor
    const link = document.createElement('a');
    link.href = opt.downloadUrl || opt.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('download', `${result.title.substring(0, 30)}.${opt.format}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.98 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full bg-[#0b0b0f] border border-[#20202a] rounded-2xl p-5 sm:p-7 shadow-2xl space-y-6"
    >
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row gap-5">
        {/* Media Thumbnail / Preview */}
        <div className="relative w-full sm:w-56 h-48 sm:h-56 bg-[#121217] rounded-xl overflow-hidden border border-[#23232f] shrink-0 flex items-center justify-center group">
          {previewImage || result.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewImage || result.thumbnail}
              alt={result.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-zinc-600">
              <Film className="w-10 h-10" />
              <span className="text-xs font-mono">Pratinjau Media</span>
            </div>
          )}

          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-sm border border-white/10 text-[10px] font-mono font-bold text-white uppercase tracking-wider">
            {result.platformName}
          </div>

          {result.duration && (
            <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-sm border border-white/10 text-[10px] font-mono text-zinc-300 flex items-center gap-1">
              <Clock className="w-3 h-3 text-emerald-400" />
              <span>{result.duration}</span>
            </div>
          )}
        </div>

        {/* Content Details */}
        <div className="flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-zinc-100 line-clamp-3 leading-snug">
              {result.title}
            </h2>

            {result.author && (result.author.name || result.author.username) && (
              <div className="flex items-center gap-2 text-xs text-zinc-400 font-sans">
                {result.author.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={result.author.avatar}
                    alt={result.author.name || 'Author'}
                    className="w-5 h-5 rounded-full object-cover border border-[#2a2a35]"
                  />
                ) : (
                  <User className="w-4 h-4 text-zinc-500" />
                )}
                <span className="font-medium text-zinc-200">{result.author.name}</span>
                {result.author.username && (
                  <span className="text-zinc-500 font-mono">@{result.author.username}</span>
                )}
              </div>
            )}
          </div>

          {/* If there are slide images, display a small gallery picker */}
          {result.images && result.images.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-mono text-zinc-400">
                Pilih Foto Slide ({result.images.length} foto):
              </span>
              <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
                {result.images.map((imgUrl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPreviewImage(imgUrl)}
                    className={`relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border transition-all cursor-pointer ${
                      previewImage === imgUrl
                        ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                        : 'border-[#22222d] opacity-70 hover:opacity-100'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imgUrl} alt={`Slide ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick source link */}
          <div className="pt-2 flex items-center justify-between border-t border-[#1a1a24]">
            <a
              href={result.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 font-mono transition-colors"
            >
              <span>Buka sumber asli</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={onReset}
              className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              Unduh link lain
            </button>
          </div>
        </div>
      </div>

      {/* Download Action List */}
      <div className="space-y-2.5 pt-2 border-t border-[#181822]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
            Pilihan Format Unduhan
          </span>
          <span className="text-[11px] font-mono text-emerald-400">
            {result.downloads.length} format tersedia
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {result.downloads.map((opt) => {
            const isCopied = copiedId === opt.id;
            const isDownloading = downloadingId === opt.id;

            return (
              <div
                key={opt.id}
                className="flex items-center justify-between p-3 rounded-xl bg-[#111116] border border-[#20202b] hover:border-[#2e2e3d] transition-all"
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <div className="w-8 h-8 rounded-lg bg-[#181822] border border-[#272735] flex items-center justify-center shrink-0">
                    {opt.format === 'mp3' ? (
                      <Music className="w-4 h-4 text-emerald-400" />
                    ) : opt.format === 'jpg' ? (
                      <ImageIcon className="w-4 h-4 text-cyan-400" />
                    ) : (
                      <Film className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-zinc-200 truncate">{opt.label}</p>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500">
                      <span className="uppercase text-zinc-400 font-bold">{opt.format}</span>
                      {opt.quality && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-400/90">{opt.quality}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopyLink(opt)}
                    className="p-2 rounded-lg text-zinc-400 hover:text-white bg-[#181822] hover:bg-[#20202e] border border-[#252533] transition-colors cursor-pointer"
                    title="Salin tautan langsung"
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownload(opt)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-black bg-emerald-400 hover:bg-emerald-300 transition-all cursor-pointer shadow-md shadow-emerald-950/20"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isDownloading ? 'Membuka...' : 'Unduh'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
