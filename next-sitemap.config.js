/** @type {import('next-sitemap').IConfig} */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://phofbanana.com'

module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  exclude: ['/wordpress-sitemap.xml'],
  robotsTxtOptions: {
    additionalSitemaps: [
      `${SITE_URL}/wordpress-sitemap.xml`,
    ],
  },
  transform: (config, path) => {
    // Exclude date-based archive pages
    if (path.match(/\/\d{4}\/\d{2}\/\d{2}\/.*/gim)) {
      return null
    }

    return {
      loc: path,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    }
  },
}
