const Product = require('../models/product.model');
const Order = require('../models/order.model');
const db = require('../config/db');

exports.createProduct = async (req, res) => {
    try {
        const productId = await Product.create(req.body);
        res.status(201).json({ message: 'Product created', productId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating product' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const success = await Product.update(req.params.productID, req.body);
        if (success) {
            res.json({ message: 'Product updated' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating product' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const success = await Product.softDelete(req.params.productID);
        if (success) {
            res.json({ message: 'Product deleted (soft)' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting product' });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll();
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const success = await Order.updateStatus(req.params.orderID, status);
        if (success) {
            res.json({ message: 'Order status updated' });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating order status' });
    }
};

exports.getDashboardStats = async (req, res) => {
    try {
        const revenueQuery = "SELECT SUM(total_amount) as total_revenue FROM orders WHERE status = 'delivered' OR status = 'processing'";
        const ordersQuery = "SELECT COUNT(*) as total_orders FROM orders";
        const productsQuery = "SELECT COUNT(*) as total_products FROM products WHERE is_deleted = FALSE";

        const [revenue] = await db.query(revenueQuery);
        const [orders] = await db.query(ordersQuery);
        const [products] = await db.query(productsQuery);

        res.json({
            totalRevenue: revenue.rows[0].total_revenue || 0,
            totalOrders: orders.rows[0].total_orders,
            totalProducts: products.rows[0].total_products
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching stats' });
    }
};
