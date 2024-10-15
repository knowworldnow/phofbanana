import { NextResponse } from 'next/server';
import { ApolloClient, InMemoryCache, gql, ApolloQueryResult } from '@apollo/client';

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://your-wordpress-url.com';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://phofbanana.com';
const POSTS_PER_SITEMAP = 1000; // Adjust this value based on your needs

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
    pages(where: {status: PUBLISH}) {
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

interface QueryResult {
  posts: {
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
    nodes: ContentNode[];
  };
  pages: {
    nodes: ContentNode[];
  };
}

async function getAllContent(): Promise<ContentNode[]> {
  let allContent: ContentNode[] = [];
  let hasNextPage = true;
  let after: string | null = null;

  while (hasNextPage) {
    const result: ApolloQueryResult<QueryResult> = await client.query<QueryResult>({
      query: SITEMAP_QUERY,
      variables: { first: 100, after },
    });

    const posts = result.data.posts.nodes.map((node: ContentNode) => ({
      ...node,
      uri: node.uri.replace(/^\/post\//, '/'),
    }));
    const pages = result.data.pages.nodes;

    allContent = [...allContent, ...posts, ...pages];

    hasNextPage = result.data.posts.pageInfo.hasNextPage;
    after = result.data.posts.pageInfo.endCursor;
  }

  return allContent;
}

function generateSitemapXml(content: ContentNode[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${content
        .map(
          (node) => `
        <url>
          <loc>${SITE_URL}${node.uri}</loc>
          <lastmod>${new Date(node.modifiedGmt).toISOString()}</lastmod>
        </url>
      `
        )
        .join('')}
    </urlset>`;
}

function generateSitemapIndex(sitemapCount: number): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${Array.from({ length: sitemapCount }, (_, i) => i + 1)
        .map(
          (num) => `
        <sitemap>
          <loc>${SITE_URL}/sitemap-${num}.xml</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
        </sitemap>
      `
        )
        .join('')}
    </sitemapindex>`;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const sitemapNum = url.searchParams.get('sitemap');

    const allContent = await getAllContent();
    const totalSitemaps = Math.ceil(allContent.length / POSTS_PER_SITEMAP);

    console.log(`Generated sitemap with ${allContent.length} URLs across ${totalSitemaps} sitemaps.`);

    if (!sitemapNum) {
      // Return the sitemap index
      const sitemapIndex = generateSitemapIndex(totalSitemaps);
      return new NextResponse(sitemapIndex, {
        status: 200,
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
      });
    }

    const sitemapNumber = parseInt(sitemapNum, 10);
    if (isNaN(sitemapNumber) || sitemapNumber < 1 || sitemapNumber > totalSitemaps) {
      return new NextResponse('Invalid sitemap number', { status: 400 });
    }

    const start = (sitemapNumber - 1) * POSTS_PER_SITEMAP;
    const end = start + POSTS_PER_SITEMAP;
    const sitemapContent = allContent.slice(start, end);
    const sitemap = generateSitemapXml(sitemapContent);

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
