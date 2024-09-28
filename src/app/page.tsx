import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { getLatestPosts } from '../lib/faust-api';
import { Post, GetAllPostsResult } from '../types';

const HomePage = dynamic(() => import('./HomePage'), {
  loading: () => <div>Loading homepage...</div>,
  ssr: true,
});

export const revalidate = 300;

async function getLatestPostTitles() {
  const result: GetAllPostsResult = await getLatestPosts({ first: 5 });
  return result.posts.nodes.map(post => post.title).join(', ');
}

export async function generateMetadata(): Promise<Metadata> {
  const postTitles = await getLatestPostTitles();

  const baseMetadata = {
    title: 'pH of Banana - Understanding Banana Acidity',
    description: `Learn about the pH levels of different types of bananas and how they affect your health. Recent topics: ${postTitles}`,
  };

  return {
    ...baseMetadata,
    openGraph: {
      ...baseMetadata,
      url: 'https://phofbanana.com',
      siteName: 'pH of Banana',
      images: [
        {
          url: 'https://phofbanana.com/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'pH of Banana - Understanding Banana Acidity',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      ...baseMetadata,
      card: 'summary_large_image',
      images: ['https://phofbanana.com/og-image.jpg'],
    },
  };
}

export default async function Home() {
  const result: GetAllPostsResult = await getLatestPosts({ first: 24 });
  const initialPosts: Post[] = result.posts.nodes;
  const initialPageInfo = result.posts.pageInfo;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePage initialPosts={initialPosts} initialPageInfo={initialPageInfo} />
    </Suspense>
  );
}
