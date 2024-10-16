import { NextResponse } from 'next/server';
import RSS from 'rss';
import { getAllPosts } from '@/lib/faust-api';
import { Post } from '@/types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://phofbanana.com';
const SITE_TITLE = 'pH of Banana';
const SITE_DESCRIPTION = 'A blog for all banana lovers';

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

    posts.forEach((post: Post) => {
      feed.item({
        title: post.title,
        description: post.excerpt,
        url: `${SITE_URL}/${post.slug}`,
        guid: post.id,
        categories: post.categories.nodes.map(cat => cat.name),
        author: post.author.node.name,
        date: new Date(post.date),
        enclosure: post.featuredImage ? {
          url: post.featuredImage.node.sourceUrl,
          type: 'image/jpeg'
        } : undefined
      });
    });

    return new NextResponse(feed.xml({ indent: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    return new NextResponse('Error generating RSS feed', { status: 500 });
  }
}
