const express = require('express');
const router = express.Router();
const { callCpp } = require('../utils/callCpp');

router.post('/login', async (req, res) => {
  try {
    const result = await callCpp('LOGIN', { email: req.body.email, password: req.body.password });
    
    // If simulation occurred or valid result
    if (result.mock && req.body.password === 'admin123') {
      return res.json({
        success: true,
        userId: 'ADM001',
        name: 'Dr. Ramesh Kumar (Simulated)',
        role: 'ADMIN',
        email: 'admin@library.edu'
      });
    } else if (result.mock && req.body.password === 'pass123') {
      return res.json({
        success: true,
        userId: 'STU001',
        name: 'Aanya Sharma (Simulated)',
        role: 'STUDENT',
        email: 'aanya@college.edu'
      });
    }

    res.json(result);
  } catch (err) {
    res.status(401).json({ success: false, error: err.message || 'Invalid credentials' });
  }
});

module.exports = router;
