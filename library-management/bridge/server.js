const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const booksRoutes = require('./routes/books');
const membersRoutes = require('./routes/members');
const transactionsRoutes = require('./routes/transactions');
const reservationsRoutes = require('./routes/reservations');
const finesRoutes = require('./routes/fines');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Check if data directory exists
const fs = require('fs');
const path = require('path');
const dataDir = path.resolve(__dirname, '../backend/data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/members', membersRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/reservations', reservationsRoutes);
app.use('/api/fines', finesRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.listen(PORT, () => {
  console.log(`Node bridge server running on http://localhost:${PORT}`);
});
