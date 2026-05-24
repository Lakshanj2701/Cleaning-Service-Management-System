// Admin routes: login, view/update/delete bookings (all protected by JWT except login)
const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const Booking = require('../models/Booking');
const auth    = require('../middleware/auth');

// POST /api/admin/login — issue JWT for hardcoded admin credentials
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username !== 'admin' || password !== 'admin123') {
    return res.status(401).json({ message: 'Invalid admin credentials.' });
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ message: 'Login successful.', token });
});

// GET /api/admin/bookings — return all bookings, newest first, with service details
router.get('/bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('service', 'name price category')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching bookings.', error: err.message });
  }
});

// PATCH /api/admin/bookings/:id — mark a booking as completed
router.patch('/bookings/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'completed' },
      { returnDocument: 'after' }
    ).populate('service', 'name price category');

    if (!booking) return res.status(404).json({ message: 'Booking not found.' });
    res.json({ message: 'Booking marked as completed.', booking });
  } catch (err) {
    res.status(500).json({ message: 'Server error updating booking.', error: err.message });
  }
});

// DELETE /api/admin/bookings/:id — delete a booking
router.delete('/bookings/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });
    res.json({ message: 'Booking deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error deleting booking.', error: err.message });
  }
});

module.exports = router;
