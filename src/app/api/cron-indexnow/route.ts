import { NextResponse } from 'next/server';
import { main as submitToIndexNow } from '@/lib/indexnow';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  
  if (token !== process.env.CRON_SECRET_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await submitToIndexNow();
    return NextResponse.json({ message: 'IndexNow submission completed successfully' });
  } catch (error) {
    console.error('Error during IndexNow submission:', error);
    return NextResponse.json({ error: 'Failed to complete IndexNow submission' }, { status: 500 });
  }
}
