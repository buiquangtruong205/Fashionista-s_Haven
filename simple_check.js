const { Client } = require('pg');
require('dotenv').config();

async function check() {
    const client = new Client({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        connectionTimeoutMillis: 5000,
    });

    try {
        console.log('Connecting to DB...');
        await client.connect();
        console.log('Connected!');

        const res = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users'");
        console.log('Columns:');
        res.rows.forEach(row => console.log(`- ${row.column_name} (${row.data_type})`));

        const users = await client.query("SELECT userID, email, otp, pending_password FROM users LIMIT 1");
        console.log('Sample User:', users.rows[0]);

        await client.end();
    } catch (err) {
        console.error('Check failed:', err.message);
        process.exit(1);
    }
}

check();
