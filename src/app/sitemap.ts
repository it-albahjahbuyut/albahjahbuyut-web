import { MetadataRoute } from 'next';
import { db } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://albahjahbuyut.com';

  // Fetch dynamic data
  const [units, posts, businessUnits] = await Promise.all([
    db.unit.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    }),
    db.post.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, publishedAt: true },
    }),
    db.businessUnit.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/profil`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pendidikan`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/psb`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95, // High priority for PSB
    },
    {
      url: `${baseUrl}/unit-usaha`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/berita`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/galeri`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/infaq`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/kontak`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Dynamic unit pages
  const unitPages: MetadataRoute.Sitemap = units.map((unit) => ({
    url: `${baseUrl}/pendidikan/${unit.slug}`,
    lastModified: unit.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // PSB registration pages for each unit
  const psbPages: MetadataRoute.Sitemap = units.map((unit) => ({
    url: `${baseUrl}/psb/daftar/${unit.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // Dynamic business unit pages
  const businessUnitPages: MetadataRoute.Sitemap = businessUnits.map((unit) => ({
    url: `${baseUrl}/unit-usaha/${unit.slug}`,
    lastModified: unit.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }));

  // Dynamic news/blog pages
  const newsPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/berita/${post.slug}`,
    lastModified: post.publishedAt || new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...unitPages, ...businessUnitPages, ...psbPages, ...newsPages];
}
