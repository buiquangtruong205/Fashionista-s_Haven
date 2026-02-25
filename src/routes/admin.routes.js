const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { protect, admin } = require('../middlewares/auth.middleware');

// Apply both protection and admin role check to all admin routes
router.use(protect, admin);

// Product management
router.post('/products', adminController.createProduct);
router.put('/products/:productID', adminController.updateProduct);
router.delete('/products/:productID', adminController.deleteProduct);

// Order management
router.get('/orders', adminController.getAllOrders);
router.put('/orders/:orderID/status', adminController.updateOrderStatus);

// Dashboard
router.get('/dashboard', adminController.getDashboardStats);

module.exports = router;
