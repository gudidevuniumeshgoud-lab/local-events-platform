const express = require('express');
const { register, login, getMe, registerAdmin } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const router = express.Router();
router.post('/register', register);
router.post('/register-admin', registerAdmin);
router.post('/login', login);
router.get('/me', protect, getMe);
module.exports = router;
