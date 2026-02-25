const Tag = require('../models/tag.model');

exports.getTags = async (req, res) => {
    try {
        const tags = await Tag.findAll();
        res.json(tags);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching tags' });
    }
};
