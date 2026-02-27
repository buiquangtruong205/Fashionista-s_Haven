const crypto = require('crypto');
const db = require('../config/db');
require('dotenv').config();

exports.createLink = async (req, res) => {
    try {
        const { orderID, amount } = req.body;

        // This is a placeholder for actual payment gateway integration (e.g., PayOS, MoMo)
        // You would typically call their API here to get a payment URL.
        const mockPaymentUrl = `https://mockgateway.com/pay?order=${orderID}&amount=${amount}`;

        res.json({ paymentUrl: mockPaymentUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating payment link' });
    }
};

exports.webhook = async (req, res) => {
    try {
        const secret = process.env.PAYMENT_WEBHOOK_SECRET;
        const signature = req.headers['x-payment-signature'];

        // HMAC verification
        const hmac = crypto.createHmac('sha256', secret);
        const data = JSON.stringify(req.body);
        const calculatedSignature = hmac.update(data).digest('hex');

        if (signature !== calculatedSignature) {
            return res.status(401).json({ message: 'Invalid signature' });
        }

        const { orderID, status, transaction_id } = req.body;

        // Update order and payment status
        if (status === 'completed') {
            await db.query('UPDATE orders SET status = $1 WHERE orderID = $2', ['processing', orderID]);
            await db.query('UPDATE payments SET status = $1, transaction_id = $2, paid_at = CURRENT_TIMESTAMP WHERE orderID = $3', ['completed', transaction_id, orderID]);
        }

        res.json({ received: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Webhook processing error' });
    }
};
