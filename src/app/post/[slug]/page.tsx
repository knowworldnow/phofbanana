import { Metadata } from 'next';
import Image from 'next/image';
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

  const ogImageUrl = post.featuredImage?.node.sourceUrl || 'https://dailyfornex.com/default-og-image.jpg';

  return {
    title: `${post.title} | Daily Fornex`,
    description: post.excerpt || '',
    openGraph: {
      title: post.title,
      description: post.excerpt || '',
      url: `https://dailyfornex.com/${post.slug}`,
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
      siteName: 'Daily Fornex',
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

  const postUrl = `https://dailyfornex.com/${post.slug}`;
  const imageUrl = post.featuredImage?.node.sourceUrl || 'https://dailyfornex.com/default-og-image.jpg';

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
        title={`${post.title} | Daily Fornex`}
        description={post.excerpt || ''}
        canonicalUrl={postUrl}
        ogType="article"
        ogImage={imageUrl}
        ogImageAlt={post.title}
        publishedTime={post.date}
        modifiedTime={post.date}
        author={post.author.node.name}
        siteName="Daily Fornex"
      />
      {post.faqItems && post.faqItems.length > 0 && (
        <FAQSchema faqItems={post.faqItems} />
      )}
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          <article className="lg:w-2/3">
            <div className="aspect-w-16 aspect-h-9 mb-8">
              {post.featuredImage && (
                <Image
                  src={post.featuredImage.node.sourceUrl}
                  alt={post.featuredImage.node.altText || post.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                  priority
                />
              )}
            </div>
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
            <div className="sticky top-8">
              <TableOfContents content={post.content} />
            </div>
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
