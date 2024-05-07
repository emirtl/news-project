const mongoose = require('mongoose');
const liveUpdatesSchema = new mongoose.Schema(
    {
        coverTitle: { type: String },
        mainCoverImage: { type: String },
        liveUpdateItems: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'liveUpdateItems',
                required: false,
            },
        ],
    },
    { timestamps: true }
);

liveUpdatesSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

liveUpdatesSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('liveUpdates', liveUpdatesSchema);
