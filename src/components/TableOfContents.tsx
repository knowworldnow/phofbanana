'use client'

import { useEffect, useState, useCallback } from 'react';
import { debounce } from 'lodash';

interface TOCItem {
  id: string;
  text: string;
}

interface TableOfContentsProps {
  content: string;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [toc, setToc] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const doc = new DOMParser().parseFromString(content, 'text/html');
    const headings = doc.querySelectorAll('h2');
    const tocItems: TOCItem[] = Array.from(headings).map((heading) => ({
      id: heading.id,
      text: heading.textContent || '',
    }));
    setToc(tocItems);
  }, [content]);

  const handleScroll = useCallback(() => {
    const headings = document.querySelectorAll('h2');
    const scrollPosition = window.scrollY;

    for (let i = headings.length - 1; i >= 0; i--) {
      const heading = headings[i] as HTMLElement;
      if (heading.offsetTop <= scrollPosition + 100) {
        setActiveId(heading.id);
        break;
      }
    }
  }, []);

  useEffect(() => {
    const debouncedHandleScroll = debounce(handleScroll, 100);
    window.addEventListener('scroll', debouncedHandleScroll);
    return () => window.removeEventListener('scroll', debouncedHandleScroll);
  }, [handleScroll]);

  if (toc.length === 0) {
    return null;
  }

  return (
    <nav className="sticky top-8 hidden lg:block max-h-[calc(100vh-4rem)] overflow-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Table of Contents</h2>
        <ul className="space-y-2">
          {toc.map((item) => (
            <li 
              key={item.id} 
              className="py-1 font-semibold"
            >
              <a 
                href={`#${item.id}`} 
                className={`block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 ${
                  activeId === item.id ? 'text-blue-600 dark:text-blue-400' : ''
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(item.id);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
