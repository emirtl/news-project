const News = require('../models/news');
const mongoose = require('mongoose');
exports.getAll = async (req, res) => {
    let filter = {};
    if (req.query.categories) {
        filter = {
            category: req.query.categories.split(','),
        };
    }
    if (req.query.isFeatured) {
        filter = {
            isFeatured: true,
        };
    }
    if (req.query.minNumViews || req.query.maxNumViews) {
        const numViewsFilter = {};
        if (req.query.minNumViews) {
            numViewsFilter.$gte = parseInt(req.query.minNumViews);
        }
        if (req.query.maxNumViews) {
            numViewsFilter.$lte = parseInt(req.query.maxNumViews);
        }
        filter.numReviews = numViewsFilter;
    }

    if (req.query.$search) {
        const $searchText = req.query.$search.toLowerCase();
        filter = {
            $or: [
                { title: { $regex: $searchText, $options: 'i' } },
                { description: { $regex: $searchText, $options: 'i' } },
            ],
        };
    }
    try {
        const news = await News.find(filter)
            .populate('category')
            .populate('author');
        if (!news) {
            return res.status(500).json({ error: 'fetching news failed' });
        }
        return res.status(200).json({ news });
    } catch (e) {
        return res.status(500).json({ error: 'fetching news failed', e });
    }
};

exports.get = async (req, res) => {
    if (!req.params.id) {
        return res.status(500).json({ error: 'fetching news failed' });
    }
    try {
        const news = await News.findById(req.params.id)
            .populate('category')
            .populate('author');
        news.numReviews += 1;
        news.save();
        console.log(news);
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
            !req.body.category ||
            !req.files.coverImage ||
            !req.files.image
        ) {
            return res.status(500).json({ error: 'news body is needed' });
        }

        let coverImagePath;
        let newImagePath;
        if (req.files.image) {
            req.files.image.map((file) => {
                const imagePath = `${req.protocol}://${req.get(
                    'host'
                )}/public/uploads/${file.filename}`;
                newImagePath = imagePath;
            });
        }

        if (req.files.coverImage) {
            req.files.coverImage.map((file) => {
                const imagePath = `${req.protocol}://${req.get(
                    'host'
                )}/public/uploads/${file.filename}`;
                coverImagePath = imagePath;
            });
        }

        const news = await News.create({
            title: req.body.title,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: newImagePath,
            coverImage: coverImagePath,
            author: req.body.author,
            category: req.body.category,
            isFeatured: req.body.isFeatured,
            isBreakingNews: req.body.isBreakingNews,
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
                isFeatured: req.body.isFeatured,
                isBreakingNews: req.body.isBreakingNews,
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
