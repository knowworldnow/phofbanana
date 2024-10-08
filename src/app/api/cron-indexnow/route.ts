import { NextResponse } from 'next/server';
import { main as submitToIndexNowAndGoogle } from '@/lib/indexnow';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  
  if (token !== process.env.CRON_SECRET_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await submitToIndexNowAndGoogle();
    return NextResponse.json({
      message: 'IndexNow and Google Search Console submission completed successfully',
      result
    });
  } catch (error) {
    console.error('Error during IndexNow and Google Search Console submission:', error);
    return NextResponse.json({
      error: 'Failed to complete IndexNow and Google Search Console submission',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
