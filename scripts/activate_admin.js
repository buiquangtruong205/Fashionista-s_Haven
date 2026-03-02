const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

async function activateAdmin(email) {
    if (!email) {
        console.log("Usage: node activate_admin.js <email>");
        process.exit(1);
    }

    try {
        const client = await pool.connect();
        console.log(`Searching for user: ${email}`);

        const res = await client.query("SELECT userID, email, role, is_active FROM users WHERE email = $1", [email]);

        if (res.rowCount === 0) {
            console.log(`User ${email} not found.`);
        } else {
            const user = res.rows[0];
            console.log(`Found user: ${user.email} (Role: ${user.role}, Active: ${user.is_active})`);

            await client.query("UPDATE users SET is_active = TRUE, status = 'active', role = 'admin' WHERE email = $1", [email]);
            console.log(`User ${email} has been FORCE ACTIVATED as ADMIN.`);
        }

        client.release();
    } catch (err) {
        console.error('ERROR:', err.message);
    } finally {
        await pool.end();
    }
}

const emailArg = process.argv[2];
activateAdmin(emailArg);
