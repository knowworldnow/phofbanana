'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ToggleTheme from './ToggleTheme';
import SearchBar from './SearchBar';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-background text-foreground transition-all duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button 
              onClick={toggleMenu} 
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
              className="text-foreground md:hidden"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="hidden md:block">
              <SearchBar className="max-w-xs" />
            </div>
          </div>

          <div className="flex-shrink-0">
            <Link href="/">
              <Image src="/logo.png" alt="pH of Banana" width={100} height={40} />
            </Link>
          </div>

          <div className="flex items-center">
            <ToggleTheme />
            <button 
              className="md:hidden ml-2 text-foreground p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={toggleSearch}
              aria-label="Toggle search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <nav className="hidden md:flex space-x-4 ml-4">
              <Link href="/" className="font-bold hover:text-gray-600 dark:hover:text-gray-300">Home</Link>
              <Link href="/about" className="font-bold hover:text-gray-600 dark:hover:text-gray-300">About</Link>
              <Link href="/contact" className="font-bold hover:text-gray-600 dark:hover:text-gray-300">Contact</Link>
              <Link href="/categories" className="font-bold hover:text-gray-600 dark:hover:text-gray-300">Categories</Link>
              <Link href="/rss.xml" className="font-bold hover:text-gray-600 dark:hover:text-gray-300">RSS Feed</Link>
            </nav>
          </div>
        </div>
      </div>

      {isSearchOpen && (
        <div className="md:hidden px-4 pb-4">
          <SearchBar />
        </div>
      )}

      {isMenuOpen && (
        <nav className="md:hidden bg-background py-2">
          <Link href="/" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Home</Link>
          <Link href="/about" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">About</Link>
          <Link href="/contact" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Contact</Link>
          <Link href="/categories" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Categories</Link>
          <Link href="/rss.xml" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">RSS Feed</Link>
        </nav>
      )}
    </header>
  );
}
