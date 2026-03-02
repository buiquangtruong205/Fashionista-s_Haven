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
    console.log('Connecting to database...');
    try {
        const client = await pool.connect();
        console.log('Connected successfully!');

        // Add pending_password column if it doesn't exist
        const checkPendingPasswordQuery = `
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='users' AND column_name='pending_password';
        `;
        const colRes1 = await client.query(checkPendingPasswordQuery);

        if (colRes1.rowCount === 0) {
            console.log("Adding 'pending_password' column to 'users' table...");
            await client.query("ALTER TABLE users ADD COLUMN pending_password VARCHAR(255);");
            console.log("Column 'pending_password' added successfully.");
        } else {
            console.log("'pending_password' column already exists.");
        }

        // Add otp_expiry column if it doesn't exist
        const checkOtpExpiryQuery = `
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='users' AND column_name='otp_expiry';
        `;
        const colRes2 = await client.query(checkOtpExpiryQuery);

        if (colRes2.rowCount === 0) {
            console.log("Adding 'otp_expiry' column to 'users' table...");
            await client.query("ALTER TABLE users ADD COLUMN otp_expiry TIMESTAMP;");
            console.log("Column 'otp_expiry' added successfully.");
        } else {
            console.log("'otp_expiry' column already exists.");
        }

        client.release();
    } catch (err) {
        console.error('MIGRATION ERROR:', err.message);
    } finally {
        await pool.end();
    }
}

runMigration();
