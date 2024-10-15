import { NextResponse } from 'next/server';
import { submitUrlToIndexNow } from '@/lib/indexnow';
import { submitUrlToGoogleIndexing } from '@/lib/google-indexing';

export async function POST(request: Request) {
  const body = await request.json();
  const { post_url, post_status } = body;

  if (!post_url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    // Submit to IndexNow (Bing)
    const indexNowResult = await submitUrlToIndexNow(post_url);

    // Submit to Google Indexing API
    const googleResult = await submitUrlToGoogleIndexing(post_url, post_status === 'trash' ? 'remove' : 'update');

    return NextResponse.json({ 
      success: true, 
      message: 'URL submitted to search engines',
      indexNowResult,
      googleResult
    });
  } catch (error) {
    console.error('Error submitting to search engines:', error);
    return NextResponse.json({ error: 'Failed to submit URL to search engines' }, { status: 500 });
  }
}
