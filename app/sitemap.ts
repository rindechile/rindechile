import type { MetadataRoute } from 'next';
import { REGION_SLUGS } from '@/lib/region-slugs';

const BASE_URL = 'https://rindechile.cl';

export default function sitemap(): MetadataRoute.Sitemap {
  const regionPages = REGION_SLUGS.map((r) => ({
    url: `${BASE_URL}/${r.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    ...regionPages,
    {
      url: `${BASE_URL}/methodology`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];
}
