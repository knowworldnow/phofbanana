import React from 'react';

interface QuoteProps {
  children: React.ReactNode;
}

export function Quote({ children }: QuoteProps) {
  return (
    <blockquote className="quote-box">
      <div className="quote-content">{children}</div>
    </blockquote>
  );
}
