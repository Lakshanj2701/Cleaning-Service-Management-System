// Mongoose schema for customer booking submissions
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  name:    { type: String, required: true },
  phone:   { type: String, required: true },
  address: { type: String, required: true },
  date:    { type: String, required: true },
  time:    { type: String, required: true },
  status:  { type: String, enum: ['pending', 'completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Booking', bookingSchema);
