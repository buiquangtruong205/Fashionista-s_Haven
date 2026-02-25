const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect); // All order routes follow protection

router.post('/checkout', orderController.checkout);
router.get('/history', orderController.getHistory);
router.get('/:id', orderController.getOrderDetails);

module.exports = router;
