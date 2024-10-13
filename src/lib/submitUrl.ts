const SITE_URL = process.env.NEXT_PUBLIC_URL || 'https://phofbanana.com';

export async function submitUrl(url: string) {
  const apiUrl = `${SITE_URL}/api/submit-url`;
  
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
    console.log('URL submission result:', result);
    return result;
  } catch (error) {
    console.error('Error submitting URL:', error);
    throw error;
  }
}
