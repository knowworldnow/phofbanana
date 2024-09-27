import { NextResponse } from 'next/server'

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL
const SITE_URL = process.env.NEXT_PUBLIC_URL
const SITE_TITLE = 'Daily Fornex' // Replace with your site title
const SITE_DESCRIPTION = 'Your daily dose of informative updates' 

async function fetchRecentPosts() {
  const response = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/posts?_fields=id,title,excerpt,slug,date,modified&per_page=10&orderby=date&order=desc`)
  const posts = await response.json()
  return posts
}

function generateRSSXml(posts) {
  const items = posts.map(post => `
    <item>
      <title><![CDATA[${post.title.rendered}]]></title>
      <link>${SITE_URL}/${post.slug}</link>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <guid isPermaLink="false">${SITE_URL}/${post.slug}</guid>
      <description><![CDATA[${post.excerpt.rendered}]]></description>
      <content:encoded><![CDATA[${post.excerpt.rendered}]]></content:encoded>
    </item>
  `).join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:wfw="http://wellformedweb.org/CommentAPI/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
  xmlns:slash="http://purl.org/rss/1.0/modules/slash/"
>
  <channel>
    <title>${SITE_TITLE}</title>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <link>${SITE_URL}</link>
    <description>${SITE_DESCRIPTION}</description>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <sy:updatePeriod>hourly</sy:updatePeriod>
    <sy:updateFrequency>1</sy:updateFrequency>
    ${items}
  </channel>
</rss>`
}

export async function GET() {
  try {
    const posts = await fetchRecentPosts()
    const rssContent = generateRSSXml(posts)

    return new NextResponse(rssContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
      },
    })
  } catch (error) {
    console.error('Error generating RSS feed:', error)
    return new NextResponse('Error generating RSS feed', { status: 500 })
  }
}
