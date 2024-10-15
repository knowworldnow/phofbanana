import { google } from 'googleapis';

const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;

async function getAccessToken() {
  const jwtClient = new google.auth.JWT(
    GOOGLE_CLIENT_EMAIL,
    undefined, // Changed from null to undefined
    GOOGLE_PRIVATE_KEY,
    ['https://www.googleapis.com/auth/indexing'],
    undefined // Changed from null to undefined
  );

  try {
    const tokens = await jwtClient.authorize();
    return tokens.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
}

export async function submitUrlToGoogleIndexing(url: string, type: 'update' | 'remove') {
  const accessToken = await getAccessToken();

  const response = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      url: url,
      type: type === 'remove' ? 'URL_DELETED' : 'URL_UPDATED',
    }),
  });

  if (!response.ok) {
    throw new Error(`Google Indexing API error: ${response.statusText}`);
  }

  return await response.json();
}
