import Link from 'next/link';
import { getLatestPosts, getAllCategories } from '../../lib/faust-api';
import { Category, GetAllPostsResult } from '../../types';

export const revalidate = 300;

export async function generateStaticParams() {
  const result = await getLatestPosts({ first: 20 }) as GetAllPostsResult;
  return result.posts.nodes.map((post) => ({
    slug: post.slug,
  }));
}

export default async function CategoriesPage() {
  const categories: Category[] = await getAllCategories();
  
  // Create a mutable copy of the categories array and sort it
  const sortedCategories = [...categories].sort((a, b) => (b.count ?? 0) - (a.count ?? 0));

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">Explore Our Categories</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedCategories.map((category, index) => (
          <Link href={`/category/${category.slug}`} key={category.id} className="block group">
            <div className={`p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl 
              ${index % 3 === 0 ? 'bg-blue-100 dark:bg-blue-900' : 
                index % 3 === 1 ? 'bg-green-100 dark:bg-green-900' : 
                'bg-purple-100 dark:bg-purple-900'}`}>
              <h2 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-white group-hover:text-primary transition-colors duration-200">
                {category.name}
              </h2>
              <p className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
                {category.count ?? 0} {(category.count ?? 0) === 1 ? 'Article' : 'Articles'}
              </p>
              {category.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                  {category.description}
                </p>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Explore Category
                </span>
                <svg 
                  className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors duration-200" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Categories - pH of Banana',
  description: 'Explore all categories on pH of Banana',
};
