const express = require('express');
const router = express.Router();
const parser = require('../utils/fileParser');

router.get('/', (req, res) => {
  const books = parser.getBooks();
  const members = parser.getMembers();
  const txs = parser.getTransactions();
  const fines = parser.getFines();
  const resvs = parser.getReservations();

  const totalCopies = books.reduce((sum, b) => sum + (parseInt(b.totalCopies) || 0), 0);
  const availableCopies = books.reduce((sum, b) => sum + (parseInt(b.availableCopies) || 0), 0);
  const activeTransactions = txs.filter(t => t.status === 'ACTIVE');
  const pendingFines = fines.filter(f => f.status === 'PENDING');
  const activeReservations = resvs.filter(r => r.status === 'ACTIVE');
  
  const totalFineAmount = pendingFines.reduce((sum, f) => sum + (parseFloat(f.amount) || 0), 0);

  // Sort by date descending for recent transactions
  const sortedTxs = [...txs].sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate));

  res.json({
    totalBooks: books.length,
    totalCopies,
    availableCopies,
    issuedCopies: totalCopies - availableCopies,
    totalMembers: members.length,
    activeTransactions: activeTransactions.length,
    pendingFines: pendingFines.length,
    totalFineAmount: totalFineAmount.toFixed(2),
    activeReservations: activeReservations.length,
    recentTransactions: sortedTxs.slice(0, 5)
  });
});

module.exports = router;
