import Link from 'next/link';
import OptimizedImage from './OptimizedImage';
import { Post } from '../types';

interface RelatedPostsProps {
  posts: Post[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  console.log('Rendering RelatedPosts component with:', posts);

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {posts.map((post) => (
          <article key={post.id} className="group bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <Link href={`/${post.slug}`} className="block cursor-pointer">
              <div className="relative aspect-video overflow-hidden">
                <OptimizedImage
                  src={post.featuredImage?.node.sourceUrl || '/placeholder.jpg'}
                  alt={post.featuredImage?.node.altText || post.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold group-hover:text-primary transition-colors duration-200 line-clamp-2">
                  {post.title}
                </h3>
                {post.author?.node?.name && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {post.author.node.name}
                  </p>
                )}
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
