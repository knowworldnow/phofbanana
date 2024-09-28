import { Metadata } from 'next';
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
import SEO from '../../../components/Seo';
import dynamic from 'next/dynamic';

const OptimizedImage = dynamic(() => import('../../../components/OptimizedImage'), { ssr: false });
const PostContent = dynamic(() => import('../../../components/PostContent').then(mod => mod.PostContent), { ssr: false });

export const revalidate = 3600; // Revalidate this page every hour

export async function generateStaticParams() {
  try {
    const posts = await getAllPosts();
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const post = await getPostBySlug(params.slug);

    if (!post) {
      return {
        title: 'Post Not Found',
      };
    }

    const ogImageUrl = post.featuredImage?.node?.sourceUrl || 'https://phofbanana.com/default-og-image.jpg';

    return {
      title: `${post.title} | pH of Banana`,
      description: post.excerpt || '',
      openGraph: {
        title: post.title,
        description: post.excerpt || '',
        url: `https://phofbanana.com/${post.slug}`,
        type: 'article',
        publishedTime: post.date,
        authors: [post.author?.node?.name || 'Unknown Author'],
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
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Error Loading Post',
    };
  }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  try {
    const post: Post | null = await getPostBySlug(params.slug);

    if (!post) {
      notFound();
    }

    const postUrl = `https://phofbanana.com/${post.slug}`;
    const imageUrl = post.featuredImage?.node?.sourceUrl || 'https://phofbanana.com/default-og-image.jpg';

    let relatedPosts: Post[] = [];
    if (post.categories?.nodes && post.categories.nodes.length > 0) {
      const categoryId = post.categories.nodes[0].id;
      console.log('Fetching related posts for category:', categoryId);
      try {
        relatedPosts = await getRelatedPosts(categoryId, post.id);
        console.log('Related posts:', relatedPosts);
      } catch (error) {
        console.error('Error fetching related posts:', error);
      }
    } else {
      console.log('No categories found for this post');
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
          author={post.author?.node?.name || 'Unknown Author'}
          siteName="pH of Banana"
        />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row lg:space-x-8">
            <article className="lg:w-2/3">
              {post.featuredImage?.node?.sourceUrl && (
                <OptimizedImage
                  src={post.featuredImage.node.sourceUrl}
                  alt={post.featuredImage.node.altText || post.title}
                  className="w-full h-auto object-cover rounded-lg mb-8"
                  priority
                />
              )}
              <PostHeader
                title={post.title}
                author={post.author?.node}
                date={post.date}
                category={post.categories?.nodes?.[0]}
              />
              <PostContent content={post.content || ''} />
              <AuthorBox authorName={post.author?.node?.name || 'Unknown Author'} />
              {post.comments?.nodes && <CommentList comments={post.comments.nodes} />}
              <CommentForm postId={post.id} />
            </article>
            <aside className="lg:w-1/3 mt-8 lg:mt-0">
              <TableOfContents content={post.content || ''} />
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
  } catch (error) {
    console.error('Error rendering post page:', error);
    notFound();
  }
}
