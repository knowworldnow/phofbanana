import Link from 'next/link';

interface AuthorInfoProps {
  author: string;
  date: string;
  category: string;
  categorySlug?: string;
}

export default function AuthorInfo({ author, date, category, categorySlug }: AuthorInfoProps) {
  return (
    <div className="flex flex-col text-sm text-gray-600 dark:text-gray-400">
      <p className="font-semibold text-base">{author}</p>
      <div>
        <time dateTime={date}>{new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
        {category && (
          <>
            <span className="mx-2">·</span>
            {categorySlug ? (
              <Link href={`/category/${categorySlug}`} className="text-blue-600 hover:underline">
                {category}
              </Link>
            ) : (
              <span>{category}</span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
