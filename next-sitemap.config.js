const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL
const SITE_URL = process.env.NEXT_PUBLIC_URL

module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: false, // Set this to false
  exclude: ['/api/*'],
  outDir: 'public',
  additionalPaths: async (config) => {
    return [{ loc: '/server-sitemap.xml', priority: 0.7, changefreq: 'daily' }]
  },
}
