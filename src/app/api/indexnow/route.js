import { NextResponse } from 'next/server';

export async function POST(request) {
  const { url } = await request.json();
  
  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  const apiKey = '5bef1020134546269a110813c3a28880';
  const indexNowUrl = `https://www.bing.com/indexnow?url=${encodeURIComponent(url)}&key=${apiKey}`;

  try {
    const response = await fetch(indexNowUrl, { method: 'GET' });
    const data = await response.text();

    if (response.ok) {
      return NextResponse.json({ message: 'URL submitted successfully', response: data }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Failed to submit URL', response: data }, { status: response.status });
    }
  } catch (error) {
    return NextResponse.json({ error: 'An error occurred while submitting the URL' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
