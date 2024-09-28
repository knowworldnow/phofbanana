'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getLatestPosts } from '../lib/faust-api';
import { Post, GetAllPostsResult } from '../types';

const POSTS_PER_PAGE = 24;

const FeaturedPost = () => (
  <section className="mb-16">
    <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      <div className="md:flex">
        <div className="md:flex-shrink-0 relative">
          <Image
            src="/pH of Banana.webp"
            alt="Banana pH Level"
            width={600}
            height={400}
            className="h-64 w-full object-cover md:h-full md:w-96"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent p-4">
            <div className="flex items-center">
              <Image
                src="/shoumya.webp"
                alt="Shoumya Chowdhury"
                width={40}
                height={40}
                className="rounded-full mr-2"
              />
              <div>
                <p className="text-sm font-medium text-white">Shoumya Chowdhury</p>
                <p className="text-xs text-gray-300">September 28, 2024</p>
              </div>
            </div>
          </div>
        </div>
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-yellow-400 font-semibold">Featured Article</div>
          <Link href="/banana-ph" className="block mt-1 text-2xl leading-tight font-bold text-white hover:underline">
            Banana pH Level: Understanding Acidity and Alkalinity of Bananas
          </Link>
          <p className="mt-2 text-gray-300">
            What is the pH of a Banana? Its pH typically is between 4.4-5.2 for unripe bananas, which makes them acidic in the natural environment. On the other hand, the pH of ripe bananas is approximately 6.5-6.6, which is less acidic.
          </p>
          <div className="mt-4">
            <Link href="/banana-ph" className="inline-block bg-yellow-400 text-gray-800 font-bold py-2 px-4 rounded hover:bg-yellow-500 transition duration-300">
              Read More
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const PostCard = ({ post }: { post: Post }) => (
  <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <Link href={`/${post.slug}`} className="block">
      <div className="relative aspect-[3/2] w-full overflow-hidden">
        <Image
          src={post.featuredImage?.node.sourceUrl || '/placeholder.svg'}
          alt={post.featuredImage?.node.altText || post.title}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white hover:text-primary transition-colors duration-200">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3" dangerouslySetInnerHTML={{ __html: post.excerpt }} />
        )}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            {post.author?.node.avatar && (
              <Image
                src={post.author.node.avatar.url}
                alt={post.author.node.name}
                width={24}
                height={24}
                className="rounded-full mr-2"
              />
            )}
            <span>{post.author?.node.name}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-4">{new Date(post.date).toLocaleDateString()}</span>
            {post.categories?.nodes[0] && (
              <span className="bg-yellow-400 text-gray-800 px-2 py-1 rounded-full text-xs">
                {post.categories.nodes[0].name}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  </article>
);

interface HomePageProps {
  initialPosts: Post[];
  initialPageInfo: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
}

export default function HomePage({ initialPosts, initialPageInfo }: HomePageProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [pageInfo, setPageInfo] = useState(initialPageInfo);
  const [loading, setLoading] = useState(false);

  const loadMorePosts = async () => {
    if (loading || !pageInfo.hasNextPage) return;
    setLoading(true);
    try {
      const result = await getLatestPosts({
        first: POSTS_PER_PAGE,
        after: pageInfo.endCursor
      }) as GetAllPostsResult;
      
      setPosts((prevPosts) => [...prevPosts, ...result.posts.nodes]);
      setPageInfo(result.posts.pageInfo);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">pH of Banana</h1>
      <FeaturedPost />
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">Latest and Hottest</h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      {pageInfo.hasNextPage && (
        <div className="text-center mt-8">
          <button
            onClick={loadMorePosts}
            disabled={loading}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-2 px-4 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}
