// Route for submitting a new booking
const express = require('express');
const router  = express.Router();
const Booking = require('../models/Booking');

// POST /api/bookings — validate fields and save booking
router.post('/', async (req, res) => {
  try {
    const { service, name, phone, address, date, time } = req.body;

    if (!service) return res.status(400).json({ message: 'Service is required.' });
    if (!name)    return res.status(400).json({ message: 'Name is required.' });
    if (!phone)   return res.status(400).json({ message: 'Phone number is required.' });
    if (!address) return res.status(400).json({ message: 'Address is required.' });
    if (!date)    return res.status(400).json({ message: 'Date is required.' });
    if (!time)    return res.status(400).json({ message: 'Time is required.' });

    const booking = new Booking({ service, name, phone, address, date, time });
    await booking.save();

    res.status(201).json({ message: 'Booking submitted successfully.', booking });
  } catch (err) {
    res.status(500).json({ message: 'Server error saving booking.', error: err.message });
  }
});

module.exports = router;
