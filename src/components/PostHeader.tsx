import Link from 'next/link';
import AuthorInfo from './AuthorInfo';

interface Author {
  name: string;
}

interface Category {
  name: string;
  slug: string;
}

interface PostHeaderProps {
  title: string;
  author: Author;
  date: string;
  category?: Category;
}

export default function PostHeader({ title, author, date, category }: PostHeaderProps) {
  return (
    <header className="mb-8">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
        <AuthorInfo 
          author={author.name}
          date={date}
          category={category?.name || ''}
          categorySlug={category?.slug}
        />
        {category && (
          <>
            <span className="mx-2">•</span>
            <Link href={`/category/${category.slug}`} className="hover:underline">
              {category.name}
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
