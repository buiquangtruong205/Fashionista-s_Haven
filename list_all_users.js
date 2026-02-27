const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

async function listUsers() {
    try {
        const client = await pool.connect();
        console.log("Listing ALL users from 'users' table...");
        const res = await client.query("SELECT userID, fullname, email, role, is_active, status FROM users");
        if (res.rowCount === 0) {
            console.log("No users found in the 'users' table.");
        } else {
            console.table(res.rows);
        }
        client.release();
    } catch (err) {
        console.error('ERROR:', err.message);
    } finally {
        await pool.end();
    }
}

listUsers();
