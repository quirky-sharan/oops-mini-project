const express = require('express');
const router = express.Router();
const { callCpp } = require('../utils/callCpp');
const parser = require('../utils/fileParser');

router.get('/', (req, res) => {
  res.json(parser.getMembers());
});

router.get('/:id', (req, res) => {
  const members = parser.getMembers();
  const member = members.find(m => m.id === req.params.id);
  if (!member) return res.status(404).json({ success: false, error: 'Member not found' });
  
  const txs = parser.getTransactions().filter(tx => tx.memberId === member.id && tx.status === 'ACTIVE');
  res.json({ ...member, activeTransactions: txs });
});

router.post('/', async (req, res) => {
  try {
    const result = await callCpp('ADD_MEMBER', req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await callCpp('DELETE_MEMBER', { memberId: req.params.id });
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
