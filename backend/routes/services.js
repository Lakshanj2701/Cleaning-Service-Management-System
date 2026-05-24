// Routes for fetching and creating cleaning services
const express = require('express');
const router  = express.Router();
const Service = require('../models/Service');

// GET /api/services — return all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching services.', error: err.message });
  }
});

// POST /api/services — create a new service (used for seeding / admin)
router.post('/', async (req, res) => {
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

module.exports = router;
