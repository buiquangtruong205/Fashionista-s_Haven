const { Pool } = require('pg');
require('dotenv').config();

const ports = [5432, 5433, 5434];

async function findPort() {
    for (const port of ports) {
        console.log(`Testing port ${port}...`);
        const pool = new Pool({
            host: process.env.DB_HOST,
            port: port,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            connectionTimeoutMillis: 2000,
        });

        try {
            const client = await pool.connect();
            console.log(`Port ${port} is WORKING!`);
            const res = await client.query('SELECT NOW()');
            console.log('Result:', res.rows[0]);
            client.release();
            await pool.end();
            return;
        } catch (err) {
            console.error(`Port ${port} failed: ${err.message}`);
            await pool.end();
        }
    }
    console.log('No valid port found.');
}

findPort();
