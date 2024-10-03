'use client';

import { useState } from 'react';
import Link from 'next/link';
import ToggleTheme from './ToggleTheme';
import SearchBar from './SearchBar';
import Logo from './Logo';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  return (
    <header className="w-full bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section: Hamburger menu (visible on mobile) */}
          <div className="flex items-center md:hidden">
            <button 
              onClick={toggleMenu} 
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
              className="text-foreground"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Left section: Search (visible on desktop) */}
          <div className="hidden md:block w-1/3">
            <SearchBar className="max-w-xs" />
          </div>

          {/* Center section: Logo */}
          <div className="flex-1 flex justify-center">
            <Logo />
          </div>

          {/* Right section: Theme Toggle and Search Icon (mobile) */}
          <div className="flex items-center">
            <ToggleTheme />
            <button 
              className="md:hidden ml-2 text-foreground"
              onClick={toggleSearch}
              aria-label="Toggle search"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            {/* Desktop Navigation */}
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

      {/* Mobile search bar */}
      {isSearchOpen && (
        <div className="md:hidden px-4 pb-4">
          <SearchBar />
        </div>
      )}

      {/* Mobile menu */}
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
