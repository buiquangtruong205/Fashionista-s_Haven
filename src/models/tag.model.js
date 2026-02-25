const db = require('../config/db');

const Tag = {
    findAll: async () => {
        const query = 'SELECT * FROM tags';
        const { rows } = await db.query(query);
        return rows;
    },

    findById: async (id) => {
        const query = 'SELECT * FROM tags WHERE "tagID" = $1';
        const { rows } = await db.query(query, [id]);
        return rows[0];
    }
};

module.exports = Tag;
