import { MetadataRoute } from 'next';
import { fetchAllPublishedBooks } from '@/modules/book/book.repo';
import { fetchAllTags } from '@/modules/tag/tag.repo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

  // 1. Static Pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/trang-chu`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/truyen-moi`, lastModified: new Date(), changeFrequency: 'always', priority: 0.8 },
    { url: `${SITE_URL}/truyen-hot`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/truyen-full`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${SITE_URL}/sap-xep`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
    { url: `${SITE_URL}/trang-thai`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
  ];

  // 2. Fetch all published books
  const books = await fetchAllPublishedBooks();
  const bookPages: MetadataRoute.Sitemap = books.map((book) => ({
    url: `${SITE_URL}/truyen/${book.slug}`,
    lastModified: new Date(book.updated_at),
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  // 3. Fetch all tags (categories)
  const tags = await fetchAllTags();
  const tagPages: MetadataRoute.Sitemap = tags.map((tag) => ({
    url: `${SITE_URL}/the-loai/${encodeURIComponent(tag.name)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticPages, ...bookPages, ...tagPages];
}
