const express = require('express');
const router = express.Router();
const { callCpp } = require('../utils/callCpp');
const parser = require('../utils/fileParser');

router.get('/', (req, res) => {
  res.json(parser.getFines());
});

router.get('/member/:id', (req, res) => {
  const fines = parser.getFines().filter(f => f.memberId === req.params.id);
  res.json(fines);
});

router.post('/calculate', async (req, res) => {
  try {
    const result = await callCpp('CALCULATE_FINES', {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/pay/:id', async (req, res) => {
  try {
    const result = await callCpp('PAY_FINE', { fineId: req.params.id });
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
