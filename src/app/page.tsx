import { Metadata } from 'next';
import Image from 'next/image';
import { getHomePage } from '../lib/faust-api';
import { Page } from '../types';
import PostHeader from '../components/PostHeader';
import TableOfContents from '../components/TableOfContents';
import SocialSharePanel from '../components/SocialSharePanel';
import AuthorBox from '../components/AuthorBox';
import SEO from '../components/Seo';

export const revalidate = 3600; // Revalidate this page every hour

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomePage();

  if (!page) {
    return {
      title: 'pH of Banana',
      description: 'Learn about the pH levels of different types of bananas',
    };
  }

  const ogImageUrl = page.featuredImage?.node.sourceUrl || 'https://phofbanana.com/default-og-image.jpg';

  return {
    title: page.seo?.title || `${page.title} | pH of Banana`,
    description: page.seo?.metaDesc || page.excerpt || '',
    openGraph: {
      title: page.seo?.title || page.title,
      description: page.seo?.metaDesc || page.excerpt || '',
      url: 'https://phofbanana.com',
      type: 'website',
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
      title: page.seo?.title || page.title,
      description: page.seo?.metaDesc || page.excerpt || '',
      images: [ogImageUrl],
    },
  };
}

export default async function HomePage() {
  const page: Page | null = await getHomePage();

  if (!page) {
    return <div>Homepage not found</div>;
  }

  const pageUrl = 'https://phofbanana.com';
  const imageUrl = page.featuredImage?.node.sourceUrl || 'https://phofbanana.com/default-og-image.jpg';

  return (
    <>
      <SEO
        title={page.seo?.title || `${page.title} | pH of Banana`}
        description={page.seo?.metaDesc || page.excerpt || ''}
        canonicalUrl={pageUrl}
        ogType="website"
        ogImage={imageUrl}
        ogImageAlt={page.title}
        publishedTime={page.date}
        modifiedTime={page.modified}
        author={page.author?.node.name}
        siteName="pH of Banana"
      />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          <article className="lg:w-2/3">
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
            <PostHeader
              title={page.title}
              author={page.author?.node}
              date={page.date}
            />
            <div 
              className="prose max-w-none mt-8"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
            {page.author && <AuthorBox authorName={page.author.node.name} />}
          </article>
          <aside className="lg:w-1/3 mt-8 lg:mt-0">
            <TableOfContents content={page.content} />
          </aside>
        </div>
        <SocialSharePanel 
          url={pageUrl}
          title={page.title}
          description={page.excerpt || ''}
          imageUrl={imageUrl}
        />
      </div>
    </>
  );
}
