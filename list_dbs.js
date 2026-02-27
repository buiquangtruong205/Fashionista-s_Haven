const { Client } = require('pg');
require('dotenv').config();

async function listDatabases() {
    const client = new Client({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: 'postgres'
    });

    try {
        await client.connect();
        console.log('Connected to postgres database.');
        const res = await client.query('SELECT datname FROM pg_database WHERE datistemplate = false;');
        console.log('Available databases:');
        res.rows.forEach(row => console.log(' -', row.datname));
    } catch (err) {
        console.error('ERROR:', err.message);
    } finally {
        await client.end();
    }
}

listDatabases();
