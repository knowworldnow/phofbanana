import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getPostBySlug, getAllPosts, getRelatedPosts } from '../../../lib/faust-api';
import { submitUrlToIndexNow } from '../../../lib/indexnow';
import { Post } from '../../../types';
import PostHeader from '../../../components/PostHeader';
import TableOfContents from '../../../components/TableOfContents';
import AuthorBox from '../../../components/AuthorBox';
import FAQ from '../../../components/FAQ';
import FAQSchema from '../../../components/FAQSchema';
import SEO from '../../../components/Seo';

const CommentForm = dynamic(() => import('../../../components/CommentForm'));
const CommentList = dynamic(() => import('../../../components/CommentList'));
const SocialSharePanel = dynamic(() => import('../../../components/SocialSharePanel'));
const RelatedPosts = dynamic(() => import('../../../components/RelatedPosts'));

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

  // Submit URL to IndexNow
  if (process.env.NODE_ENV === 'production') {
    try {
      await submitUrlToIndexNow(postUrl);
      console.log(`Submitted URL to IndexNow: ${postUrl}`);
    } catch (error) {
      console.error('Failed to submit URL to IndexNow:', error);
    }
  }

  let relatedPosts: Post[] = [];
  if (post.categories.nodes.length > 0) {
    const categoryId = post.categories.nodes[0].id;
    try {
      relatedPosts = await getRelatedPosts(categoryId, post.id);
    } catch (error) {
      console.error('Error fetching related posts:', error);
    }
  }

  return (
    <>
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
              <div className="relative w-full max-w-3xl mx-auto mb-8">
                <div className="aspect-w-16 aspect-h-5">
                  <Image
                    src={post.featuredImage.node.sourceUrl}
                    alt={post.featuredImage.node.altText || post.title}
                    fill
                    className="object-cover rounded-lg"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                    priority
                  />
                </div>
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
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
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
    </>
  );
}
