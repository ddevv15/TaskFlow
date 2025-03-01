const express = require('express');
const verifyToken = require('../middleware/auth');
const router = express.Router();

router.get('/dashboard', verifyToken, (req, res) => {
  res.send('This is a protected route.');
});

module.exports = router;