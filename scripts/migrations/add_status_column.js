const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

async function runMigration() {
    try {
        const client = await pool.connect();

        // Add status column if it doesn't exist
        const checkColumnQuery = `
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='users' AND column_name='status';
        `;
        const colRes = await client.query(checkColumnQuery);

        if (colRes.rowCount === 0) {
            console.log("Adding 'status' column to 'users' table...");
            await client.query("ALTER TABLE users ADD COLUMN status VARCHAR(20) DEFAULT 'active';");
            // For existing users, if is_active is false, set status to 'pending'
            await client.query("UPDATE users SET status = 'pending' WHERE is_active = FALSE;");
            console.log("Column 'status' added successfully.");
        } else {
            console.log("'status' column already exists.");
        }

        client.release();
    } catch (err) {
        console.error('MIGRATION ERROR:', err.message);
    } finally {
        await pool.end();
    }
}

runMigration();
