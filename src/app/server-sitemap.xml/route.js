import { NextResponse } from 'next/server';

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
const SITE_URL = process.env.NEXT_PUBLIC_URL;

async function fetchPosts(page = 1, allPosts = []) {
  const response = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/posts?_fields=slug,modified&per_page=100&page=${page}`);
  const posts = await response.json();
  
  if (posts.length === 0) {
    return allPosts;
  }
  
  allPosts = allPosts.concat(posts);
  return fetchPosts(page + 1, allPosts);
}

async function fetchPages() {
  const response = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/pages?_fields=slug,modified&per_page=100`);
  return await response.json();
}

export async function GET() {
  try {
    const [posts, pages] = await Promise.all([fetchPosts(), fetchPages()]);

    const postUrls = posts.map(post => `
      <url>
        <loc>${SITE_URL}/${post.slug}</loc>
        <lastmod>${new Date(post.modified).toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
      </url>
    `).join('');

    const pageUrls = pages.map(page => `
      <url>
        <loc>${SITE_URL}/${page.slug}</loc>
        <lastmod>${new Date(page.modified).toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
      </url>
    `).join('');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
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
