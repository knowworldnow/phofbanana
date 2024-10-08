import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const apiKey = '5bef1020134546269a110813c3a28880';
    const indexNowUrl = `https://www.bing.com/indexnow?url=${encodeURIComponent(url)}&key=${apiKey}`;

    try {
      const response = await fetch(indexNowUrl, { method: 'GET' });
      const data = await response.text();

      if (response.ok) {
        res.status(200).json({ message: 'URL submitted successfully', response: data });
      } else {
        res.status(response.status).json({ error: 'Failed to submit URL', response: data });
      }
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while submitting the URL' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
