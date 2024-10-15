import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/wp-admin/',
          '/wp-includes/',
          '/category/',
          '/tag/',
        ],
      },
    ],
    sitemap: 'https://phofbanana.com/sitemap.xml',
  }
}
