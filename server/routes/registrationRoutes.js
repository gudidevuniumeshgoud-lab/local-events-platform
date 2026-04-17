const express = require('express');
const { registerEvent, getRegisteredEvents, cancelRegistration, getEventParticipants } = require('../controllers/registrationController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();
router.post('/', protect, registerEvent);
router.get('/', protect, getRegisteredEvents);
router.delete('/:eventId', protect, cancelRegistration);
router.get('/event/:eventId/participants', protect, authorize('admin'), getEventParticipants);
module.exports = router;
