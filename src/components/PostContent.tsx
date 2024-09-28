'use client';

import React, { useEffect, useState } from 'react';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from './Table';
import OptimizedImage from './OptimizedImage';

interface PostContentProps {
  content: string;
}

export function PostContent({ content }: PostContentProps) {
  const [processedContent, setProcessedContent] = useState<React.ReactNode>(null);

  useEffect(() => {
    const processContent = (content: string): React.ReactNode => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');

      const processNode = (node: Node): React.ReactNode => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent;
        }

        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element;
          const children = Array.from(element.childNodes).map(processNode);

          switch (element.tagName.toLowerCase()) {
            case 'img':
              return (
                <OptimizedImage
                  src={element.getAttribute('src') || ''}
                  alt={element.getAttribute('alt') || ''}
                  className="w-full h-auto"
                />
              );
            case 'table':
              return <Table>{children}</Table>;
            case 'thead':
              return <TableHead>{children}</TableHead>;
            case 'tbody':
              return <TableBody>{children}</TableBody>;
            case 'tr':
              return <TableRow>{children}</TableRow>;
            case 'th':
              return <TableHeader>{children}</TableHeader>;
            case 'td':
              return <TableCell>{children}</TableCell>;
            case 'blockquote':
              return <blockquote className="wp-block-quote">{children}</blockquote>;
            case 'ul':
            case 'ol':
              return React.createElement(
                element.tagName.toLowerCase(),
                { className: `wp-block-list ${element.className || ''}`.trim() },
                children
              );
            default:
              if (element.classList.contains('wp-block-pullquote')) {
                return <aside className="wp-block-pullquote">{children}</aside>;
              }
              const Tag = element.tagName.toLowerCase() as keyof JSX.IntrinsicElements;
              const classes = Array.from(element.classList).map(cls => `wp-${cls}`).join(' ');
              return React.createElement(Tag, { className: classes || undefined }, children);
          }
        }

        return null;
      };

      return processNode(doc.body);
    };

    setProcessedContent(processContent(content));
  }, [content]);

  if (!processedContent) {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }

  return (
    <div className="prose prose-lg dark:prose-invert max-w-none wp-content">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl sm:max-w-3xl lg:max-w-4xl xl:max-w-5xl">
        {processedContent}
      </div>
    </div>
  );
}
