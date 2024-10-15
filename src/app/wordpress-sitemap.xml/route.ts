import { NextResponse } from 'next/server';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://your-wordpress-url.com';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://phofbanana.com';

const client = new ApolloClient({
  uri: `${WORDPRESS_URL}/graphql`,
  cache: new InMemoryCache(),
});

const SITEMAP_QUERY = gql`
  query SitemapQuery($after: String, $first: Int!) {
    posts(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        uri
        modifiedGmt
      }
    }
    pages(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        uri
        modifiedGmt
      }
    }
  }
`;

interface ContentNode {
  uri: string;
  modifiedGmt: string;
}

interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

interface QueryResult {
  posts: {
    pageInfo: PageInfo;
    nodes: ContentNode[];
  };
  pages: {
    pageInfo: PageInfo;
    nodes: ContentNode[];
  };
}

async function getAllContent(): Promise<ContentNode[]> {
  let allContent: ContentNode[] = [];
  let hasNextPage = true;
  let afterPosts: string | null = null;
  let afterPages: string | null = null;

  while (hasNextPage) {
    const { data } = await client.query<QueryResult>({
      query: SITEMAP_QUERY,
      variables: {
        first: 100, // Fetch 100 items at a time
        after: afterPosts,
      },
    });

    allContent = [...allContent, ...data.posts.nodes, ...data.pages.nodes];

    hasNextPage = data.posts.pageInfo.hasNextPage || data.pages.pageInfo.hasNextPage;
    afterPosts = data.posts.pageInfo.endCursor;
    afterPages = data.pages.pageInfo.endCursor;
  }

  return allContent;
}

export async function GET() {
  try {
    const allContent = await getAllContent();

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${allContent
          .map((node) => {
            if (!node.uri) return '';
            return `
              <url>
                <loc>${SITE_URL}${node.uri}</loc>
                <lastmod>${new Date(node.modifiedGmt).toISOString()}</lastmod>
              </url>
            `;
          })
          .join('')}
      </urlset>
    `;

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
