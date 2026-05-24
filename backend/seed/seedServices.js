// Seed script: inserts 8 default cleaning services if the collection is empty
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Service  = require('../models/Service');

const services = [
  {
    name: 'Deep Clean',
    description: 'Full home deep cleaning service covering every room and surface.',
    price: 120,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
    category: 'residential',
  },
  {
    name: 'Office Cleaning',
    description: 'Professional office sanitization and workspace maintenance.',
    price: 80,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600',
    category: 'commercial',
  },
  {
    name: 'Sofa Express',
    description: 'Sofa and upholstery cleaning using eco-friendly foam treatment.',
    price: 60,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600',
    category: 'furniture',
  },
  {
    name: 'Carpet Cleaning',
    description: 'Hot-water extraction steam carpet cleaning for all carpet types.',
    price: 75,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600',
    category: 'furniture',
  },
  {
    name: 'Window Cleaning',
    description: 'Streak-free interior and exterior window cleaning service.',
    price: 50,
    image: 'https://images.unsplash.com/photo-1527515637462-cff94aca208c?w=600',
    category: 'residential',
  },
  {
    name: 'Move-In Clean',
    description: 'Complete top-to-bottom clean for new home move-ins.',
    price: 150,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600',
    category: 'residential',
  },
  {
    name: 'Kitchen Deep Clean',
    description: 'Thorough degreasing and sanitizing of all kitchen surfaces and appliances.',
    price: 90,
    image: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600',
    category: 'residential',
  },
  {
    name: 'Bathroom Sanitize',
    description: 'Deep bathroom disinfection targeting tiles, grout, and fixtures.',
    price: 45,
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600',
    category: 'residential',
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding.');

    const count = await Service.countDocuments();
    if (count > 0) {
      console.log(`Collection already has ${count} services. Skipping seed.`);
    } else {
      await Service.insertMany(services);
      console.log('8 services seeded successfully.');
    }
  } catch (err) {
    console.error('Seed error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
  }
}

seed();
