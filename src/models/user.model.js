const db = require('../config/db');

const normalizeUser = (user) => {
    if (!user) return null;
    return {
        userID: user.userid || user.userID,
        fullname: user.fullname,
        email: user.email,
        password: user.password,
        phone: user.phone,
        address: user.address,
        otp: user.otp,
        status: user.status,
        role: user.role,
        is_active: user.is_active,
        is_deleted: user.is_deleted,
        created_at: user.created_at,
        updated_at: user.updated_at
    };
};

const User = {
    create: async (userData) => {
        const { fullname, email, password, phone, address, otp, role } = userData;
        const query = `
            INSERT INTO users (fullname, email, password, phone, address, otp, status, role, is_active) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
            RETURNING userID
        `;
        console.log('User.create params:', [fullname, email, password, phone, address, otp, role || 'user', false]);
        const { rows } = await db.query(query, [fullname, email, password, phone, address, otp, userData.status || 'pending', role || 'user', false]);
        return rows[0].userID || rows[0].userid;
    },

    findById: async (id) => {
        const query = 'SELECT * FROM users WHERE userID = $1 AND is_deleted = FALSE';
        const { rows } = await db.query(query, [id]);
        return normalizeUser(rows[0]);
    },

    findByEmail: async (email) => {
        const query = 'SELECT * FROM users WHERE email = $1 AND is_deleted = FALSE';
        const { rows } = await db.query(query, [email]);
        return normalizeUser(rows[0]);
    },

    update: async (id, userData) => {
        const { fullname, phone, address, is_active, otp, status } = userData;
        const query = `
            UPDATE users 
            SET fullname = $1, phone = $2, address = $3, is_active = $4, otp = $5, status = $6 
            WHERE userID = $7
        `;
        const result = await db.query(query, [fullname, phone, address, is_active, otp, status, id]);
        return result.rowCount > 0;
    },

    softDelete: async (id) => {
        const query = 'UPDATE users SET is_deleted = TRUE WHERE userID = $1';
        const result = await db.query(query, [id]);
        return result.rowCount > 0;
    }
};

module.exports = User;
