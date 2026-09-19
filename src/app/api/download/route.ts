import { NextRequest, NextResponse } from 'next/server';
import { detectPlatform, extractUrl } from '@/lib/url-detector';
import { NormalizedMediaResult, PlatformId, DownloadOption } from '@/lib/types';

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:3050';
const BACKEND_KEY = process.env.BACKEND_API_KEY || 'downflow_internal_secret_2026';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    let rawUrl = String(body.url || '').trim();
    let requestedPlatform = (body.platform || 'auto') as PlatformId;

    if (!rawUrl) {
      return NextResponse.json(
        { status: false, message: 'URL target tidak boleh kosong.' },
        { status: 400 }
      );
    }

    const cleanUrl = extractUrl(rawUrl);
    const platform = requestedPlatform === 'auto' ? detectPlatform(cleanUrl) : requestedPlatform;

    if (platform === 'auto') {
      return NextResponse.json(
        { status: false, message: 'Platform tidak dikenali. Masukkan link TikTok, Instagram, YouTube, X, Facebook, atau Spotify yang valid.' },
        { status: 400 }
      );
    }

    let endpoint = '';
    let method: 'GET' | 'POST' = 'POST';
    let requestPayload: any = { url: cleanUrl };

    switch (platform) {
      case 'tiktok':
        endpoint = '/api/download/tiktok';
        method = 'POST';
        requestPayload = { url: cleanUrl };
        break;

      case 'instagram':
        endpoint = '/api/download/instagram';
        method = 'POST';
        requestPayload = { url: cleanUrl };
        break;

      case 'youtube':
        endpoint = '/api/download/ytmp4';
        method = 'GET';
        // Use preview=true to inspect metadata first
        break;

      case 'twitter':
        endpoint = '/api/download/twitter';
        method = 'POST';
        requestPayload = { url: cleanUrl };
        break;

      case 'facebook':
        endpoint = '/api/download/facebook';
        method = 'POST';
        requestPayload = { url: cleanUrl };
        break;

      case 'spotify':
        endpoint = '/api/download/spotify';
        method = 'GET';
        break;

      case 'soundcloud':
        endpoint = '/api/download/soundcloud';
        method = 'GET';
        break;

      case 'capcut':
        endpoint = '/api/download/capcut';
        method = 'POST';
        requestPayload = { url: cleanUrl };
        break;

      case 'threads':
        endpoint = '/api/download/threads';
        method = 'POST';
        requestPayload = { url: cleanUrl };
        break;

      case 'pinterest':
        endpoint = '/api/download/pindl';
        method = 'GET';
        break;

      default:
        endpoint = '/api/download/aio';
        method = 'GET';
    }

    const fetchUrl = new URL(endpoint, BACKEND_URL);
    if (method === 'GET') {
      fetchUrl.searchParams.set('url', cleanUrl);
      if (platform === 'youtube') {
        fetchUrl.searchParams.set('preview', 'true');
      }
    }

    const headers: Record<string, string> = {
      'X-API-Key': BACKEND_KEY,
      'Accept': 'application/json',
    };

    if (method === 'POST') {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(fetchUrl.toString(), {
      method,
      headers,
      body: method === 'POST' ? JSON.stringify(requestPayload) : undefined,
      cache: 'no-store',
    });

    const data = await response.json().catch(() => null);

    if (!response.ok || !data || data.status === false) {
      const errorMsg = data?.message || `Gagal mengambil media dari ${platform}. Pastikan link publik dan dapat diakses.`;
      return NextResponse.json({ status: false, message: errorMsg }, { status: response.status || 500 });
    }

    // Normalize response according to platform
    const normalized = normalizeResult(platform, cleanUrl, data);

    return NextResponse.json({
      status: true,
      data: normalized,
    });
  } catch (err: any) {
    console.error('Downloader API error:', err);
    return NextResponse.json(
      { status: false, message: err.message || 'Terjadi kesalahan saat memproses link download.' },
      { status: 500 }
    );
  }
}

function normalizeResult(platform: PlatformId, originalUrl: string, raw: any): NormalizedMediaResult {
  const payload = raw.data || raw.result || raw;
  const downloads: DownloadOption[] = [];

  let title = payload.title || payload.caption || payload.desc || 'Media Download';
  let thumbnail = payload.thumbnail || payload.cover || payload.thumb || '';
  let author = {
    name: payload.author?.name || payload.author?.nickname || payload.uploader || 'Creator',
    username: payload.author?.username || payload.author?.unique_id || '',
    avatar: payload.author?.avatar || payload.author?.avatar_thumb?.url_list?.[0] || '',
  };
  let duration = payload.duration ? `${payload.duration}s` : undefined;
  let images: string[] = [];

  if (platform === 'tiktok') {
    if (payload.video) {
      downloads.push({
        id: 'tt-video-nowm',
        label: 'Video Tanpa Watermark',
        format: 'mp4',
        quality: 'HD',
        url: payload.video,
        downloadUrl: payload.video,
      });
    }
    if (payload.audio) {
      downloads.push({
        id: 'tt-audio',
        label: 'Audio Musik (MP3)',
        format: 'mp3',
        url: payload.audio,
        downloadUrl: payload.audio,
      });
    }
    if (payload.images && Array.isArray(payload.images) && payload.images.length > 0) {
      images = payload.images;
      payload.images.forEach((imgUrl: string, idx: number) => {
        downloads.push({
          id: `tt-image-${idx + 1}`,
          label: `Foto Slide #${idx + 1}`,
          format: 'jpg',
          url: imgUrl,
          downloadUrl: imgUrl,
        });
      });
    }
  } else if (platform === 'instagram') {
    const list = Array.isArray(payload) ? payload : [payload];
    list.forEach((item: any, idx: number) => {
      const mediaUrl = item.url || item.download_url || item.video || item.image || item;
      const isVideo = item.type === 'video' || (typeof mediaUrl === 'string' && (mediaUrl.includes('.mp4') || mediaUrl.includes('video')));
      
      downloads.push({
        id: `ig-media-${idx + 1}`,
        label: isVideo ? `Video Reels / Post #${idx + 1}` : `Foto Instagram #${idx + 1}`,
        format: isVideo ? 'mp4' : 'jpg',
        quality: 'Original HD',
        url: mediaUrl,
        downloadUrl: mediaUrl,
      });
      if (!thumbnail && !isVideo) {
        thumbnail = mediaUrl;
      }
    });
  } else if (platform === 'youtube') {
    // YouTube proxy link directly using our REST backend streaming endpoint
    const ytMp4Url = `/api/download/proxy?type=ytmp4&url=${encodeURIComponent(originalUrl)}`;
    const ytMp3Url = `/api/download/proxy?type=ytmp3&url=${encodeURIComponent(originalUrl)}`;

    downloads.push({
      id: 'yt-video-mp4',
      label: 'Video MP4',
      format: 'mp4',
      quality: '720p HD',
      url: ytMp4Url,
      downloadUrl: ytMp4Url,
      isStream: true,
    });

    downloads.push({
      id: 'yt-audio-mp3',
      label: 'Audio MP3',
      format: 'mp3',
      quality: 'HQ 320kbps',
      url: ytMp3Url,
      downloadUrl: ytMp3Url,
      isStream: true,
    });
  } else if (platform === 'twitter') {
    if (Array.isArray(payload)) {
      payload.forEach((v: any, idx: number) => {
        downloads.push({
          id: `tw-video-${idx + 1}`,
          label: v.quality ? `Video (${v.quality})` : `Video MP4 #${idx + 1}`,
          format: 'mp4',
          quality: v.quality || 'HD',
          url: v.url || v,
          downloadUrl: v.url || v,
        });
      });
    } else if (payload.url || payload.video) {
      downloads.push({
        id: 'tw-video',
        label: 'Video Twitter / X',
        format: 'mp4',
        quality: 'HD',
        url: payload.url || payload.video,
        downloadUrl: payload.url || payload.video,
      });
    }
  } else if (platform === 'facebook') {
    if (payload.hd || payload.video_hd) {
      downloads.push({
        id: 'fb-video-hd',
        label: 'Video Facebook HD',
        format: 'mp4',
        quality: '1080p HD',
        url: payload.hd || payload.video_hd,
        downloadUrl: payload.hd || payload.video_hd,
      });
    }
    if (payload.sd || payload.video_sd) {
      downloads.push({
        id: 'fb-video-sd',
        label: 'Video Facebook SD',
        format: 'mp4',
        quality: 'SD Standard',
        url: payload.sd || payload.video_sd,
        downloadUrl: payload.sd || payload.video_sd,
      });
    }
  } else if (platform === 'spotify') {
    if (payload.download || payload.url || payload.audio) {
      downloads.push({
        id: 'sp-audio-mp3',
        label: 'Audio Spotify (MP3)',
        format: 'mp3',
        quality: '320kbps',
        url: payload.download || payload.url || payload.audio,
        downloadUrl: payload.download || payload.url || payload.audio,
      });
    }
  } else {
    // Generic fallback
    if (payload.url || payload.video || payload.link) {
      const mediaUrl = payload.url || payload.video || payload.link;
      downloads.push({
        id: 'generic-media',
        label: 'Download Media',
        format: 'mp4',
        url: mediaUrl,
        downloadUrl: mediaUrl,
      });
    }
  }

  // Fallback if no specific format detected but url exists
  if (downloads.length === 0 && payload.url) {
    downloads.push({
      id: 'fallback-download',
      label: 'Download File',
      format: 'file',
      url: payload.url,
      downloadUrl: payload.url,
    });
  }

  return {
    id: `dl-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    platform,
    platformName: platform.toUpperCase(),
    title,
    author,
    thumbnail,
    duration,
    description: payload.description || undefined,
    downloads,
    images: images.length > 0 ? images : undefined,
    originalUrl,
    timestamp: Date.now(),
  };
}
