const Opinions = require('../models/opinion');
const mongoose = require('mongoose');
exports.getAll = async (req, res) => {
    try {
        const opinions = await Opinions.find().populate('author');
        if (!opinions) {
            return res.status(500).json({ error: 'fetching opinions failed' });
        }
        return res.status(200).json({ opinions });
    } catch (e) {
        return res.status(500).json({ error: 'fetching opinions failed', e });
    }
};

exports.get = async (req, res) => {
    if (!req.params.id) {
        return res.status(500).json({ error: 'fetching opinions failed' });
    }
    try {
        const opinion = await Opinions.findById(req.params.id).populate(
            'author'
        );
        opinion.numReviews += 1;
        opinion.save();
        if (!opinion) {
            return res.status(500).json({ error: 'fetching opinions failed' });
        }
        return res.status(200).json({ opinion });
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
            !req.body.author
        ) {
            return res.status(500).json({ error: 'opinion body is needed' });
        }

        let coverImagePath;
        if (req.file) {
            const imagePath = `${req.protocol}://${req.get(
                'host'
            )}/public/uploads/${req.file.filename}`;
            coverImagePath = imagePath;
        } else {
            return res.status(500).json({ error: 'opinion image is needed' });
        }

        const opinion = await Opinions.create({
            title: req.body.title,
            description: req.body.description,
            richDescription: req.body.richDescription,
            coverImage: coverImagePath,
            author: req.body.author,
        });
        if (!opinion) {
            return res.status(500).json({ error: 'opinion creation failed' });
        }

        return res.status(201).json({ Opinion: opinion });
    } catch (e) {
        return res.status(500).json({ error: 'Opinion creation failed', e });
    }
};
exports.update = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(500).json({ error: 'opinion id missing' });
        }
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(500).json({ error: 'opinion id not valid' });
        }

        const existedOpinion = await Opinions.findById(req.params.id);
        let coverImagePath;

        if (req.file) {
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

            const imagePath = `${req.protocol}://${req.get(
                'host'
            )}/public/uploads/${req.file.filename}`;
            coverImagePath = imagePath;
        } else {
            coverImagePath = existedOpinion.coverImage;
        }

        const updatedOpinion = await Opinions.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                description: req.body.description,
                richDescription: req.body.richDescription,
                coverImage: coverImagePath,
                author: req.body.author,
            },
            { new: true }
        );
        if (!updatedOpinion) {
            return res
                .status(500)
                .json({ error: 'updating Opinion failed. please try later' });
        }

        return res.status(200).json({ updatedOpinion });
    } catch (e) {
        return res
            .status(500)
            .json({ error: 'updating news failed. please try later', e });
    }
};
exports.delete = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(500).json({ error: 'opinion id missing' });
        }
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(500).json({ error: 'opinion id not valid' });
        }
        const deletedOpinion = await Opinions.findByIdAndDelete(req.params.id);
        if (!deletedOpinion) {
            return res
                .status(500)
                .json({ error: 'deleting opinion failed. please try later' });
        }
        return res.status(200).json({ message: 'opinion deleted' });
    } catch (e) {
        return res.status(500).json({
            error: 'deleting opiniontoolbar failed. please try later',
            e,
        });
    }
};
