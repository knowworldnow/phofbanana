import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import SEO from '../../components/Seo';
import { PostContent } from '../../components/PostContent';
import { getPageBySlug, getAllPages } from '../../lib/faust-api';
import { Page as PageType } from '../../types';

export const revalidate = 3600; // Revalidate this page every hour

export async function generateStaticParams() {
  try {
    const pages = await getAllPages();
    return pages.map((page) => ({
      slug: page.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const page = await getPageBySlug(params.slug);

  if (!page) {
    return {
      title: 'Page Not Found',
    };
  }

  const ogImageUrl = page.featuredImage?.node.sourceUrl || 'https://phofbanana.com/default-og-image.jpg';

  return {
    title: `${page.title} | pH of Banana`,
    description: page.excerpt || '',
    openGraph: {
      type: 'website',
      url: `https://phofbanana.com/${page.slug}`,
      title: page.title,
      description: page.excerpt || '',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: page.title,
        },
      ],
    },
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const page = await getPageBySlug(params.slug);

  if (!page) {
    notFound();
  }

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
