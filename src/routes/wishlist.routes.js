const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlist.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect); // All wishlist routes are protected

router.get('/', wishlistController.getWishlist);
router.post('/', wishlistController.addToWishlist);
router.delete('/:productID', wishlistController.removeFromWishlist);

module.exports = router;
