import { NextResponse } from 'next/server';

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
const SITE_URL = process.env.NEXT_PUBLIC_URL;

async function fetchPosts(page = 1, limit = 100) {
  const response = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/posts?_fields=slug,modified&per_page=${limit}&page=${page}`);
  return response.json();
}

async function fetchPages(limit = 100) {
  const response = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/pages?_fields=slug,modified&per_page=${limit}`);
  return response.json();
}

function generateUrlEntry(item, changefreq, priority) {
  return `
    <url>
      <loc>${SITE_URL}/${item.slug}</loc>
      <lastmod>${new Date(item.modified).toISOString()}</lastmod>
      <changefreq>${changefreq}</changefreq>
      <priority>${priority}</priority>
    </url>
  `;
}

export async function GET() {
  try {
    const [posts, pages] = await Promise.all([fetchPosts(), fetchPages()]);

    const postUrls = posts.map(post => generateUrlEntry(post, 'weekly', '0.7')).join('');
    const pageUrls = pages.map(page => generateUrlEntry(page, 'monthly', '0.5')).join('');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
          <loc>${SITE_URL}</loc>
          <changefreq>daily</changefreq>
          <priority>1.0</priority>
        </url>
        ${postUrls}
        ${pageUrls}
      </urlset>`;

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}
