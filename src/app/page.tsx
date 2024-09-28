import { Metadata } from 'next';
import { getHomePage } from '../lib/faust-api';
import { PostContent } from '../components/PostContent';
import SEO from '../components/Seo';

export const metadata: Metadata = {
  title: 'pH of Banana | Understanding Banana Acidity',
  description: 'Learn about the pH levels of different types of bananas and how they affect your health.',
};

export default async function Home() {
  const homePage = await getHomePage();

  if (!homePage) {
    return <div>Homepage not found</div>;
  }

  return (
    <>
      <SEO 
        title={homePage.seo?.title || homePage.title}
        description={homePage.seo?.metaDesc || homePage.excerpt || ''}
        canonicalUrl="https://phofbanana.com"
        ogType="website"
        ogImage={homePage.seo?.opengraphImage?.sourceUrl || homePage.featuredImage?.node.sourceUrl || 'https://phofbanana.com/default-og-image.jpg'}
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
