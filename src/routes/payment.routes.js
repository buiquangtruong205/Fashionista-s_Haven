const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { protect } = require('../middlewares/auth.middleware');

router.post('/create-link', protect, paymentController.createLink);
router.post('/webhook', paymentController.webhook); // Webhook is public (secured by HMAC)

module.exports = router;
