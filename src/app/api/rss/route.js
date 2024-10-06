import { NextResponse } from 'next/server';
import RSS from 'rss';

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
const SITE_URL = process.env.NEXT_PUBLIC_URL;
const SITE_TITLE = 'pH of Banana';
const SITE_DESCRIPTION = 'A blog for all banana lovers';

async function fetchRecentPosts() {
  const response = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/posts?_fields=id,title,excerpt,slug,date,modified,categories,author,featured_media&per_page=20&orderby=date&order=desc`);
  const posts = await response.json();
  return posts;
}

async function fetchCategories(categoryIds) {
  const response = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/categories?include=${categoryIds.join(',')}`);
  const categories = await response.json();
  return categories;
}

async function fetchAuthor(authorId) {
  const response = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/users/${authorId}`);
  const author = await response.json();
  return author;
}

async function fetchFeaturedMedia(mediaId) {
  const response = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/media/${mediaId}`);
  const media = await response.json();
  return media;
}

export async function GET() {
  try {
    const posts = await fetchRecentPosts();

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
        fetchCategories(post.categories),
        fetchAuthor(post.author),
        post.featured_media ? fetchFeaturedMedia(post.featured_media) : null
      ]);

      feed.item({
        title: post.title.rendered,
        description: post.excerpt.rendered,
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
