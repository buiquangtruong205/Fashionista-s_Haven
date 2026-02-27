const Order = require('../models/order.model');
const db = require('../config/db');

exports.checkout = async (req, res) => {
    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');

        const { items, couponID, shipping_address, receiver_name, receiver_phone, total_amount, discount_amount, shipping_cost } = req.body;
        const userID = req.user.userID;

        // 1. Create Order
        const order_number = 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
        const orderID = await Order.create({
            userID,
            couponID,
            order_number,
            total_amount,
            discount_amount: discount_amount || 0,
            shipping_cost: shipping_cost || 0,
            shipping_address,
            receiver_name,
            receiver_phone
        }, client);

        // 2. Process Items and Update Stock
        for (const item of items) {
            const { variantID, quantity, price } = item;

            // Update stock (fails if not enough)
            const stockUpdated = await Order.updateStock(variantID, quantity, client);
            if (!stockUpdated) {
                throw new Error(`Insufficient stock for variant ${variantID}`);
            }

            // Create Order Item
            await Order.addItem({
                orderID,
                variantID,
                quantity,
                price
            }, client);
        }

        await client.query('COMMIT');
        res.status(201).json({ message: 'Order created successfully', orderID, order_number });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: error.message || 'Error processing checkout' });
    } finally {
        client.release();
    }
};

exports.getHistory = async (req, res) => {
    try {
        const orders = await Order.findByUser(req.user.userID);

        // Optionally fetch items for each order (might be heavy, consider separate endpoint or join)
        // For simplicity, we just return the orders.
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching order history' });
    }
};

exports.getOrderDetails = async (req, res) => {
    try {
        const orderId = req.params.id;
        const userId = req.user ? req.user.userID : null;
        const role = req.user ? req.user.role : 'user';

        const details = await Order.getOrderDetails(orderId, userId, role);
        if (!details || details.length === 0) {
            return res.status(404).json({ message: 'Order details not found or unauthorized' });
        }

        res.json(details);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching order details' });
    }
};
