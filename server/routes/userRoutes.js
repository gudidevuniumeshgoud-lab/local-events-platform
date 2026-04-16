const express = require('express');
const { getAllUsers, getUserById, updateProfile, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/:id', protect, getUserById);
router.put('/profile/update', protect, updateProfile);
router.delete('/account/delete', protect, deleteUser);

module.exports = router;