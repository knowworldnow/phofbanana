'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getLatestPosts } from '../lib/faust-api';
import { Post, GetAllPostsResult } from '../types';

const POSTS_PER_PAGE = 24; 

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
              <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
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
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">Latest and Hottest</h1>
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
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}
