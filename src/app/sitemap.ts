import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://dl.zansxart.me',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];
}
