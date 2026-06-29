export default async function handler(req, res) {
  const RELAY = 'https://script.google.com/macros/s/AKfycbzaypiclpLTT-AMIbsFrDUw8LwwrLl2O2GxHVz71N-XYIIFCo5dQiI4FixUIZbcp11fCg/exec';
  try {
    const response = await fetch(RELAY, { redirect: 'follow' });
    const data = await response.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=300');
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
