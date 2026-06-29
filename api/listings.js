export default async function handler(req, res) {
  const RELAY = 'https://script.google.com/macros/s/AKfycbzaypiclpLTT-AMIbsFrDUw8LwwrLl2O2GxHVz71N-XYIIFCo5dQiI4FixUIZbcp11fCg/exec';
  try {
    const response = await fetch(RELAY, {
      redirect: 'follow',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; Prithjyo/1.0)'
      }
    });
    const text = await response.text();
    // Guard: if Google returned HTML instead of JSON, throw clearly
    if (text.trim().startsWith('<')) {
      throw new Error('Google returned HTML — possible auth redirect. Raw: ' + text.substring(0, 120));
    }
    const data = JSON.parse(text);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=300');
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
