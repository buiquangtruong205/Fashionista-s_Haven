const db = require('../config/db');

const Product = {
    create: async (productData) => {
        const { categoryID, name, slug, base_price, description, thumbnail } = productData;
        const query = 'INSERT INTO products ("categoryID", name, slug, base_price, description, thumbnail) VALUES ($1, $2, $3, $4, $5, $6) RETURNING "productID"';
        const { rows } = await db.query(query, [categoryID, name, slug, base_price, description, thumbnail]);
        return rows[0].productID;
    },

    findAll: async (filters = {}) => {
        let query = `
            SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p."categoryID" = c."categoryID" 
            WHERE p.is_deleted = FALSE AND p.is_active = TRUE
        `;
        const params = [];
        let paramCount = 1;

        if (filters.categoryID) {
            query += ` AND p."categoryID" = $${paramCount++}`;
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
        const query = 'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p."categoryID" = c."categoryID" WHERE p."productID" = $1 AND p.is_deleted = FALSE';
        const { rows } = await db.query(query, [id]);
        return rows[0];
    },

    findBySlug: async (slug) => {
        const query = 'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p."categoryID" = c."categoryID" WHERE p.slug = $1 AND p.is_deleted = FALSE';
        const { rows } = await db.query(query, [slug]);
        return rows[0];
    },

    getVariants: async (id) => {
        const query = `
            SELECT v.*, cl.name as color_name, cl.hex_code, sz.name as size_name 
            FROM product_variants v
            LEFT JOIN colors cl ON v."colorID" = cl."colorID"
            LEFT JOIN sizes sz ON v."sizeID" = sz."sizeID"
            WHERE v."productID" = $1
        `;
        const { rows } = await db.query(query, [id]);
        return rows;
    },

    update: async (id, productData) => {
        const { categoryID, name, slug, base_price, description, thumbnail, is_active } = productData;
        const query = `
            UPDATE products 
            SET "categoryID" = $1, name = $2, slug = $3, base_price = $4, description = $5, thumbnail = $6, is_active = $7, updated_at = CURRENT_TIMESTAMP
            WHERE "productID" = $8
        `;
        const result = await db.query(query, [categoryID, name, slug, base_price, description, thumbnail, is_active, id]);
        return result.rowCount > 0;
    },

    softDelete: async (id) => {
        const query = 'UPDATE products SET is_deleted = TRUE WHERE "productID" = $1';
        const result = await db.query(query, [id]);
        return result.rowCount > 0;
    }
};

module.exports = Product;
