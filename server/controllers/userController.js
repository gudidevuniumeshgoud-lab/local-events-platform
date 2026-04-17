const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role } = req.query;
    let filter = {};
    if (role) filter.role = role;
    const skip = (page - 1) * limit;
    const users = await User.find(filter).select('-password').skip(skip).limit(parseInt(limit));
    const total = await User.countDocuments(filter);
    res.json({ success: true, count: users.length, total, pages: Math.ceil(total / limit), users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const allowedFields = ['name', 'phone', 'location', 'bio', 'avatar'];
    const updates = {};
    allowedFields.forEach((field) => { if (req.body[field]) updates[field] = req.body[field]; });
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true }).select('-password');
    res.json({ success: true, message: 'Updated', user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
