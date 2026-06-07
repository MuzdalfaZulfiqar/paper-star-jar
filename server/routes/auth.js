

const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');

const SECRET = process.env.JWT_SECRET || 'my-letter-secret';

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email)
    return res.status(400).json({ msg: 'Please provide username, email and password' });

  try {
    let user = await User.findOne({ $or: [{ username }, { email }] });
    if (user) return res.status(400).json({ msg: 'Username or email already exists' });

    user = new User({ username, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const payload = { user: { id: user.id } };
    jwt.sign(payload, SECRET, { expiresIn: '7d' }, (err, token) => {
      if (err) return res.status(500).json({ msg: 'Token generation failed' });
      res.json({ token, username: user.username });
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ msg: 'Server Error', details: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

    const payload = { user: { id: user.id } };
    jwt.sign(payload, SECRET, { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      res.json({ token, username: user.username });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// GET /api/auth/search?q=username  — find users to dispatch letters to
router.get('/search', require('../middleware/auth'), async (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 2) return res.json([]);
  try {
    const users = await User.find({
      username: { $regex: q, $options: 'i' },
      _id: { $ne: req.user.id }
    }).select('username _id').limit(8);
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;