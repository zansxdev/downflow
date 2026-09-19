import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

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

export const metadata: Metadata = {
  title: 'DownFlow | Universal Media & Video Downloader',
  description: 'Download media from TikTok, Instagram, YouTube, X, Facebook, and Spotify with zero ads and pure speeds.',
  keywords: ['downloader', 'tiktok downloader', 'instagram reels downloader', 'youtube mp4', 'spotify mp3', 'video download'],
  openGraph: {
    title: 'DownFlow | Universal Media Downloader',
    description: 'Clean, ad-free high-speed media downloader.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${jakarta.variable} ${jetbrains.variable} dark`}>
      <body className="bg-[#050505] text-[#f4f4f5] antialiased selection:bg-zinc-800 selection:text-white min-h-screen flex flex-col justify-between">
        {children}
      </body>
    </html>
  );
}
