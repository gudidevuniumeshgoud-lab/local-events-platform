const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Event = require('./models/Event');

async function seedDB() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✅ Connected');

    await User.deleteMany({});
    await Event.deleteMany({});

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@eventhub.com',
      password: 'password123',
      role: 'admin',
      phone: '1234567890',
      location: 'New York',
      bio: 'Administrator',
    });

    const user = await User.create({
      name: 'John Doe',
      email: 'john@test.com',
      password: 'password123',
      role: 'user',
      phone: '9876543210',
      location: 'New York',
      bio: 'Tech enthusiast',
    });

    const events = await Event.insertMany([
      {
        title: 'Tech Hackathon 2026',
        description: '24-hour hackathon for tech enthusiasts',
        date: new Date('2026-05-15'),
        time: '09:00 AM',
        location: 'New York Convention Center',
        category: 'hackathon',
        participationFee: 50,
        prizeMoney: 5000,
        organizerName: 'Tech Hub NYC',
        organizerId: admin._id,
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500',
        capacity: 100,
      },
      {
        title: 'Web Dev Workshop',
        description: 'Learn React, Node.js, and MongoDB',
        date: new Date('2026-04-20'),
        time: '02:00 PM',
        location: 'Downtown Tech Hub',
        category: 'workshop',
        participationFee: 30,
        organizerName: 'Code Academy',
        organizerId: admin._id,
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500',
        capacity: 50,
      },
      {
        title: 'AI Conference 2026',
        description: 'Latest trends in AI and ML',
        date: new Date('2026-06-01'),
        time: '10:00 AM',
        location: 'San Francisco',
        category: 'conference',
        participationFee: 75,
        prizeMoney: 2000,
        organizerName: 'AI Innovations',
        organizerId: admin._id,
        image: 'https://images.unsplash.com/photo-1516534775068-bb57e5155853?w=500',
        capacity: 200,
      },
    ]);

    console.log('✅ Database seeded!');
    console.log('Admin: admin@eventhub.com | password123');
    console.log('User: john@test.com | password123');
    console.log('Events created: ' + events.length);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

seedDB();
