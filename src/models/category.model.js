const db = require('../config/db');

const Category = {
    create: async (categoryData) => {
        const { name, slug, description } = categoryData;
        const query = 'INSERT INTO categories (name, slug, description) VALUES ($1, $2, $3) RETURNING "categoryID"';
        const { rows } = await db.query(query, [name, slug, description]);
        return rows[0].categoryID;
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
    }
};

module.exports = Category;
