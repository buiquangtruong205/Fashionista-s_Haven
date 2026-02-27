const db = require('../config/db');

const Wishlist = {
    findAllByUser: async (userId) => {
        const query = `
            SELECT w.*, p.name, p.slug, p.base_price, p.thumbnail 
            FROM wishlists w
            JOIN products p ON w.productID = p.productID
            WHERE w.userID = $1
        `;
        const { rows } = await db.query(query, [userId]);
        return rows;
    },

    addItem: async (userId, productId) => {
        const query = 'INSERT INTO wishlists (userID, productID) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *';
        const { rows } = await db.query(query, [userId, productId]);
        return rows[0];
    },

    removeItem: async (userId, productId) => {
        const query = 'DELETE FROM wishlists WHERE userID = $1 AND productID = $2';
        const result = await db.query(query, [userId, productId]);
        return result.rowCount > 0;
    }
};

module.exports = Wishlist;
