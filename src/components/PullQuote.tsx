import React from 'react';

interface PullQuoteProps {
  children: React.ReactNode;
}

export function PullQuote({ children }: PullQuoteProps) {
  return (
    <aside className="wp-block-pullquote text-2xl font-semibold text-center border-t-4 border-b-4 py-4 my-8 text-gray-800 dark:text-gray-200">
      {children}
    </aside>
  );
}
