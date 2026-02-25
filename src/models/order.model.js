const db = require('../config/db');

const Order = {
    create: async (orderData, client) => {
        const { userID, couponID, order_number, total_amount, discount_amount, shipping_cost, shipping_address, receiver_name, receiver_phone } = orderData;
        const query = `
            INSERT INTO orders ("userID", "couponID", order_number, total_amount, discount_amount, shipping_cost, shipping_address, receiver_name, receiver_phone) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING "orderID"
        `;
        const { rows } = await (client || db).query(query, [userID, couponID, order_number, total_amount, discount_amount, shipping_cost, shipping_address, receiver_name, receiver_phone]);
        return rows[0].orderID;
    },

    addItem: async (itemData, client) => {
        const { orderID, variantID, quantity, price } = itemData;
        const query = 'INSERT INTO order_items ("orderID", "variantID", quantity, price) VALUES ($1, $2, $3, $4) RETURNING "itemID"';
        const { rows } = await (client || db).query(query, [orderID, variantID, quantity, price]);
        return rows[0].itemID;
    },

    findByUser: async (userId) => {
        const query = 'SELECT * FROM orders WHERE "userID" = $1 ORDER BY created_at DESC';
        const { rows } = await db.query(query, [userId]);
        return rows;
    },

    getOrderDetails: async (orderId) => {
        const query = `
            SELECT oi.*, p.name as product_name, v.colorID, v.sizeID, cl.name as color_name, sz.name as size_name
            FROM order_items oi
            JOIN product_variants v ON oi."variantID" = v."variantID"
            JOIN products p ON v."productID" = p."productID"
            LEFT JOIN colors cl ON v."colorID" = cl."colorID"
            LEFT JOIN sizes sz ON v."sizeID" = sz."sizeID"
            WHERE oi."orderID" = $1
        `;
        const { rows } = await db.query(query, [orderId]);
        return rows;
    },

    updateStock: async (variantId, quantity, client) => {
        const query = 'UPDATE product_variants SET stock_quantity = stock_quantity - $1 WHERE "variantID" = $2 AND stock_quantity >= $1';
        const result = await (client || db).query(query, [quantity, variantId]);
        return result.rowCount > 0;
    },

    findAll: async () => {
        const query = 'SELECT o.*, u.fullname, u.email FROM orders o JOIN users u ON o."userID" = u."userID" ORDER BY o.created_at DESC';
        const { rows } = await db.query(query);
        return rows;
    },

    updateStatus: async (orderId, status) => {
        const query = 'UPDATE orders SET status = $1, "updated_at" = CURRENT_TIMESTAMP WHERE "orderID" = $2';
        const result = await db.query(query, [status, orderId]);
        return result.rowCount > 0;
    }
};

module.exports = Order;
