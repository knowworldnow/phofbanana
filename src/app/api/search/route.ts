import { NextResponse } from 'next/server';
import { searchPosts } from '@/lib/faust-api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Missing search query' }, { status: 400 });
  }

  try {
    const results = await searchPosts(query);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'An error occurred while searching' }, { status: 500 });
  }
}
