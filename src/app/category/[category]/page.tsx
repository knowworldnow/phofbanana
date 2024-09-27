import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostsByCategory, getCategoryBySlug } from '../../../lib/faust-api';
import { Post, Category } from '../../../types';

const POSTS_PER_PAGE = 21; // Changed back to 21 for 3 columns

function PostCard({ post }: { post: Post }) {
  return (
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
            <span>{post.author?.node.name}</span>
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
}

function Pagination({ currentPage, totalPages, baseUrl }: { currentPage: number; totalPages: number; baseUrl: string }) {
  return (
    <div className="flex justify-center mt-8 space-x-2">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
        <Link
          key={pageNum}
          href={`${baseUrl}?page=${pageNum}`}
          className={`px-4 py-2 rounded-full ${
            pageNum === currentPage 
              ? 'bg-primary text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
          } transition-colors duration-200`}
        >
          {pageNum}
        </Link>
      ))}
    </div>
  );
}

export default async function CategoryPage({ params, searchParams }: { params: { category: string }; searchParams: { page?: string } }) {
  const categorySlug = params.category;
  const page = Number(searchParams.page) || 1;
  const category: Category | null = await getCategoryBySlug(categorySlug);
  
  if (!category) {
    notFound();
  }

  const after = page > 1 ? ((page - 1) * POSTS_PER_PAGE).toString() : null;
  const result = await getPostsByCategory(categorySlug, POSTS_PER_PAGE, after);
  const posts: Post[] = result.posts.nodes;
  const totalPosts = category.count;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  if (posts.length === 0 && page === 1) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white capitalize">{category.name}</h1>
        <p className="text-center text-gray-600 dark:text-gray-300">No posts found in this category.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white capitalize">{category.name}</h1>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      {totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} baseUrl={`/category/${categorySlug}`} />
      )}
    </div>
  );
}

export async function generateMetadata({ params }: { params: { category: string } }) {
  const categorySlug = params.category;
  const category = await getCategoryBySlug(categorySlug);

  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: `${category.name} - pH of Banana`,
    description: `Explore the latest posts in the ${category.name} category on pH Of Banana. Stay informed with our curated content on bananas.`,
    openGraph: {
      title: `${category.name} - pH of Banana`,
      description: `Discover articles in the ${category.name} category on pH of Banana. Get insights on bananas and all you need to know about them.`,
      url: `https://phofbanana.com/category/${categorySlug}`,
      siteName: 'pH of Banana',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} - pH of Banana`,
      description: `Explore ${category.name} articles on pH of Banana for all the information on Bananas .`,
    },
  };
}
