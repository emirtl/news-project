const Author = require('../models/author');
const mongoose = require('mongoose');
exports.getAll = async (req, res) => {
    try {
        const authors = await Author.find();

        if (!authors) {
            return res.status(500).json({ error: 'fetching authors failed' });
        }
        return res.status(200).json({ authors });
    } catch (e) {
        return res.status(500).json({ error: 'fetching authors failed', e });
    }
};

exports.insert = async (req, res) => {
    try {
        if (!req.body.name || !req.body.position || !req.body.description) {
            return res.status(500).json({ error: 'author body is needed' });
        }
        const author = await Author.create({
            name: req.body.name,
            position: req.body.position,
            description: req.body.description,
        });

        if (!author) {
            return res.status(500).json({ error: 'author creation failed' });
        }
        return res.status(201).json({ author });
    } catch (e) {
        return res.status(500).json({ error: 'author creation failed', e });
    }
};
exports.update = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(500).json({ error: 'author id missing' });
        }
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(500).json({ error: 'author id not valid' });
        }
        const updatedAuthor = await Author.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                position: req.body.position,
                description: req.body.description,
            },
            { new: true }
        );

        if (!updatedAuthor) {
            return res
                .status(500)
                .json({ error: 'updating author failed. please try later' });
        }
        return res.status(200).json({ updatedAuthor });
    } catch (e) {
        return res
            .status(500)
            .json({ error: 'updating author failed. please try later', e });
    }
};

exports.delete = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(500).json({ error: 'author id missing' });
        }
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(500).json({ error: 'author id not valid' });
        }
        const deletedAuthor = await Author.findByIdAndDelete(req.params.id);
        if (!deletedAuthor) {
            return res
                .status(500)
                .json({ error: 'deleting author failed. please try later' });
        }
        return res.status(200).json({ message: 'author deleted' });
    } catch (e) {
        return res
            .status(500)
            .json({ error: 'deleting author failed. please try later', e });
    }
};
