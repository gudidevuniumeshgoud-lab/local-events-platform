const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide event title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide event description'],
    },
    date: {
      type: Date,
      required: [true, 'Please provide event date'],
    },
    time: {
      type: String,
      required: [true, 'Please provide event time'],
    },
    location: {
      type: String,
      required: [true, 'Please provide event location'],
    },
    category: {
      type: String,
      enum: ['hackathon', 'workshop', 'competition', 'conference', 'meetup', 'webinar', 'other'],
      required: [true, 'Please select a category'],
    },
    participationFee: {
      type: Number,
      default: 0,
    },
    prizeMoney: {
      type: Number,
      default: 0,
    },
    organizerName: {
      type: String,
      required: [true, 'Please provide organizer name'],
    },
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    image: {
      type: String,
      default: 'https://via.placeholder.com/300x200',
    },
    capacity: {
      type: Number,
      default: 100,
    },
    registeredCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);