const { Client } = require('pg');
require('dotenv').config();

async function migrate() {
    const client = new Client({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
    });

    try {
        await client.connect();
        console.log('Connected to database.');

        // 1. Create product_images table
        await client.query(`
            CREATE TABLE IF NOT EXISTS product_images (
                imageID SERIAL PRIMARY KEY,
                productID INT NOT NULL,
                image_url VARCHAR(500) NOT NULL,
                alt_text VARCHAR(255),
                sort_order INT DEFAULT 0,
                is_primary BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (productID) REFERENCES products(productID) ON DELETE CASCADE
            );
        `);
        console.log('Table "product_images" created (or already exists).');

        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(productID);
        `);
        console.log('Index created.');

        // 2. Migrate existing thumbnails to product_images
        const { rows } = await client.query(`
            SELECT "productid", thumbnail FROM products 
            WHERE thumbnail IS NOT NULL AND thumbnail != ''
        `);

        let migratedCount = 0;
        for (const row of rows) {
            // Check if image already migrated
            const existing = await client.query(
                'SELECT 1 FROM product_images WHERE "productid" = $1 AND image_url = $2',
                [row.productid, row.thumbnail]
            );

            if (existing.rowCount === 0) {
                await client.query(
                    'INSERT INTO product_images ("productid", image_url, is_primary, sort_order) VALUES ($1, $2, TRUE, 0)',
                    [row.productid, row.thumbnail]
                );
                migratedCount++;
            }
        }

        console.log(`Migrated ${migratedCount} existing thumbnails to product_images.`);
        console.log('Migration complete!');
    } catch (err) {
        console.error('Migration error:', err.message);
    } finally {
        await client.end();
    }
}

migrate();
