import { Metadata } from 'next';
import { getPageBySlug } from '../lib/faust-api';
import { PostContent } from '../components/PostContent';
import SEO from '../components/Seo';

export const metadata: Metadata = {
  title: 'Home | pH of Banana',
  description: 'Learn about the pH levels of different types of bananas and how they affect your health.',
};

export default async function Home() {
  const homePage = await getPageBySlug('home');

  if (!homePage) {
    return <div>Homepage not found</div>;
  }

  return (
    <>
      <SEO 
        title={homePage.title}
        description={homePage.excerpt || ''}
        canonicalUrl="https://phofbanana.com"
        ogType="website"
        ogImage={homePage.featuredImage?.node.sourceUrl || 'https://phofbanana.com/default-og-image.jpg'}
        ogImageAlt={homePage.title}
        siteName="pH of Banana"
      />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">{homePage.title}</h1>
        <PostContent content={homePage.content} />
      </main>
    </>
  );
}
