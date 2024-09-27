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
    title: page.seo?.title || `${page.title} | pH of Banana`,
    description: page.seo?.metaDesc || 'Learn about the pH of bananas',
    openGraph: {
      title: page.seo?.title || page.title,
      description: page.seo?.metaDesc || 'Learn about the pH of bananas',
      url: 'https://phofbanana.com',
      type: 'website',
      images: [
        {
          url: page.seo?.opengraphImage?.sourceUrl || ogImageUrl,
          width: 1200,
          height: 630,
          alt: page.title,
        },
      ],
      siteName: 'pH of Banana',
    },
    twitter: {
      card: 'summary_large_image',
      title: page.seo?.title || page.title,
      description: page.seo?.metaDesc || 'Learn about the pH of bananas',
      images: [page.seo?.opengraphImage?.sourceUrl || ogImageUrl],
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
        <p className="text-sm text-gray-500 mt-4">
          Last updated: {new Date(page.modified).toLocaleDateString()}
        </p>
      </article>
    </div>
  );
}
