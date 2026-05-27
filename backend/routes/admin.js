// Admin routes: login, bookings, services, and users management (all protected except login)
const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const User    = require('../models/User');
const auth    = require('../middleware/auth');

// POST /api/admin/login — issue JWT for hardcoded admin credentials
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username !== 'admin' || password !== 'admin123') {
    return res.status(401).json({ message: 'Invalid admin credentials.' });
  }

  const token = jwt.sign({ username, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '8h' });
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

// ── Users Management ───────────────────────────────────────────────────────────

// GET /api/admin/users — return all registered users (no passwords)
router.get('/users', auth, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching users.', error: err.message });
  }
});

// DELETE /api/admin/users/:id — delete a user account
router.delete('/users/:id', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error deleting user.', error: err.message });
  }
});

// ── Services Management ────────────────────────────────────────────────────────

// GET /api/admin/services — return all services
router.get('/services', auth, async (req, res) => {
  try {
    const services = await Service.find().sort({ name: 1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching services.', error: err.message });
  }
});

// POST /api/admin/services — create a new service
router.post('/services', auth, async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;
    if (!name || !description || price === undefined) {
      return res.status(400).json({ message: 'name, description, and price are required.' });
    }
    const service = new Service({ name, description, price, image, category });
    await service.save();
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ message: 'Server error creating service.', error: err.message });
  }
});

// PUT /api/admin/services/:id — update a service
router.put('/services/:id', auth, async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;
    if (!name || !description || price === undefined) {
      return res.status(400).json({ message: 'name, description, and price are required.' });
    }
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { name, description, price, image, category },
      { returnDocument: 'after' }
    );
    if (!service) return res.status(404).json({ message: 'Service not found.' });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: 'Server error updating service.', error: err.message });
  }
});

// DELETE /api/admin/services/:id — delete a service
router.delete('/services/:id', auth, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found.' });
    res.json({ message: 'Service deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error deleting service.', error: err.message });
  }
});

module.exports = router;
