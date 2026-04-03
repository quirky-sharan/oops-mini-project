const express = require('express');
const router = express.Router();
const { callCpp } = require('../utils/callCpp');

router.post('/login', async (req, res) => {
  try {
    const result = await callCpp('LOGIN', { email: req.body.email, password: req.body.password });
    res.json(result);
  } catch (err) {
    // Return standard error shape even on failure
    res.status(401).json({ success: false, error: err.message || 'Invalid credentials' });
  }
});

module.exports = router;
