const db = require('../config/db');

const Category = {
    create: async (categoryData) => {
        const { name, slug, description } = categoryData;
        const query = 'INSERT INTO categories (name, slug, description) VALUES ($1, $2, $3) RETURNING categoryID';
        const { rows } = await db.query(query, [name, slug, description]);
        return rows[0].categoryID || rows[0].categoryid;
    },

    findAll: async () => {
        const query = 'SELECT * FROM categories WHERE is_deleted = FALSE AND is_active = TRUE';
        const { rows } = await db.query(query);
        return rows;
    },

    findBySlug: async (slug) => {
        const query = 'SELECT * FROM categories WHERE slug = $1 AND is_deleted = FALSE';
        const { rows } = await db.query(query, [slug]);
        return rows[0];
    },

    findById: async (id) => {
        const query = 'SELECT * FROM categories WHERE categoryID = $1 AND is_deleted = FALSE';
        const { rows } = await db.query(query, [id]);
        return rows[0];
    },

    update: async (id, categoryData) => {
        const { name, slug, description, is_active } = categoryData;
        const query = `
            UPDATE categories 
            SET name = $1, slug = $2, description = $3, is_active = $4, updated_at = CURRENT_TIMESTAMP
            WHERE categoryID = $5
        `;
        const result = await db.query(query, [name, slug, description, is_active, id]);
        return result.rowCount > 0;
    },

    softDelete: async (id) => {
        const query = 'UPDATE categories SET is_deleted = TRUE WHERE categoryID = $1';
        const result = await db.query(query, [id]);
        return result.rowCount > 0;
    }
};

module.exports = Category;
