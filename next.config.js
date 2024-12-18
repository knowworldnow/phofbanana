const { withFaust } = require('@faustwp/core');
const { createSecureHeaders } = require('next-secure-headers');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['wordpress-1082925-3789442.cloudwaysapps.com'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: createSecureHeaders({
          contentSecurityPolicy: {
            directives: {
              defaultSrc: ["'self'", 'https:'],
              styleSrc: ["'self'", "'unsafe-inline'", 'https:'],
              scriptSrc: ["'self'", "'unsafe-eval'", "'unsafe-inline'", 'https:'],
              imgSrc: ["'self'", 'data:', 'https:'],
              connectSrc: ["'self'", 'https:'],
              frameSrc: [process.env.NEXT_PUBLIC_WORDPRESS_URL, 'https:'],
              fontSrc: ["'self'", 'https:'],
            },
          },
          referrerPolicy: 'strict-origin-when-cross-origin',
        }),
      },
      {
        source: '/5bef1020134546269a110813c3a28880.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/:slug',
        destination: '/post/:slug',
      },
      {
        source: '/rss.xml',
        destination: '/api/rss',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/types-of-bananas',
        destination: '/different-types-of-bananas',
        permanent: true,
      },
      {
        source: '/can-you-eat-banana-peels',
        destination: '/banana-peels-edible',
        permanent: true,
      },
      {
        source: '/reduce-dark-circles-and-wrinkles-with-banana-peels',
        destination: '/banana-peel-for-dark-circles',
        permanent: true,
      },
      {
        source: '/root-to-leaves-all-the-parts-of-banana-tree',
        destination: '/parts-of-banana-tree',
        permanent: true,
      },
      {
        source: '/large-banana-calories-more-strength',
        destination: '/large-banana-calories',
        permanent: true,
      },
      {
        source: '/how-to-keep-bananas-fresh-after-peelingbest-tips-and-hacks',
        destination: '/how-to-keep-bananas-fresh-after-peeling',
        permanent: true,
      },
      {
        source: '/do-bananas-fit-on-a-ketogenic-diet',
        destination: '/are-bananas-keto-friendly',
        permanent: true,
      },
      {
        source: '/how-much-do-bananas-have-protein',
        destination: '/banana-protein',
        permanent: true,
      },
      {
        source: '/can-you-die-by-eating-bananas',
        destination: '/how-many-bananas-will-kill-you',
        permanent: true,
      },
      {
        source: '/pied-banana-for-python-facts-info-price-care-guide',
        destination: '/pied-banana-ball-python-facts-info-price-care-guide',
        permanent: true,
      },
      {
        source: '/pied-banana-ball-python',
        destination: '/pied-banana-ball-python-facts-info-price-care-guide',
        permanent: true,
      },
      {
        source: '/can-we-eat-banana-and-orange-together-nutrition-value-benefits-side-effects-and-more',
        destination: '/can-we-eat-banana-and-orange-together',
        permanent: true,
      },
    ];
  },
};

module.exports = withFaust(nextConfig);
