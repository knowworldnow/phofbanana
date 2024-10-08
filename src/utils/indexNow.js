export async function submitToIndexNow(url) {
  try {
    const response = await fetch('/api/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });
    const data = await response.json();
    console.log('IndexNow submission result:', data);
  } catch (error) {
    console.error('Error submitting to IndexNow:', error);
  }
}
