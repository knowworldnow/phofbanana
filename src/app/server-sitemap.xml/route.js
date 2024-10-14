import { getServerSideSitemap } from 'next-sitemap'

export async function getServerSideProps(ctx) {
  const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL
  const SITE_URL = process.env.NEXT_PUBLIC_URL

  // Fetch posts
  const fetchPosts = async (page = 1, allPosts = []) => {
    const response = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/posts?_fields=slug,modified&per_page=100&page=${page}`)
    const posts = await response.json()
    
    if (posts.length === 0) {
      return allPosts
    }
    
    allPosts = allPosts.concat(posts)
    return fetchPosts(page + 1, allPosts)
  }

  // Fetch pages
  const fetchPages = async () => {
    const response = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/pages?_fields=slug,modified&per_page=100`)
    return await response.json()
  }

  const [posts, pages] = await Promise.all([fetchPosts(), fetchPages()])

  const postFields = posts.map((post) => ({
    loc: `${SITE_URL}/${post.slug}`,
    lastmod: new Date(post.modified).toISOString(),
    changefreq: 'weekly',
    priority: 0.7,
  }))

  const pageFields = pages.map((page) => ({
    loc: `${SITE_URL}/${page.slug}`,
    lastmod: new Date(page.modified).toISOString(),
    changefreq: 'monthly',
    priority: 0.5,
  }))

  const fields = [...postFields, ...pageFields]

  return getServerSideSitemap(ctx, fields)
}

export default function Sitemap() {}
