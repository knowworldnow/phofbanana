import { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://phofbanana.com'
const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://wordpress-1082925-3789442.cloudwaysapps.com'

async function fetchTotalPages() {
  const response = await fetch(`${WORDPRESS_API_URL}/wp-json/sitemap/v1/totalpages`)
  return await response.json()
}

async function fetchPosts(pageNo: number, postType: string, perPage: number) {
  const response = await fetch(`${WORDPRESS_API_URL}/wp-json/sitemap/v1/posts?pageNo=${pageNo}&postType=${postType}&perPage=${perPage}`)
  return await response.json()
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const totalPages = await fetchTotalPages()
  const sitemapEntries: MetadataRoute.Sitemap = []

  // Add static pages
  sitemapEntries.push(
    { url: SITE_URL, lastModified: new Date() },
    { url: `${SITE_URL}/about`, lastModified: new Date() },
    { url: `${SITE_URL}/contact`, lastModified: new Date() }
  )

  // Fetch and add blog posts
  const totalPosts = parseInt(totalPages.post)
  const postsPerPage = 100
  const totalPages = Math.ceil(totalPosts / postsPerPage)

  for (let page = 1; page <= totalPages; page++) {
    const posts = await fetchPosts(page, 'post', postsPerPage)
    posts.forEach((post: any) => {
      sitemapEntries.push({
        url: `${SITE_URL}${post.url}`,
        lastModified: new Date(post.post_modified_date)
      })
    })
  }

  return sitemapEntries
}
