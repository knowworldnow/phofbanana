import { NextResponse } from 'next/server'

export async function GET() {
  const sitemapUrl = `${process.env.NEXT_PUBLIC_URL}/api/sitemap`
  return NextResponse.redirect(sitemapUrl)
}
