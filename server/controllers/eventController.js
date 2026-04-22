const Event = require('../models/Event');

exports.getAllEvents = async (req, res) => {
  try {
    const { category, location, search, page = 1, limit = 10 } = req.query;
    let filter = {};
    if (category) filter.category = category;
    if (location) filter.location = new RegExp(location, 'i');
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
      ];
    }
    const skip = (page - 1) * limit;
    const events = await Event.find(filter).skip(skip).limit(parseInt(limit)).sort({ date: 1 });
    const total = await Event.countDocuments(filter);
    res.json({
      success: true,
      count: events.length,
      total,
      pages: Math.ceil(total / limit),
      events,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, time, location, category, participationFee, prizeMoney, organizerName, capacity, image, eventLink } = req.body;
    if (!title || !description || !date || !time || !location || !category || !organizerName) {
      return res.status(400).json({ success: false, message: 'All required fields needed' });
    }
    const event = await Event.create({
      title, description, date, time, location, category, participationFee, prizeMoney,
      organizerName, organizerId: req.user.id, capacity, image: image || 'https://via.placeholder.com/300x200', eventLink: eventLink || '',
    });
    res.status(201).json({ success: true, message: 'Event created', event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, message: 'Event updated', event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    await Event.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
