const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { protect, admin } = require('../middlewares/auth.middleware');

// Public admin routes
router.post('/register', adminController.registerAdmin);
router.post('/verify-otp', adminController.verifyOTPAdmin);
router.post('/login', adminController.loginAdmin);

// Apply both protection and admin role check to all admin routes
router.use(protect, admin);

// Product management
router.get('/users', adminController.getAllUsers);
router.post('/products', adminController.createProduct);
router.put('/products/:productID', adminController.updateProduct);
router.delete('/products/:productID', adminController.deleteProduct);

// Product image management
router.get('/products/:productID/images', adminController.getProductImages);
router.post('/products/:productID/images', adminController.addProductImage);
router.delete('/products/:productID/images/:imageID', adminController.deleteProductImage);
router.put('/products/:productID/images/:imageID/primary', adminController.setPrimaryImage);

// Order management
router.get('/orders', adminController.getAllOrders);
router.put('/orders/:orderID/status', adminController.updateOrderStatus);

// Dashboard
router.get('/dashboard', adminController.getDashboardStats);

// Category management
router.post('/categories', adminController.createCategory);
router.put('/categories/:categoryID', adminController.updateCategory);
router.delete('/categories/:categoryID', adminController.deleteCategory);

module.exports = router;
