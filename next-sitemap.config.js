const SITE_URL = process.env.NEXT_PUBLIC_URL;

module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: false,
  exclude: ['/api/*'],
  outDir: 'public',
  sitemapSize: 5000,
  additionalPaths: async (config) => {
    return [{ loc: '/server-sitemap.xml', priority: 0.7, changefreq: 'daily' }];
  },
};
