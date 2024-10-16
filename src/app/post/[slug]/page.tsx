import { Metadata } from 'next';
import Image from 'next/image';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { getPostBySlug, getAllPosts, getRelatedPosts } from '../../../lib/faust-api';
import { Post } from '../../../types';
import CommentForm from '../../../components/CommentForm';
import CommentList from '../../../components/CommentList';
import PostHeader from '../../../components/PostHeader';
import TableOfContents from '../../../components/TableOfContents';
import SocialSharePanel from '../../../components/SocialSharePanel';
import AuthorBox from '../../../components/AuthorBox';
import RelatedPosts from '../../../components/RelatedPosts';
import FAQ from '../../../components/FAQ';
import FAQSchema from '../../../components/FAQSchema';
import SEO from '../../../components/Seo';
import InArticleAd from '../../../components/InArticleAd';
import BananaAd from '../../../components/BananaAd';

export const revalidate = 3600; // Revalidate this page every hour

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const ogImageUrl = post.featuredImage?.node.sourceUrl || 'https://phofbanana.com/default-og-image.jpg';

  return {
    title: `${post.title} | pH of Banana`,
    description: post.excerpt || '',
    openGraph: {
      title: post.title,
      description: post.excerpt || '',
      url: `https://phofbanana.com/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author.node.name],
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      siteName: 'pH of Banana',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || '',
      images: [ogImageUrl],
    },
  };
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post: Post | null = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const postUrl = `https://phofbanana.com/${post.slug}`;
  const imageUrl = post.featuredImage?.node.sourceUrl || 'https://phofbanana.com/default-og-image.jpg';

  let relatedPosts: Post[] = [];
  if (post.categories.nodes.length > 0) {
    const categoryId = post.categories.nodes[0].id;
    try {
      relatedPosts = await getRelatedPosts(categoryId, post.id);
    } catch (error) {
      console.error('Error fetching related posts:', error);
    }
  }

  // Function to insert ads into the content
  const insertAds = (content: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const paragraphs = doc.querySelectorAll('p');

    if (paragraphs.length >= 10) {
      const adElement1 = document.createElement('div');
      adElement1.id = 'in-article-ad';
      paragraphs[9].insertAdjacentElement('afterend', adElement1);
    }

    if (paragraphs.length >= 20) {
      const adElement2 = document.createElement('div');
      adElement2.id = 'banana-ad';
      paragraphs[19].insertAdjacentElement('afterend', adElement2);
    }

    return doc.body.innerHTML;
  };

  const contentWithAds = insertAds(post.content);

  return (
    <>
      <Script
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9144697979680971"
        strategy="lazyOnload"
        crossOrigin="anonymous"
      />
      <SEO
        title={`${post.title} | pH of Banana`}
        description={post.excerpt || ''}
        canonicalUrl={postUrl}
        ogType="article"
        ogImage={imageUrl}
        ogImageAlt={post.title}
        publishedTime={post.date}
        modifiedTime={post.date}
        author={post.author.node.name}
        siteName="pH of Banana"
      />
      {post.faqItems && post.faqItems.length > 0 && (
        <FAQSchema faqItems={post.faqItems} />
      )}
      <div className="container mx-auto px-4 py-8 pl-12 sm:pl-16">
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          <article className="lg:w-2/3">
            {post.featuredImage && (
              <div className="relative w-full max-w-3xl mx-auto mb-8 hidden sm:block">
                <Image
                  src={post.featuredImage.node.sourceUrl}
                  alt={post.featuredImage.node.altText || post.title}
                  width={1200}
                  height={800}
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                  priority
                />
              </div>
            )}
            <PostHeader
              title={post.title}
              author={post.author.node}
              date={post.date}
              category={post.categories.nodes[0]}
            />
            <div 
              className="prose max-w-none mt-8"
              dangerouslySetInnerHTML={{ __html: contentWithAds }}
            />
            <InArticleAd />
            <BananaAd />
            {post.faqItems && post.faqItems.length > 0 && (
              <FAQ faqItems={post.faqItems} />
            )}
            <AuthorBox authorName={post.author.node.name} />
            {post.comments && <CommentList comments={post.comments.nodes} />}
            <CommentForm postId={post.id} />
          </article>
          <aside className="lg:w-1/3 mt-8 lg:mt-0">
            <TableOfContents content={post.content} />
          </aside>
        </div>
        <SocialSharePanel 
          url={postUrl}
          title={post.title}
          description={post.excerpt || ''}
          imageUrl={imageUrl}
        />
        {relatedPosts.length > 0 && <RelatedPosts posts={relatedPosts} />}
      </div>
      <Script id="ad-script">
        {`
          (adsbygoogle = window.adsbygoogle || []).push({});
          (adsbygoogle = window.adsbygoogle || []).push({});
        `}
      </Script>
    </>
  );
}
