'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { searchPosts } from '../../lib/faust-api';
import { Post } from '../../types';
import Link from 'next/link';
import Image from 'next/image';

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams ? searchParams.get('q') || '' : '';
  const [results, setResults] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (query) {
        setIsLoading(true);
        setError(null);
        try {
          const searchResults = await searchPosts(query);
          setResults(searchResults);
        } catch (err) {
          setError('Failed to fetch search results. Please try again.');
          console.error('Search error:', err);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
      }
    };

    fetchResults();
  }, [query]);

  if (isLoading) {
    return <div className="text-center py-8 text-xl">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-xl text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Search Results: {query ? `"${query}"` : 'No Query'}
      </h1>

      {results.length === 0 && query ? (
        <div className="text-center py-8 text-xl">No results found for &quot;{query}&quot;</div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {results.map((post) => (
            <article key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <Link href={`/${post.slug}`} className="block">
                <div className="relative aspect-[3/2] w-full overflow-hidden">
                  <Image
                    src={post.featuredImage?.node.sourceUrl || '/placeholder.jpg'}
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
                    <div>
                      <span className="mr-4">{new Date(post.date).toLocaleDateString()}</span>
                      <span>{post.author.node.name}</span>
                    </div>
                    {post.categories?.nodes[0] && (
                      <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                        {post.categories.nodes[0].name}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
