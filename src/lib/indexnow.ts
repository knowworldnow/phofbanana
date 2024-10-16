import fetch from 'node-fetch';

const INDEXNOW_API_ENDPOINT = 'https://api.indexnow.org/v1/submit';
const INDEXNOW_KEY = process.env.INDEXNOW_KEY;
const SITE_URL = process.env.NEXT_PUBLIC_URL || 'https://phofbanana.com';

export async function submitUrlToIndexNow(url: string) {
  if (!INDEXNOW_KEY) {
    console.error('IndexNow API key is not set');
    return;
  }

  const fullUrl = new URL(url, SITE_URL).toString();

  const payload = {
    host: new URL(SITE_URL).hostname,
    key: INDEXNOW_KEY,
    urlList: [fullUrl],
  };

  try {
    const response = await fetch(INDEXNOW_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`IndexNow API responded with status ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log('IndexNow submission successful:', result);
    return result;
  } catch (error) {
    console.error('Error submitting to IndexNow:', error);
    throw error;
  }
}

export async function submitUrlsToIndexNow(urls: string[]) {
  if (!INDEXNOW_KEY) {
    console.error('IndexNow API key is not set');
    return;
  }

  const fullUrls = urls.map(url => new URL(url, SITE_URL).toString());

  const payload = {
    host: new URL(SITE_URL).hostname,
    key: INDEXNOW_KEY,
    urlList: fullUrls,
  };

  try {
    const response = await fetch(INDEXNOW_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`IndexNow API responded with status ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log('IndexNow batch submission successful:', result);
    return result;
  } catch (error) {
    console.error('Error submitting batch to IndexNow:', error);
    throw error;
  }
}
