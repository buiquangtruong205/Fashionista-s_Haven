/**
 * Migration: Fix VARCHAR(255) overflow for URL columns
 * 
 * Changes columns that store URLs from VARCHAR(255) to TEXT
 * to prevent "value too long for type character varying(255)" errors.
 */

const db = require('../../src/config/db');

async function migrate() {
    try {
        console.log('Starting migration: Fix VARCHAR overflow for URL columns...');

        await db.query(`
            ALTER TABLE products ALTER COLUMN thumbnail TYPE TEXT;
        `);
        console.log('✅ products.thumbnail -> TEXT');

        await db.query(`
            ALTER TABLE products ALTER COLUMN slug TYPE TEXT;
        `);
        console.log('✅ products.slug -> TEXT');

        await db.query(`
            ALTER TABLE product_images ALTER COLUMN image_url TYPE TEXT;
        `);
        console.log('✅ product_images.image_url -> TEXT');

        await db.query(`
            ALTER TABLE product_variants ALTER COLUMN image_url TYPE TEXT;
        `);
        console.log('✅ product_variants.image_url -> TEXT');

        await db.query(`
            ALTER TABLE banners ALTER COLUMN image_url TYPE TEXT;
        `);
        console.log('✅ banners.image_url -> TEXT');

        await db.query(`
            ALTER TABLE banners ALTER COLUMN target_link TYPE TEXT;
        `);
        console.log('✅ banners.target_link -> TEXT');

        console.log('\n🎉 Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    }
}

migrate();
