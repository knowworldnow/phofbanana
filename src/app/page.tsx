// src/app/page.tsx

import { Metadata } from 'next';
import Image from 'next/image';
import { getHomePage } from '../lib/faust-api';
import { Page } from '../types';

export const revalidate = 3600; // Revalidate every hour

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomePage();

  if (!page) {
    return {
      title: 'pH of Banana',
      description: 'Learn about the pH of bananas',
    };
  }

  const ogImageUrl = page.featuredImage?.node.sourceUrl || 'https://phofbanana.com/default-og-image.jpg';

  return {
    title: `${page.title} | pH of Banana`,
    description: 'Learn about the pH of bananas',
    openGraph: {
      title: page.title,
      description: 'Learn about the pH of bananas',
      url: 'https://phofbanana.com',
      type: 'article',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: page.title,
        },
      ],
      siteName: 'pH of Banana',
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: 'Learn about the pH of bananas',
      images: [ogImageUrl],
    },
  };
}

export default async function Home() {
  const page = await getHomePage();

  if (!page) {
    return <div>Page not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="prose prose-lg dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-6">{page.title}</h1>
        {page.featuredImage && (
          <Image
            src={page.featuredImage.node.sourceUrl}
            alt={page.featuredImage.node.altText || page.title}
            width={1200}
            height={630}
            className="w-full h-auto object-cover rounded-lg mb-8"
            priority
          />
        )}
        <div dangerouslySetInnerHTML={{ __html: page.content }} />
      </article>
    </div>
  );
}
