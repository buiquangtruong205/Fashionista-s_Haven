const Product = require('../models/product.model');

exports.getProducts = async (req, res) => {
    try {
        const filters = {
            categoryID: req.query.categoryID,
            search: req.query.search,
            minPrice: req.query.minPrice,
            maxPrice: req.query.maxPrice,
            limit: parseInt(req.query.limit) || 12,
            page: parseInt(req.query.page) || 1
        };

        const products = await Product.findAll(filters);
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching products' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const variants = await Product.getVariants(req.params.id);
        res.json({ ...product, variants });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching product details' });
    }
};

exports.getProductBySlug = async (req, res) => {
    try {
        const product = await Product.findBySlug(req.params.slug);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const variants = await Product.getVariants(product.productID);
        res.json({ ...product, variants });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching product details' });
    }
};
