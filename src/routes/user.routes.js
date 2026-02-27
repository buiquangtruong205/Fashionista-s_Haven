const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');
const { validateRegister, validateLogin } = require('../middlewares/validate.middleware');
// const rateLimit = require('express-rate-limit');

// Specialized rate limiter for security-sensitive actions
/*
const securityLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 5, // limit each IP to 5 requests per window
    message: 'Too many password change attempts from this IP, please try again after an hour'
});
*/
const securityLimiter = (req, res, next) => next(); // Dummy limiter

// Public routes
router.post('/register', validateRegister, userController.register);
router.post('/verify-otp', userController.verifyOTP);
router.post('/login', validateLogin, userController.login);

// Private routes
router.get('/profile', protect, userController.getProfile);
router.put('/profile', protect, userController.updateProfile);
router.post('/request-password-change', protect, securityLimiter, userController.requestPasswordChange);
router.post('/verify-password-change', protect, userController.verifyPasswordChange);

module.exports = router;
