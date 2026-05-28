// Public auth routes: register, login, and get current user profile
const express  = require('express');
const router   = express.Router();
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const User     = require('../models/User');
const userAuth = require('../middleware/userAuth');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !name.trim())       return res.status(400).json({ message: 'Name is required.' });
    if (!email || !email.trim())     return res.status(400).json({ message: 'Email is required.' });
    if (!password)                   return res.status(400).json({ message: 'Password is required.' });
    if (password.length < 6)         return res.status(400).json({ message: 'Password must be at least 6 characters.' });

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) return res.status(409).json({ message: 'An account with this email already exists.' });

    const hashed = await bcrypt.hash(password, 10);
    const user   = await User.create({ name: name.trim(), email: email.toLowerCase().trim(), password: hashed });

    const token = jwt.sign(
      { userId: user._id, name: user.name, email: user.email, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error during registration.', error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(401).json({ message: 'Invalid email or password.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid email or password.' });

    const token = jwt.sign(
      { userId: user._id, name: user.name, email: user.email, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful.',
      token,
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error during login.', error: err.message });
  }
});

// GET /api/auth/me — return current user profile (protected)
router.get('/me', userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

module.exports = router;
