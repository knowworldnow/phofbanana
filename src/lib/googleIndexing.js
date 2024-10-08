const { google } = require('googleapis');

const key = {
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
};

const jwtClient = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key,
  ['https://www.googleapis.com/auth/indexing'],
  null
);

const searchconsole = google.indexing({
  version: 'v3',
  auth: jwtClient
});

async function submitUrl(url) {
  try {
    const res = await searchconsole.urlNotifications.publish({
      requestBody: {
        url: url,
        type: 'URL_UPDATED'
      }
    });
    console.log('URL submitted to Google Search Console:', url, 'Response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error submitting URL to Google Search Console:', url, 'Error:', error);
    throw error;
  }
}

module.exports = { submitUrl };
