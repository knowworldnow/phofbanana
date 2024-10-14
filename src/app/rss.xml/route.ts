import { NextResponse } from 'next/server';
import RSS from 'rss';

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
const SITE_URL = process.env.NEXT_PUBLIC_URL;
const SITE_TITLE = 'pH of Banana';
const SITE_DESCRIPTION = 'A blog for all banana lovers';

async function fetchRecentPosts() {
  const response = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/posts?_fields=id,title,excerpt,content,slug,date,modified,categories,author,featured_media&per_page=20&orderby=date&order=desc`);
  if (!response.ok) {
    throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

async function fetchCategories(categoryIds: number[]) {
  const response = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/categories?include=${categoryIds.join(',')}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

async function fetchAuthor(authorId: number) {
  const response = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/users/${authorId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch author: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

async function fetchFeaturedMedia(mediaId: number) {
  const response = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/media/${mediaId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch media: ${response.status} ${response.statusText}`);
  }
  return response.json();
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
      ttl: '60',
      custom_namespaces: {
        content: 'http://purl.org/rss/1.0/modules/content/',
        dc: 'http://purl.org/dc/elements/1.1/',
        media: 'http://search.yahoo.com/mrss/',
      },
    });

    for (const post of posts) {
      const [categories, author, featuredMedia] = await Promise.all([
        fetchCategories(post.categories),
        fetchAuthor(post.author),
        post.featured_media ? fetchFeaturedMedia(post.featured_media) : null
      ]);

      const postUrl = `${SITE_URL}/${post.slug}`;

      feed.item({
        title: post.title.rendered,
        description: post.excerpt.rendered,
        url: postUrl,
        guid: post.id,
        categories: categories.map(cat => cat.name),
        author: author.name,
        date: new Date(post.date),
        custom_elements: [
          { 'content:encoded': post.content.rendered },
          { 'dc:creator': author.name },
        ],
        enclosure: featuredMedia ? {
          url: featuredMedia.source_url,
          type: featuredMedia.mime_type,
          size: featuredMedia.filesize || 0
        } : undefined
      });

      if (featuredMedia) {
        feed.item({
          custom_elements: [
            {
              'media:content': [
                {
                  _attr: {
                    url: featuredMedia.source_url,
                    medium: 'image',
                    type: featuredMedia.mime_type,
                  },
                },
                {
                  'media:title': featuredMedia.title.rendered,
                },
                {
                  'media:description': featuredMedia.alt_text,
                },
              ],
            },
          ],
        });
      }
    }

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
