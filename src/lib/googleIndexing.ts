import { google } from 'googleapis';

const key = {
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
};

const jwtClient = new google.auth.JWT({
  email: key.client_email,
  key: key.private_key,
  scopes: ['https://www.googleapis.com/auth/indexing'],
});

const searchconsole = google.indexing({ version: 'v3', auth: jwtClient });

export async function submitUrlToGoogle(url: string) {
  try {
    const res = await searchconsole.urlNotifications.publish({
      requestBody: {
        url: url,
        type: 'URL_UPDATED'
      }
    });
    console.log('Google Search Console submission successful:', res.data);
    return { success: true, message: res.data };
  } catch (error) {
    console.error('Error submitting to Google Search Console:', error);
    return { success: false, error: String(error) };
  }
}
