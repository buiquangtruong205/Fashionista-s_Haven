const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

async function listAdmins() {
    try {
        const client = await pool.connect();
        console.log("Listing all users with role 'admin'...");
        const res = await client.query("SELECT userID, fullname, email, role, is_active, status FROM users WHERE role = 'admin'");
        console.table(res.rows);
        client.release();
    } catch (err) {
        console.error('ERROR:', err.message);
    } finally {
        await pool.end();
    }
}

listAdmins();
