const express = require('express');
const router = express.Router();
const { callCpp } = require('../utils/callCpp');
const parser = require('../utils/fileParser');

router.get('/', (req, res) => {
  res.json(parser.getTransactions());
});

router.get('/member/:id', (req, res) => {
  const allTxs = parser.getTransactions();
  const txs = allTxs.filter(tx => tx.memberId === req.params.id);
  res.json(txs);
});

router.post('/issue', async (req, res) => {
  try {
    const result = await callCpp('ISSUE_BOOK', { bookId: req.body.bookId, memberId: req.body.memberId });
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/return', async (req, res) => {
  try {
    const result = await callCpp('RETURN_BOOK', { transactionId: req.body.transactionId });
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
