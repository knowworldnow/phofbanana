const SITE_URL = process.env.NEXT_PUBLIC_URL || 'https://phofbanana.com';
const INDEXNOW_KEY = '5bef1020134546269a110813c3a28880';

export async function submitUrlToIndexNow(url: string) {
  return submitUrlsToIndexNow([url]);
}

export async function submitUrlsToIndexNow(urls: string[]) {
  const indexNowUrl = new URL('https://api.indexnow.org/v1/submit');
  indexNowUrl.searchParams.append('key', INDEXNOW_KEY);
  indexNowUrl.searchParams.append('keyLocation', `${SITE_URL}/${INDEXNOW_KEY}.txt`);

  urls.forEach(url => indexNowUrl.searchParams.append('url', url));

  try {
    const response = await fetch(indexNowUrl.toString(), { method: 'GET' });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.text();
    console.log('IndexNow submission result:', result);
    return result;
  } catch (error) {
    console.error('Error submitting to IndexNow:', error);
    throw error;
  }
}
