import { NextResponse } from 'next/server'

export async function GET() {
  const rssUrl = `${process.env.NEXT_PUBLIC_URL}/api/rss`
  return NextResponse.redirect(rssUrl)
}
