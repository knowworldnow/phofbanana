import { Metadata } from 'next';
import HomePageClient from '../components/HomePageClient';
import { getLatestPosts } from '../lib/faust-api';
import { Post, GetAllPostsResult } from '../types';

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const result: GetAllPostsResult = await getLatestPosts({ first: 5 });
  const latestPosts = result.posts.nodes;
  const postTitles = latestPosts.map(post => post.title).join(', ');

  return {
    title: 'pH of Banana - Understanding Banana Acidity',
    description: `Learn about the pH levels of different types of bananas and how they affect your health. Recent topics: ${postTitles}`,
    openGraph: {
      title: 'pH of Banana - Understanding Banana Acidity',
      description: `Learn about the pH levels of different types of bananas and how they affect your health. Recent topics: ${postTitles}`,
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
      card: 'summary_large_image',
      title: 'pH of Banana - Understanding Banana Acidity',
      description: `Learn about the pH levels of different types of bananas and how they affect your health. Recent topics: ${postTitles}`,
      images: ['https://phofbanana.com/og-image.jpg'],
    },
  };
}

export default async function Home() {
  const result: GetAllPostsResult = await getLatestPosts({ first: 24 });
  const initialPosts: Post[] = result.posts.nodes;
  const initialPageInfo = result.posts.pageInfo;
  return <HomePageClient initialPosts={initialPosts} initialPageInfo={initialPageInfo} />;
}
