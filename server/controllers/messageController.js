const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    if (!receiverId || !content) return res.status(400).json({ success: false, message: 'Missing fields' });
    const message = await Message.create({ senderId: req.user.id, receiverId, content });
    res.status(201).json({ success: true, message: 'Sent', data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;
    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: userId },
        { senderId: userId, receiverId: currentUserId },
      ],
    }).populate('senderId', 'name email').populate('receiverId', 'name email').sort({ createdAt: 1 });
    await Message.updateMany({ receiverId: currentUserId, senderId: userId, isRead: false }, { isRead: true });
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyMessages = async (req, res) => {
  try {
    const messages = await Message.find({ receiverId: req.user.id }).populate('senderId', 'name email').sort({ createdAt: -1 });
    const unreadCount = await Message.countDocuments({ receiverId: req.user.id, isRead: false });
    res.json({ success: true, unreadCount, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ success: false, message: 'Not found' });
    await Message.findByIdAndDelete(messageId);
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
