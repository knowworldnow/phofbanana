import { NextResponse } from 'next/server';
import { getApolloClient } from '@faustwp/core';
import { gql } from '@apollo/client';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://phofbanana.com';

const client = getApolloClient();

const SITEMAP_QUERY = gql`
  query SitemapQuery($after: String) {
    contentNodes(
      where: { contentTypes: [POST, PAGE] }
      first: 50
      after: $after
    ) {
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

async function getAllWPContent(after: string | null = null, acc: ContentNode[] = []): Promise<ContentNode[]> {
  const { data } = await client.query({
    query: SITEMAP_QUERY,
    variables: {
      after,
    },
  });

  acc = [...acc, ...data.contentNodes.nodes];

  if (data.contentNodes.pageInfo.hasNextPage) {
    return getAllWPContent(data.contentNodes.pageInfo.endCursor, acc);
  }

  return acc;
}

export async function GET() {
  const nodes = await getAllWPContent();

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${nodes
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
}
