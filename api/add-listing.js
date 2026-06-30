// Vercel relay → Prithjyo write endpoint (Code3.gs).
// Forwards the row server-to-server so the browser never hits a CORS wall.
// No npm dependencies — uses the runtime's built-in fetch.

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxVXtUEWgB__YCZD4vXJ2-pfVTrRiKTA_JFVeVwrhh7x0MitgfcsOTBsDe63kjOUmQy/exec';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }
  try {
    // Read the body robustly, whether or not Vercel pre-parsed it.
    let raw;
    if (typeof req.body === 'string') {
      raw = req.body;
    } else if (req.body && typeof req.body === 'object' && Object.keys(req.body).length) {
      raw = JSON.stringify(req.body);
    } else {
      raw = await new Promise((resolve) => {
        let d = '';
        req.on('data', (c) => { d += c; });
        req.on('end', () => resolve(d));
        req.on('error', () => resolve(''));
      });
    }

    const r = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: raw,
      redirect: 'follow'
    });
    const text = await r.text();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(text);
  } catch (e) {
    res.status(502).json({ success: false, error: 'Relay error: ' + (e && e.message ? e.message : String(e)) });
  }
};
