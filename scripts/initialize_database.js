const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initialize() {
    const config = {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
    };

    const dbName = process.env.DB_NAME || 'clothing_shop';

    // 1. Connect to 'postgres' to create the database if it doesn't exist
    const client = new Client({ ...config, database: 'postgres' });

    try {
        await client.connect();
        console.log('Connected to PostgreSQL server.');

        const checkDbRes = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", [dbName]);
        if (checkDbRes.rowCount === 0) {
            console.log(`Creating database "${dbName}"...`);
            await client.query(`CREATE DATABASE "${dbName}"`);
            console.log(`Database "${dbName}" created successfully.`);
        } else {
            console.log(`Database "${dbName}" already exists.`);
        }
    } catch (err) {
        console.error('Error during database creation:', err.message);
        process.exit(1);
    } finally {
        await client.end();
    }

    // 2. Connect to the new database to initialize schema
    const dbClient = new Client({ ...config, database: dbName });
    try {
        await dbClient.connect();
        console.log(`Connected to "${dbName}" database.`);

        // Updated path to reflect new folder structure
        const schemaPath = path.join(__dirname, '..', 'docs', 'database_schema.sql');
        if (fs.existsSync(schemaPath)) {
            console.log('Reading schema file...');
            const schemaSql = fs.readFileSync(schemaPath, 'utf8');
            console.log('Initializing schema...');
            await dbClient.query(schemaSql);
            console.log('Schema initialized successfully.');
        } else {
            console.warn(`Warning: ${schemaPath} not found. Skipping schema initialization.`);
        }
    } catch (err) {
        console.error('Error during schema initialization:', err.message);
    } finally {
        await dbClient.end();
    }
}

initialize();
