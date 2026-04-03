const fs = require('fs');
const path = require('path');
const { DATA_PATH } = require('./callCpp');

function readTxtFile(filename, fields) {
  const filePath = path.join(DATA_PATH, filename);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  
  return lines.map(line => {
    const values = line.split('|');
    const obj = {};
    fields.forEach((field, index) => {
      let val = values[index];
      if (val && val.trim() === 'NULL') val = null;
      if (val && val.endsWith('\r')) val = val.slice(0, -1);
      obj[field] = val;
    });
    return obj;
  });
}

const schemas = {
  books: [
    'id', 'isbn', 'title', 'author', 'year', 'genre', 'publisher', 
    'totalCopies', 'availableCopies', 'language', 'status'
  ],
  members: [
    'id', 'name', 'email', 'password', 'phone', 
    'rollNumber', 'department', 'activeBorrows', 'dateRegistered'
  ],
  admins: [
    'id', 'name', 'email', 'password', 'phone', 'adminLevel', 'dateRegistered'
  ],
  transactions: [
    'id', 'bookId', 'memberId', 'issueDate', 'dueDate', 'returnDate', 'status'
  ],
  reservations: [
    'id', 'bookId', 'memberId', 'reservationDate', 'expiryDate', 'status'
  ],
  fines: [
    'id', 'transactionId', 'memberId', 'amount', 'status', 'calculatedDate', 'paidDate'
  ]
};

module.exports = {
  getBooks: () => readTxtFile('books.txt', schemas.books),
  getMembers: () => readTxtFile('members.txt', schemas.members),
  getAdmins: () => readTxtFile('admins.txt', schemas.admins),
  getTransactions: () => readTxtFile('transactions.txt', schemas.transactions),
  getReservations: () => readTxtFile('reservations.txt', schemas.reservations),
  getFines: () => readTxtFile('fines.txt', schemas.fines),
};
