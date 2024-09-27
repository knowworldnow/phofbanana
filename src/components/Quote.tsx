import React from 'react';

interface QuoteProps {
  children: React.ReactNode;
}

export function Quote({ children }: QuoteProps) {
  return (
    <blockquote className="wp-block-quote border-l-4 pl-4 py-2 my-4 italic text-gray-700 dark:text-gray-300">
      {children}
    </blockquote>
  );
}
