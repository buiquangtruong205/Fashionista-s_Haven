const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

async function checkTable() {
    console.log('Connecting to database...');
    const timeout = setTimeout(() => {
        console.error('Database connection timed out after 10 seconds.');
        process.exit(1);
    }, 10000);

    try {
        const client = await pool.connect();
        clearTimeout(timeout);
        console.log('Connected!');
        console.log("Checking columns for 'users' table...");
        const res = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'users';
        `);
        console.table(res.rows);
        client.release();
    } catch (err) {
        console.error('ERROR:', err.message);
    } finally {
        await pool.end();
    }
}

checkTable();
