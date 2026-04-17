const Registration = require('../models/Registration');
const Event = require('../models/Event');

exports.registerEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    const userId = req.user.id;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    if (event.registeredCount >= event.capacity) {
      return res.status(400).json({ success: false, message: 'Event capacity full' });
    }
    let registration = await Registration.findOne({ userId, eventId });
    if (registration) {
      return res.status(400).json({ success: false, message: 'Already registered' });
    }
    registration = await Registration.create({ userId, eventId });
    await Event.findByIdAndUpdate(eventId, { registeredCount: event.registeredCount + 1 });
    res.status(201).json({ success: true, message: 'Registered successfully', registration });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRegisteredEvents = async (req, res) => {
  try {
    const registrations = await Registration.find({ userId: req.user.id }).populate('eventId');
    res.json({ success: true, registrations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.cancelRegistration = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;
    const registration = await Registration.findOne({ userId, eventId });
    if (!registration) return res.status(404).json({ success: false, message: 'Registration not found' });
    await Registration.findByIdAndUpdate(registration._id, { status: 'cancelled' });
    const event = await Event.findById(eventId);
    await Event.findByIdAndUpdate(eventId, { registeredCount: Math.max(0, event.registeredCount - 1) });
    res.json({ success: true, message: 'Cancelled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getEventParticipants = async (req, res) => {
  try {
    const { eventId } = req.params;
    const participants = await Registration.find({ eventId }).populate('userId', 'name email phone');
    res.json({ success: true, count: participants.length, participants });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
