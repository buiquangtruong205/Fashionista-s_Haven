const db = require('../config/db');

const Product = {
    create: async (productData) => {
        const { categoryID, name, slug, base_price, description, thumbnail } = productData;
        const query = 'INSERT INTO products (categoryID, name, slug, base_price, description, thumbnail) VALUES ($1, $2, $3, $4, $5, $6) RETURNING productID';
        const { rows } = await db.query(query, [categoryID, name, slug, base_price, description, thumbnail]);
        return rows[0].productID || rows[0].productid;
    },

    findAll: async (filters = {}) => {
        let query = `
            SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.categoryID = c.categoryID 
            WHERE p.is_deleted = FALSE AND p.is_active = TRUE
        `;
        const params = [];
        let paramCount = 1;

        if (filters.categoryID) {
            query += ` AND p.categoryID = $${paramCount++}`;
            params.push(filters.categoryID);
        }

        if (filters.search) {
            query += ` AND p.name ILIKE $${paramCount++}`;
            params.push(`%${filters.search}%`);
        }

        if (filters.minPrice) {
            query += ` AND p.base_price >= $${paramCount++}`;
            params.push(filters.minPrice);
        }

        if (filters.maxPrice) {
            query += ` AND p.base_price <= $${paramCount++}`;
            params.push(filters.maxPrice);
        }

        // Pagination
        const limit = filters.limit || 12;
        const page = filters.page || 1;
        const offset = (page - 1) * limit;

        query += ` LIMIT $${paramCount++} OFFSET $${paramCount++}`;
        params.push(limit, offset);

        const { rows } = await db.query(query, params);
        return rows;
    },

    findById: async (id) => {
        const query = 'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.categoryID = c.categoryID WHERE p.productID = $1 AND p.is_deleted = FALSE';
        const { rows } = await db.query(query, [id]);
        return rows[0];
    },

    findBySlug: async (slug) => {
        const query = 'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.categoryID = c.categoryID WHERE p.slug = $1 AND p.is_deleted = FALSE';
        const { rows } = await db.query(query, [slug]);
        return rows[0];
    },

    getVariants: async (id) => {
        const query = `
            SELECT v.*, cl.name as color_name, cl.hex_code, sz.name as size_name 
            FROM product_variants v
            LEFT JOIN colors cl ON v.colorID = cl.colorID
            LEFT JOIN sizes sz ON v.sizeID = sz.sizeID
            WHERE v.productID = $1
        `;
        const { rows } = await db.query(query, [id]);
        return rows;
    },

    update: async (id, productData) => {
        const { categoryID, name, slug, base_price, description, thumbnail, is_active } = productData;
        const query = `
            UPDATE products 
            SET categoryID = $1, name = $2, slug = $3, base_price = $4, description = $5, thumbnail = $6, is_active = $7, updated_at = CURRENT_TIMESTAMP
            WHERE productID = $8
        `;
        const result = await db.query(query, [categoryID, name, slug, base_price, description, thumbnail, is_active, id]);
        return result.rowCount > 0;
    },

    softDelete: async (id) => {
        const query = 'UPDATE products SET is_deleted = TRUE WHERE productID = $1';
        const result = await db.query(query, [id]);
        return result.rowCount > 0;
    },

    // ====== Product Images ======

    addImage: async (productID, imageData) => {
        const { image_url, alt_text, sort_order = 0, is_primary = false } = imageData;

        // If this image is set as primary, unset all other primaries first
        if (is_primary) {
            await db.query('UPDATE product_images SET is_primary = FALSE WHERE productID = $1', [productID]);
        }

        const query = `
            INSERT INTO product_images (productID, image_url, alt_text, sort_order, is_primary) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING *
        `;
        const { rows } = await db.query(query, [productID, image_url, alt_text, sort_order, is_primary]);
        return rows[0];
    },

    addMultipleImages: async (productID, images) => {
        const results = [];
        for (let i = 0; i < images.length; i++) {
            const img = images[i];
            const is_primary = img.is_primary || (i === 0); // First image is primary by default
            if (is_primary) {
                await db.query('UPDATE product_images SET is_primary = FALSE WHERE productID = $1', [productID]);
            }
            const query = `
                INSERT INTO product_images (productID, image_url, alt_text, sort_order, is_primary)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *
            `;
            const { rows } = await db.query(query, [
                productID,
                img.image_url,
                img.alt_text || null,
                img.sort_order || i,
                is_primary
            ]);
            results.push(rows[0]);
        }
        return results;
    },

    getImages: async (productID) => {
        const query = 'SELECT * FROM product_images WHERE productID = $1 ORDER BY is_primary DESC, sort_order ASC';
        const { rows } = await db.query(query, [productID]);
        return rows;
    },

    deleteImage: async (imageID) => {
        const query = 'DELETE FROM product_images WHERE imageID = $1 RETURNING *';
        const { rows } = await db.query(query, [imageID]);
        return rows[0];
    },

    setPrimaryImage: async (productID, imageID) => {
        // Unset all primaries for this product
        await db.query('UPDATE product_images SET is_primary = FALSE WHERE productID = $1', [productID]);
        // Set the specified image as primary
        const query = 'UPDATE product_images SET is_primary = TRUE WHERE imageID = $1 AND productID = $2 RETURNING *';
        const { rows } = await db.query(query, [imageID, productID]);
        return rows[0];
    }
};

module.exports = Product;
