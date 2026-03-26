// server/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// SIGNUP: /api/auth/register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ msg: 'Please provide username and password' });
  }

  try {
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({ username, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = { user: { id: user.id } };
    jwt.sign(payload, 'my-letter-secret', { expiresIn: '7d' }, (err, token) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ msg: "Token generation failed" });
      }
      res.json({ token });
    });

  } catch (err) { 
    console.error("Register error:", err);   // ← This will show the real problem in your terminal
    res.status(500).json({ msg: 'Server Error', details: err.message });
  }
});

// LOGIN: /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    let user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

    const payload = { user: { id: user.id } };
    jwt.sign(payload, 'my-letter-secret', { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
} catch (err) { 
  console.error(err);
  res.status(500).json({ msg: 'Server Error' }); 
}
});

module.exports = router;