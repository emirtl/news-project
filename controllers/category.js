const Category = require('../models/category');
const mongoose = require('mongoose');
exports.getAll = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: 1 });

        if (!categories) {
            return res
                .status(500)
                .json({ error: 'fetching categories failed' });
        }
        return res.status(200).json({ categories });
    } catch (e) {
        return res.status(500).json({ error: 'fetching categories failed', e });
    }
};

exports.insert = async (req, res) => {
    try {
        if (!req.body.title) {
            return res.status(500).json({ error: 'category title is needed' });
        }

        let category = new Category({
            title: req.body.title,
        });

        category = await category.save();

        if (!category) {
            return res.status(500).json({ error: 'category creation failed' });
        }
        return res.status(201).json({ category });
    } catch (e) {
        return res.status(500).json({ error: 'category creation failed', e });
    }
};
exports.update = async (req, res) => {
    try {
        if (!req.body.title) {
            return res.status(500).json({ error: 'category title is needed' });
        }

        if (!req.params.id) {
            return res.status(500).json({ error: 'category id missing' });
        }

        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(500).json({ error: 'category id not valid' });
        }
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
            },
            { new: true }
        );

        if (!updatedCategory) {
            return res
                .status(500)
                .json({ error: 'updating category failed. please try later' });
        }
        return res.status(200).json({ updatedCategory });
    } catch (e) {
        return res
            .status(500)
            .json({ error: 'updating category failed. please try later', e });
    }
};

exports.delete = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(500).json({ error: 'category id missing' });
        }
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(500).json({ error: 'category id not valid' });
        }
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        if (!deletedCategory) {
            return res
                .status(500)
                .json({ error: 'deleting category failed. please try later' });
        }
        return res.status(200).json({ deletedCategory });
    } catch (e) {
        return res
            .status(500)
            .json({ error: 'deleting category failed. please try later', e });
    }
};
