import { Metadata } from 'next';
import { getPageBySlug, getAllPages } from '../../lib/faust-api';
import ClientPage from './ClientPage';

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
    return null; // or handle the 404 case
  }

  return <ClientPage page={page} />;
}
