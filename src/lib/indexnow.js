const https = require('https');
const xml2js = require('xml2js');
const { submitUrl } = require('./googleIndexing');

const sitemapUrl = `${process.env.NEXT_PUBLIC_URL}/sitemap.xml`;
const host = new URL(process.env.NEXT_PUBLIC_URL).hostname;
const key = '5bef1020134546269a110813c3a28880';
const keyLocation = `${process.env.NEXT_PUBLIC_URL}/${key}.txt`;

async function fetchSitemap(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function parseSitemap(xmlData) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xmlData, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

function filterUrlsByDate(sitemap, date) {
  const urls = sitemap.urlset.url;
  return urls
    .filter(url => new Date(url.lastmod[0]) > date)
    .map(url => url.loc[0]);
}

async function submitToIndexNow(urlList) {
  const data = JSON.stringify({ host, key, keyLocation, urlList });

  const options = {
    hostname: 'api.indexnow.org',
    port: 443,
    path: '/IndexNow',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': data.length
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => responseData += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, statusMessage: res.statusMessage, data: responseData }));
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function submitToIndexNowAndGoogle(urlList) {
  const indexNowResponse = await submitToIndexNow(urlList);
  
  const googleResponses = await Promise.all(urlList.map(async (url) => {
    try {
      const response = await submitUrl(url);
      console.log('URL submitted to Google Search Console:', url);
      return { url, success: true, response };
    } catch (error) {
      console.error('Error submitting to Google Search Console:', url, error);
      return { url, success: false, error: error.message };
    }
  }));

  return {
    indexNow: indexNowResponse,
    googleSearchConsole: googleResponses
  };
}

async function main(modifiedSinceDate = '1970-01-01') {
  try {
    const xmlData = await fetchSitemap(sitemapUrl);
    const sitemap = await parseSitemap(xmlData);
    const filteredUrls = filterUrlsByDate(sitemap, new Date(modifiedSinceDate));

    if (filteredUrls.length > 0) {
      const response = await submitToIndexNowAndGoogle(filteredUrls);
      console.log('IndexNow and Google Search Console API Response:', response);
    } else {
      console.log('No URLs modified since the specified date.');
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

module.exports = { main };
