/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Roast',
            value: 'Bikin scraper sendiri jangan nembak endpoint orang dek wkwk',
          },
          {
            key: 'X-Protected-By',
            value: 'Doa Ibu & Kopi Hitam @zansxart',
          },
          {
            key: 'X-Kang-Scrape',
            value: 'Mau nyolong endpoint ya? Ketahuan lu bjir!',
          },
          {
            key: 'X-Creator',
            value: 'zansxart (https://github.com/zansxdev)',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
