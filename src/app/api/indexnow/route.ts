import { NextResponse } from 'next/server';
import { submitUrlsToIndexNow } from '@/lib/indexnow';

export async function POST(request: Request) {
  const body = await request.json();
  const { url, urls } = body;

  if (!url && (!urls || !Array.isArray(urls) || urls.length === 0)) {
    return NextResponse.json({ error: 'Valid URL or URLs array is required' }, { status: 400 });
  }

  try {
    const urlsToSubmit = url ? [url] : urls;
    const result = await submitUrlsToIndexNow(urlsToSubmit);
    return NextResponse.json({ success: true, message: 'IndexNow submission successful', result });
  } catch (error) {
    console.error('Error submitting to IndexNow:', error);
    return NextResponse.json({ error: 'Failed to submit URL(s) to IndexNow' }, { status: 500 });
  }
}
