'use client'

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import SEO from '../../components/Seo';
import { PostContent } from '../../components/PostContent';
import { Page as PageType } from '../../types';
import { useIndexNow } from '../../hooks/useIndexNow';

export default function ClientPage({ page }: { page: PageType }) {
  const pathname = usePathname();
  const fullUrl = `https://phofbanana.com${pathname}`;
  
  useIndexNow(fullUrl);

  return (
    <>
      <SEO 
        title={`${page.title} | pH of Banana`}
        description={page.excerpt || ''}
        canonicalUrl={`https://phofbanana.com/${page.slug}`}
        ogType="website"
        ogImage={page.featuredImage?.node.sourceUrl || 'https://phofbanana.com/default-og-image.jpg'}
        ogImageAlt={page.title}
        siteName="pH of Banana"
      />
      <div className="bg-background min-h-screen">
        <main className="container mx-auto px-4 py-8">
          {page.featuredImage && (
            <div className="mb-8">
              <Image
                src={page.featuredImage.node.sourceUrl}
                alt={page.featuredImage.node.altText || page.title}
                width={1200}
                height={630}
                className="w-full h-auto object-cover rounded-lg"
                priority
              />
            </div>
          )}
          <article className="prose prose-lg dark:prose-invert max-w-none">
            <h1 className="text-4xl font-bold mb-6">{page.title}</h1>
            <PostContent content={page.content || ''} />
          </article>
        </main>
      </div>
    </>
  );
}
