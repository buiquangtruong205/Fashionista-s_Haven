const db = require('../config/db');

const User = {
    create: async (userData) => {
        const { fullname, email, password, phone, address, otp, role } = userData;
        const query = `
            INSERT INTO users (fullname, email, password, phone, address, otp, role, is_active) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
            RETURNING "userID"
        `;
        const { rows } = await db.query(query, [fullname, email, password, phone, address, otp, role || 'user', false]);
        return rows[0].userID;
    },

    findById: async (id) => {
        const query = 'SELECT * FROM users WHERE "userID" = $1 AND is_deleted = FALSE';
        const { rows } = await db.query(query, [id]);
        return rows[0];
    },

    findByEmail: async (email) => {
        const query = 'SELECT * FROM users WHERE email = $1 AND is_deleted = FALSE';
        const { rows } = await db.query(query, [email]);
        return rows[0];
    },

    update: async (id, userData) => {
        const { fullname, phone, address, is_active, otp } = userData;
        const query = `
            UPDATE users 
            SET fullname = $1, phone = $2, address = $3, is_active = $4, otp = $5 
            WHERE "userID" = $6
        `;
        const result = await db.query(query, [fullname, phone, address, is_active, otp, id]);
        return result.rowCount > 0;
    },

    softDelete: async (id) => {
        const query = 'UPDATE users SET is_deleted = TRUE WHERE "userID" = $1';
        const result = await db.query(query, [id]);
        return result.rowCount > 0;
    }
};

module.exports = User;
