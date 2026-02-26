import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/tai-khoan/',
        '/api/',
        '/proxy',
        '/dang-nhap',
        '/dang-ky',
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
