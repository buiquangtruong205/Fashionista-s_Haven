const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');

// Public routes
router.post('/register', userController.register);
router.post('/verify-otp', userController.verifyOTP);
router.post('/login', userController.login);

// Private routes
router.get('/profile', protect, userController.getProfile);
router.put('/profile', protect, userController.updateProfile);

module.exports = router;
