const express = require('express');
const {
  sendMessage,
  getConversation,
  getMyMessages,
  deleteMessage,
} = require('../controllers/messageController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/', protect, getMyMessages);
router.get('/conversation/:userId', protect, getConversation);
router.delete('/:messageId', protect, deleteMessage);

module.exports = router;