import { NextResponse } from 'next/server';
import { submitUrlToIndexNow } from '@/lib/indexnow';
import { submitUrlToGoogle } from '@/lib/googleIndexing';

export async function POST(request: Request) {
  const body = await request.json();
  const { url } = body;

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const [indexNowResult, googleResult] = await Promise.all([
      submitUrlToIndexNow(url),
      submitUrlToGoogle(url)
    ]);

    return NextResponse.json({
      indexNow: indexNowResult,
      google: googleResult
    });
  } catch (error) {
    console.error('Error submitting URL:', error);
    return NextResponse.json({ error: 'Failed to submit URL' }, { status: 500 });
  }
}
