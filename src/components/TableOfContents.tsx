'use client'

import React, { useEffect, useState, useCallback, useRef } from 'react';
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
  const tocRef = useRef<HTMLDivElement>(null);
  const headingsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const generateTOC = () => {
      const doc = new DOMParser().parseFromString(content, 'text/html');
      const headings = doc.querySelectorAll('h2');
      const tocItems: TOCItem[] = [];

      headings.forEach((heading, index) => {
        const id = heading.id || `toc-heading-${index}`;
        const text = heading.textContent || '';

        tocItems.push({ id, text });

        // Update the actual content with IDs
        const contentHeading = document.querySelector(`h2:nth-of-type(${index + 1})`);
        if (contentHeading && !contentHeading.id) {
          contentHeading.id = id;
        }
      });

      setToc(tocItems);
      headingsRef.current = Array.from(document.querySelectorAll('h2'));
    };

    generateTOC();
  }, [content]);

  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY;

    for (let i = headingsRef.current.length - 1; i >= 0; i--) {
      const heading = headingsRef.current[i];
      if (heading.offsetTop <= scrollPosition + 100) {
        setActiveId(heading.id);
        break;
      }
    }
  }, []);

  useEffect(() => {
    const debouncedHandleScroll = debounce(handleScroll, 100);
    window.addEventListener('scroll', debouncedHandleScroll);
    handleScroll(); // Call once to set initial active state
    return () => window.removeEventListener('scroll', debouncedHandleScroll);
  }, [handleScroll]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveId(id);
    }
  }, []);

  if (toc.length === 0) {
    return null;
  }

  return (
    <nav className="sticky top-8 hidden lg:block max-h-[calc(100vh-4rem)] overflow-auto">
      <div ref={tocRef} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
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
                onClick={(e) => handleClick(e, item.id)}
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
