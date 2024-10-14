const SITE_URL = process.env.NEXT_PUBLIC_URL || 'https://phofbanana.com';

export async function submitUrlToIndexNow(url: string) {
  const apiUrl = `${SITE_URL}/api/indexnow`;
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('IndexNow submission result:', result);
    return result;
  } catch (error) {
    console.error('Error submitting to IndexNow:', error);
    throw error;
  }
}
