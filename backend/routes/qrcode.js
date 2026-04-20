const express = require('express');
const QRCode = require('qrcode');
const router = express.Router();

router.post('/generate', async (req, res) => {
  try {
    const { text, width = 300 } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });

    const dataUrl = await QRCode.toDataURL(text, {
      width: Math.min(width, 1000),
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
    });
    res.json({ dataUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
