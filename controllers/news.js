const News = require('../models/news');
const mongoose = require('mongoose');
exports.getAll = async (req, res) => {
    let limit;
    if (req.query.limit) {
        limit = req.query.limit;
    } else {
        limit = 0;
    }

    let filter = {};
    if (req.query.categories) {
        filter = {
            category: req.query.categories.split(','),
        };
    }
    if (req.query.isBreaking) {
        filter = {
            isBreakingNews: true,
        };
    }

    if (req.query.isCatchingUp) {
        filter = {
            isCatchingUp: true,
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
            .sort({ _id: -1 }) // Sort by _id in descending order (newest first)
            .limit(limit)
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

        let news = new News({
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
        news = await news.save();

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

        const existedNews = await News.findById(req.params.id);
        let coverImagePath;
        let newImagePath;

        if (req.files.image) {
            // if (
            //     req.files.image.mimetype != 'video/mp4' ||
            //     req.files.image.mimetype != 'video/quicktime' ||
            //     req.files.image.mimetype != 'video/webm' ||
            //     req.files.image.mimetype != 'video/x-flv'
            // ) {
            //     return res.status(500).json({
            //         error: 'wrong file format. format is not a file',
            //     });
            // }
            req.files.image.map((file) => {
                const imagePath = `${req.protocol}://${req.get(
                    'host'
                )}/public/uploads/${file.filename}`;
                newImagePath = imagePath;
            });
        } else {
            newImagePath = existedNews.image;
        }

        if (req.files.coverImage) {
            // if (
            //     req.files.coverImage.mimetype != 'image/jpeg' ||
            //     req.files.coverImage.mimetype != 'image/jpg' ||
            //     req.files.coverImage.mimetype != 'image/png' ||
            //     req.files.coverImage.mimetype != 'image/gif'
            // ) {
            //     return res.status(500).json({
            //         error: 'wrong cover image format. format is not an image',
            //     });
            // }
            console.log(req.files.coverImage);
            req.files.coverImage.map((file) => {
                const imagePath = `${req.protocol}://${req.get(
                    'host'
                )}/public/uploads/${file.filename}`;
                coverImagePath = imagePath;
            });
        } else {
            coverImagePath = existedNews.coverImagePath;
        }

        const updatedNews = await News.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                description: req.body.description,
                richDescription: req.body.richDescription,
                image: newImagePath,
                coverImage: coverImagePath,
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
        return res.status(200).json({ deletedNews });
    } catch (e) {
        return res
            .status(500)
            .json({ error: 'deleting news failed. please try later', e });
    }
};
