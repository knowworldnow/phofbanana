import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SEO from '../../components/Seo';
import { PostContent } from '../../components/PostContent';
import { getPageBySlug, getAllPages } from '../../lib/faust-api';
import { Page } from '../../types';

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
  try {
    const page = await getPageBySlug(params.slug);
    
    if (!page) {
      return {
        title: 'Page Not Found',
      };
    }

    const ogImageUrl = page.seo?.opengraphImage?.sourceUrl || page.featuredImage?.node?.sourceUrl || 'https://phofbanana.com/default-og-image.jpg';

    return {
      title: page.seo?.title || `${page.title} | pH of Banana`,
      description: page.seo?.metaDesc || page.excerpt || '',
      openGraph: {
        type: 'website',
        url: `https://phofbanana.com/${page.slug}`,
        title: page.seo?.title || page.title,
        description: page.seo?.metaDesc || page.excerpt || '',
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
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Error Loading Page',
    };
  }
}

export default async function Page({ params }: { params: { slug: string } }) {
  try {
    const page = await getPageBySlug(params.slug);

    if (!page) {
      notFound();
    }

    return (
      <>
        <SEO 
          title={page.seo?.title || `${page.title} | pH of Banana`}
          description={page.seo?.metaDesc || page.excerpt || ''}
          canonicalUrl={`https://phofbanana.com/${page.slug}`}
          ogType="website"
          ogImage={page.seo?.opengraphImage?.sourceUrl || page.featuredImage?.node?.sourceUrl || 'https://phofbanana.com/default-og-image.jpg'}
          ogImageAlt={page.title}
          siteName="pH of Banana"
        />
        <div className="bg-background min-h-screen">
          <main className="container mx-auto px-4 py-8">
            <article className="prose prose-lg dark:prose-invert max-w-none">
              <h1 className="text-4xl font-bold mb-6">{page.title}</h1>
              <PostContent content={page.content || ''} />
            </article>
          </main>
        </div>
      </>
    );
  } catch (error) {
    console.error('Error rendering page:', error);
    notFound();
  }
}
