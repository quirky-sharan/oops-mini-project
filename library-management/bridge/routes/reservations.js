const express = require('express');
const router = express.Router();
const { callCpp } = require('../utils/callCpp');
const parser = require('../utils/fileParser');

router.get('/', (req, res) => {
  res.json(parser.getReservations());
});

router.post('/', async (req, res) => {
  try {
    const result = await callCpp('RESERVE_BOOK', { bookId: req.body.bookId, memberId: req.body.memberId });
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await callCpp('CANCEL_RESERVATION', { reservationId: req.params.id });
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
