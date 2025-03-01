const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google-login', async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub, email, name } = payload;

    // Check if user exists or create new user
    let user = await User.findOne({ googleId: sub });
    if (!user) {
      user = await User.create({ googleId: sub, email, name });
    }

    // Generate JWT for session
    const authToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({ authToken });
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

module.exports = router;
