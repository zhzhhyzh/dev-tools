const express = require('express');
const crypto = require('crypto');
const router = express.Router();

router.post('/generate', (req, res) => {
  try {
    const { text, algorithms = ['md5', 'sha1', 'sha256', 'sha512'] } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });

    const results = {};
    for (const algo of algorithms) {
      results[algo] = crypto.createHash(algo).update(text, 'utf8').digest('hex');
    }
    res.json({ results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
