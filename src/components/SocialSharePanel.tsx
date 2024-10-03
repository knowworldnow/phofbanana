'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface SocialSharePanelProps {
  url: string;
  title: string;
  description: string;
  imageUrl: string;
}

const SocialSharePanel: React.FC<SocialSharePanelProps> = ({ url, title, description, imageUrl }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const shareLinks = [
    {
      name: 'Facebook',
      icon: '/facebook.svg',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    },
    {
      name: 'Twitter',
      icon: '/twitter.svg',
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
    },
    {
      name: 'LinkedIn',
      icon: '/linkedin.svg',
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}`
    },
    {
      name: 'WhatsApp',
      icon: '/whatsapp.svg',
      url: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`
    },
    {
      name: 'Pinterest',
      icon: '/pinterest.svg',
      url: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(imageUrl)}&description=${encodeURIComponent(title)}`
    },
  ];

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed z-50 left-0 top-1/2 -translate-y-1/2">
      <div className="flex flex-col items-center py-1 px-1 rounded-r-lg">
        <span className="text-gray-600 dark:text-gray-300 text-xs font-semibold mb-1 writing-vertical-lr">Share</span>
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity mb-1 last:mb-0"
            aria-label={`Share on ${link.name}`}
          >
            <Image 
              src={link.icon} 
              alt={`${link.name} icon`} 
              width={28} 
              height={28} 
              className="w-7 h-7" 
            />
          </a>
        ))}
      </div>
    </div>
  );
};

export default SocialSharePanel;
