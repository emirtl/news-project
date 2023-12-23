const News = require('../models/news');
const mongoose = require('mongoose');
exports.getAll = async (req, res) => {
    try {
        const news = await News.find();
        if (!news) {
            return res.status(500).json({ error: 'fetching news failed' });
        }
        return res.status(200).json({ news });
    } catch (e) {
        return res.status(500).json({ error: 'fetching news failed', e });
    }
};

exports.insert = async (req, res) => {
    try {
        if (
            !req.body.title ||
            !req.body.description ||
            !req.body.richDescription ||
            !req.body.author ||
            !req.body.category
        ) {
            return res.status(500).json({ error: 'news body is needed' });
        }
        if (!req.file) {
            return res.status(500).json({ error: 'image is needed' });
        }

        const imagePath = `${req.protocol}://${req.get(
            'host'
        )}/public/uploads/${req.file.filename}`;

        const news = await News.create({
            title: req.body.title,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: imagePath,
            author: req.body.author,
            category: req.body.category,
        });

        if (!news) {
            return res.status(500).json({ error: 'news creation failed' });
        }
        return res.status(201).json({ news });
    } catch (e) {
        return res.status(500).json({ error: 'news creation failed', e });
    }
};
exports.update = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(500).json({ error: 'news id missing' });
        }
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(500).json({ error: 'news id not valid' });
        }

        const existedNews = News.findById(req.params.id);
        let newFile;

        if (!req.file) {
            newFile = existedNews.image;
        } else {
            const imagePath = `${req.protocol}://${req.get(
                'host'
            )}/public/uploads/${req.file.filename}`;
            newFile = imagePath;
        }

        const updatedNews = await News.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                description: req.body.description,
                richDescription: req.body.richDescription,
                image: newFile,
                author: req.body.author,
                category: req.body.category,
            },
            { new: true }
        );
        if (!updatedNews) {
            return res
                .status(500)
                .json({ error: 'updating news failed. please try later' });
        }

        return res.status(200).json({ updatedNews });
    } catch (e) {
        return res
            .status(500)
            .json({ error: 'updating news failed. please try later', e });
    }
};
exports.delete = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(500).json({ error: 'news id missing' });
        }
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(500).json({ error: 'news id not valid' });
        }
        const deletedNews = await News.findByIdAndDelete(req.params.id);
        if (!deletedNews) {
            return res
                .status(500)
                .json({ error: 'deleting news failed. please try later' });
        }
        return res.status(200).json({ message: 'news deleted' });
    } catch (e) {
        return res
            .status(500)
            .json({ error: 'deleting news failed. please try later', e });
    }
};
