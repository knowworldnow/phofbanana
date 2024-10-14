import { NextResponse } from 'next/server';
import RSS from 'rss';
import { getAllPosts } from '@/lib/faust-api';

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://your-wordpress-url.com';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://phofbanana.com';
const SITE_TITLE = 'pH of Banana';
const SITE_DESCRIPTION = 'A blog for all banana lovers';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Author {
  name: string;
  avatar?: {
    url: string;
  };
}

interface FeaturedImage {
  sourceUrl: string;
  altText: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  date: string;
  categories: {
    nodes: Category[];
  };
  author: {
    node: Author;
  };
  featuredImage: {
    node: FeaturedImage;
  } | null;
}

async function fetchCategories(categoryIds: string[]): Promise<Category[]> {
  const response = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/categories?include=${categoryIds.join(',')}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
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
      ttl: 60
    });

    for (const post of posts) {
      const categories = await fetchCategories(post.categories.nodes.map(cat => cat.id));

      feed.item({
        title: post.title,
        description: post.excerpt,
        url: `${SITE_URL}/${post.slug}`,
        guid: post.id,
        categories: categories.map(cat => cat.name),
        author: post.author.node.name,
        date: new Date(post.date),
        enclosure: post.featuredImage ? {
          url: post.featuredImage.node.sourceUrl,
          type: 'image/jpeg' // Default to JPEG if mimeType is not available
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
