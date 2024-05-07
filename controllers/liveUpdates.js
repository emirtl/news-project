const LiveUpdates = require('../models/liveUpdates');
const LiveUpdateItems = require('../models/liveUpdate-item');

const mongoose = require('mongoose');

exports.getAll = async (req, res) => {
    try {
        const liveUpdates = await LiveUpdates.find()
            .populate('liveUpdateItems')
            .sort({ createdAt: 1 });

        if (!liveUpdates) {
            return res
                .status(500)
                .json({ error: 'fetching live updates failed' });
        }
        return res.status(200).json({ liveUpdates });
    } catch (e) {
        return res
            .status(500)
            .json({ error: 'fetching live updates failed', e });
    }
};

exports.get = async (req, res) => {
    if (!req.params.id) {
        return res.status(500).json({ error: 'fetching live Update failed' });
    }
    try {
        const liveUpdate = await LiveUpdates.findById(req.params.id).populate(
            'liveUpdateItems'
        );
        liveUpdate.save();
        if (!liveUpdate) {
            return res
                .status(500)
                .json({ error: 'fetching liveUpdate failed' });
        }
        return res.status(200).json({ liveUpdate });
    } catch (e) {
        return res.status(500).json({ error: 'fetching liveUpdate failed', e });
    }
};

exports.insert = async (req, res) => {
    try {
        let mainCoverImagePath;

        if (req.file) {
            const imagePath = `${req.protocol}://${req.get(
                'host'
            )}/public/uploads/${req.file.filename}`;
            mainCoverImagePath = imagePath;
        } else {
            mainCoverImagePath = '';
        }

        const liveUpdates = await LiveUpdates.create({
            coverTitle: req.body.coverTitle,
            mainCoverImage: mainCoverImagePath,
            liveUpdateItems: [],
        });
        if (!liveUpdates) {
            return res
                .status(500)
                .json({ error: 'live updates creation failed' });
        }
        return res.status(201).json({ liveUpdates });
    } catch (e) {
        return res
            .status(500)
            .json({ error: 'live updates creation failed', e });
    }
};

exports.CreateLiveUpdateItem = async (req, res) => {
    try {
        console.log(req.body);
        let liveUpdateImagePath;

        if (req.file) {
            const imagePath = `${req.protocol}://${req.get(
                'host'
            )}/public/uploads/${req.file.filename}`;
            liveUpdateImagePath = imagePath;
        } else {
            liveUpdateImagePath = '';
        }

        const id = req.params.id;
        const liveUpdate = await LiveUpdates.findById(id);
        let newLiveUpdateItem = await new LiveUpdateItems({
            liveUpdateTitle: req.body.liveUpdateTitle,
            liveUpdateDescription: req.body.liveUpdateDescription,
            liveUpdateRichDescription: req.body.liveUpdateRichDescription,
            liveUpdateImage: liveUpdateImagePath,
            isImportant: req.body.isImportant,
            liveUpdate,
        });
        await newLiveUpdateItem.save();

        liveUpdate.liveUpdateItems.push(newLiveUpdateItem);
        await liveUpdate.save();
        return res.status(201).json({ liveUpdate });
    } catch (e) {
        return res
            .status(500)
            .json({ error: 'live updates Item creation failed', e });
    }
};

exports.updateLiveUpdate = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(500).json({ error: 'live Update id missing' });
        }
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(500).json({ error: 'live Update id not valid' });
        }

        const existedLiveUpdate = await LiveUpdates.findById(req.params.id);
        let mainCoverImagepath;

        if (req.file) {
            const imagePath = `${req.protocol}://${req.get(
                'host'
            )}/public/uploads/${req.file.filename}`;
            mainCoverImagepath = imagePath;
        } else {
            mainCoverImagepath = existedLiveUpdate.image;
        }

        const updatedLiveUpdate = await LiveUpdates.findByIdAndUpdate(
            req.params.id,
            {
                coverTitle: req.body.coverTitle,
                mainCoverImage: mainCoverImagepath,
            },
            { new: true }
        );
        if (!updatedLiveUpdate) {
            return res.status(500).json({
                error: 'updating live Update failed. please try later',
            });
        }

        return res.status(200).json({ updatedLiveUpdate });
    } catch (e) {
        return res
            .status(500)
            .json({
                error: 'updating live Update  failed. please try later',
                e,
            });
    }
};
exports.delete = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(500).json({ error: 'live update id missing' });
        }
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(500).json({ error: 'live update id not valid' });
        }

        const deletedLiveUpdate = await LiveUpdates.findByIdAndDelete(
            req.params.id
        );

        let liveUpdateItemsIds = [];

        deletedLiveUpdate.liveUpdateItems.forEach((element) => {
            console.log(element);
            liveUpdateItemsIds.push(element);
        });
        console.log(liveUpdateItemsIds);

        await LiveUpdateItems.deleteMany({ _id: { $in: liveUpdateItemsIds } });

        if (!deletedLiveUpdate) {
            return res.status(500).json({
                error: 'deleting live update failed. please try later',
            });
        }
        return res.status(200).json({ message: 'live update deleted' });
    } catch (e) {
        return res.status(500).json({
            error: 'deleting live update failed. please try later',
            e,
        });
    }
};

exports.deleteLiveUpdateItem = async (req, res) => {
    try {
        const liveUdpateId = req.query.liveUpdateId;
        const liveUdpateItemId = req.params.id;

        if (!liveUdpateId) {
            return res.status(500).json({ error: 'live update id missing' });
        }

        if (!liveUdpateItemId) {
            return res
                .status(500)
                .json({ error: 'live update item id missing' });
        }
        if (!mongoose.isValidObjectId(liveUdpateItemId)) {
            return res
                .status(500)
                .json({ error: 'live update item id not valid' });
        }

        const updatedLiveUpdate = await LiveUpdates.findByIdAndUpdate(
            liveUdpateId,
            {
                $pull: {
                    liveUpdateItems: liveUdpateItemId,
                },
            },
            { new: true }
        );
        if (!updatedLiveUpdate) {
            return res
                .status(500)
                .json({ error: 'live update item delition failed' });
        }
        await LiveUpdateItems.findByIdAndDelete(liveUdpateItemId);
        console.log(updatedLiveUpdate);

        return res.status(200).json({ updatedLiveUpdate });
    } catch (e) {
        return res.status(500).json({
            error: 'deleting live update item failed. please try later',
            e,
        });
    }
};
