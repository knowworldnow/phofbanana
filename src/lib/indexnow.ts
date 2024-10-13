const INDEXNOW_KEY = '5bef1020134546269a110813c3a28880';
const SITE_URL = process.env.NEXT_PUBLIC_URL || 'https://phofbanana.com';

export async function submitUrlToIndexNow(url: string) {
  const indexNowUrl = new URL('https://api.indexnow.org/v1/submit');
  indexNowUrl.searchParams.append('key', INDEXNOW_KEY);
  indexNowUrl.searchParams.append('keyLocation', `${SITE_URL}/${INDEXNOW_KEY}.txt`);
  indexNowUrl.searchParams.append('urlList', url);

  try {
    const response = await fetch(indexNowUrl.toString(), { method: 'GET' });
    const responseText = await response.text();

    if (response.ok) {
      console.log('IndexNow submission successful:', responseText);
      return { success: true, message: responseText };
    } else {
      console.error('IndexNow submission failed:', responseText);
      return { success: false, error: responseText };
    }
  } catch (error) {
    console.error('Error submitting to IndexNow:', error);
    return { success: false, error: String(error) };
  }
}
