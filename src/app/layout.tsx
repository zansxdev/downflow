import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { SocialBackground } from '@/components/SocialBackground';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
  weight: ['400', '500', '600'],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
  weight: ['600', '700'],
});

export const viewport: Viewport = {
  themeColor: '#050505',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://dl.zansxart.me'),
  title: {
    default: 'DownFlow — Universal Media Downloader',
    template: '%s | DownFlow',
  },
  description:
    'Unduh video, musik, dan foto kualitas HD dari TikTok tanpa watermark, Instagram Reels, YouTube MP4/MP3, X (Twitter), Facebook, dan Spotify tanpa iklan.',
  keywords: [
    'downloader',
    'media downloader',
    'tiktok downloader',
    'tiktok tanpa watermark',
    'instagram reels downloader',
    'youtube mp4',
    'youtube mp3 converter',
    'spotify downloader',
    'twitter video downloader',
    'facebook video download',
    'zansxart',
  ],
  authors: [{ name: 'zansxart', url: 'https://github.com/zansxart' }],
  creator: 'zansxart',
  publisher: 'zansxart',
  alternates: {
    canonical: 'https://dl.zansxart.me',
  },
  openGraph: {
    title: 'DownFlow — Universal Media Downloader',
    description:
      'Unduh video, musik, dan foto dari TikTok, Instagram, YouTube, X, Facebook, dan Spotify tanpa iklan dan tanpa watermark.',
    url: 'https://dl.zansxart.me',
    siteName: 'DownFlow',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: '/banner.png',
        width: 1200,
        height: 630,
        alt: 'DownFlow — Universal Media Downloader by zansxart',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DownFlow — Universal Media Downloader',
    description:
      'Unduh video, musik, dan foto dari media sosial favorit tanpa iklan dan tanpa watermark.',
    creator: '@zansxart',
    images: ['/banner.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
  },
  manifest: '/manifest.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': 'https://dl.zansxart.me/#webapp',
      name: 'DownFlow',
      url: 'https://dl.zansxart.me',
      applicationCategory: 'MultimediaApplication',
      operatingSystem: 'All',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      description:
        'Universal Media Downloader untuk mengunduh konten dari TikTok tanpa watermark, Instagram Reels, YouTube MP4/MP3, Twitter/X, Spotify, dan Facebook tanpa iklan.',
      author: {
        '@type': 'Person',
        name: 'zansxart',
        url: 'https://github.com/zansxart',
      },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'IDR',
      },
      featureList: [
        'TikTok No Watermark HD',
        'Instagram Reels, Stories & Carousel',
        'YouTube MP4 Video & MP3 Audio',
        'Spotify High Quality Audio Track',
        'X / Twitter Video HD',
        'Facebook Reels & Video HD',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://dl.zansxart.me/#website',
      url: 'https://dl.zansxart.me',
      name: 'DownFlow',
      description: 'Universal Media Downloader by zansxart',
      publisher: {
        '@type': 'Person',
        name: 'zansxart',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${jakarta.variable} ${jetbrains.variable} ${spaceGrotesk.variable} dark`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#050505] text-[#f4f4f5] antialiased selection:bg-zinc-800 selection:text-white min-h-screen flex flex-col justify-between relative">
        <SocialBackground />
        {children}
      </body>
    </html>
  );
}
