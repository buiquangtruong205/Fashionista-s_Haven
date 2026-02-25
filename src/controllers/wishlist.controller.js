const Wishlist = require('../models/wishlist.model');

exports.getWishlist = async (req, res) => {
    try {
        const items = await Wishlist.findAllByUser(req.user.userID);
        res.json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching wishlist' });
    }
};

exports.addToWishlist = async (req, res) => {
    try {
        const { productID } = req.body;
        if (!productID) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        const item = await Wishlist.addItem(req.user.userID, productID);
        res.status(201).json({ message: 'Added to wishlist', item });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding to wishlist' });
    }
};

exports.removeFromWishlist = async (req, res) => {
    try {
        const { productID } = req.params;
        const success = await Wishlist.removeItem(req.user.userID, productID);
        if (success) {
            res.json({ message: 'Removed from wishlist' });
        } else {
            res.status(404).json({ message: 'Item not found in wishlist' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error removing from wishlist' });
    }
};
