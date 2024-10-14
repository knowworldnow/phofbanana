import { NextResponse } from 'next/server';
import RSS from 'rss';
import { getAllPosts } from '@/lib/faust-api';

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://your-wordpress-url.com';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://phofbanana.com';
const SITE_TITLE = 'pH of Banana';
const SITE_DESCRIPTION = 'A blog for all banana lovers';

async function fetchRecentPosts(): Promise<any[]> {
  const response = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/posts?_fields=id,title,excerpt,slug,date,modified,categories,author,featured_media&per_page=20&orderby=date&order=desc`);
  if (!response.ok) {
    throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

async function fetchCategories(categoryIds: number[]): Promise<any[]> {
  const response = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/categories?include=${categoryIds.join(',')}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

async function fetchAuthor(authorId: number): Promise<any> {
  const response = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/users/${authorId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch author: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

async function fetchFeaturedMedia(mediaId: number): Promise<any> {
  const response = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/media/${mediaId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch media: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function GET(): Promise<NextResponse> {
  try {
    const posts = await getAllPosts();

    const feed = new RSS({
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      feed_url: `${SITE_URL}/rss.xml`,
      site_url: SITE_URL,
      image_url: `${SITE_URL}/favicon.ico`,
      language: 'en',
      pubDate: new Date(),
      ttl: '60'
    });

    for (const post of posts) {
      const [categories, author, featuredMedia] = await Promise.all([
        fetchCategories(post.categories.nodes.map(cat => cat.databaseId)),
        fetchAuthor(post.author.node.databaseId),
        post.featuredImage ? fetchFeaturedMedia(post.featuredImage.node.databaseId) : null
      ]);

      feed.item({
        title: post.title,
        description: post.excerpt,
        url: `${SITE_URL}/${post.slug}`,
        guid: post.id,
        categories: categories.map(cat => cat.name),
        author: author.name,
        date: new Date(post.date),
        enclosure: featuredMedia ? {
          url: featuredMedia.source_url,
          type: featuredMedia.mime_type
        } : undefined
      });
    }

    return new NextResponse(feed.xml({ indent: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
      },
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    return new NextResponse('Error generating RSS feed', { status: 500 });
  }
}
