import { NextResponse } from 'next/server';

const INDEXNOW_KEY = '5bef1020134546269a110813c3a28880';
const SITE_URL = process.env.NEXT_PUBLIC_URL || 'https://phofbanana.com';

export async function POST(request: Request) {
  const body = await request.json();
  const { url } = body;

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  const indexNowUrl = new URL('https://api.indexnow.org/v1/submit');
  indexNowUrl.searchParams.append('key', INDEXNOW_KEY);
  indexNowUrl.searchParams.append('keyLocation', `${SITE_URL}/${INDEXNOW_KEY}.txt`);
  indexNowUrl.searchParams.append('url', url);

  try {
    const response = await fetch(indexNowUrl.toString(), { method: 'GET' });
    const responseText = await response.text();

    if (response.ok) {
      console.log('IndexNow submission successful:', responseText);
      return NextResponse.json({ success: true, message: responseText });
    } else {
      console.error('IndexNow submission failed:', responseText);
      return NextResponse.json({ error: responseText }, { status: response.status });
    }
  } catch (error) {
    console.error('Error submitting to IndexNow:', error);
    return NextResponse.json({ error: 'Failed to submit URL' }, { status: 500 });
  }
}
