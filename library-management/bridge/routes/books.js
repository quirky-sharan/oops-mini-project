const express = require('express');
const router = express.Router();
const { callCpp } = require('../utils/callCpp');
const parser = require('../utils/fileParser');

router.get('/', (req, res) => {
  const { search, genre, year } = req.query;
  let books = parser.getBooks();

  if (search) {
    const s = search.toLowerCase();
    books = books.filter(b => b.title?.toLowerCase().includes(s) || b.author?.toLowerCase().includes(s));
  }
  if (genre) books = books.filter(b => b.genre === genre);
  if (year) books = books.filter(b => b.year == year);

  res.json(books);
});

router.get('/:id', (req, res) => {
  const books = parser.getBooks();
  const book = books.find(b => b.id === req.params.id);
  if (!book) return res.status(404).json({ success: false, error: 'Book not found' });
  res.json(book);
});

router.post('/', async (req, res) => {
  try {
    const result = await callCpp('ADD_BOOK', req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = { bookId: req.params.id, ...req.body };
    const result = await callCpp('UPDATE_BOOK', data);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await callCpp('DELETE_BOOK', { bookId: req.params.id });
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
