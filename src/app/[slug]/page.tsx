import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SEO from '../../components/Seo';
import { PostContent } from '../../components/PostContent';
import { getPageBySlug, getAllPageSlugs } from '../../lib/faust-api';

export async function generateStaticParams() {
  const pages = await getAllPageSlugs();
  return pages.map((page) => ({
    slug: page.slug,
  }));
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
    title: page.seo?.title || page.title,
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
}

export default async function Page({ params }: { params: { slug: string } }) {
  if (params.slug === 'ph-of-banana') {
    notFound();
  }

  const page = await getPageBySlug(params.slug);

  if (!page) {
    notFound();
  }

  return (
    <>
      <SEO 
        title={page.seo?.title || page.title}
        description={page.seo?.metaDesc || page.excerpt || ''}
        canonicalUrl={`https://phofbanana.com/${page.slug}`}
        ogType="website"
        ogImage={page.seo?.opengraphImage?.sourceUrl || page.featuredImage?.node.sourceUrl || 'https://phofbanana.com/default-og-image.jpg'}
        ogImageAlt={page.title}
        siteName="pH of Banana"
      />
      <article className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">{page.title}</h1>
        <PostContent content={page.content} />
      </article>
    </>
  );
}
