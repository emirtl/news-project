const mongoose = require('mongoose');
const liveUpdateItemsSchema = new mongoose.Schema(
    {
        liveUpdateTitle: { type: String, required: true },
        liveUpdateDescription: { type: String, required: true },
        liveUpdateRichDescription: { type: String },
        liveUpdateImage: { type: String },
        isImportant: { type: Boolean, default: false },
        liveUpdate: { type: mongoose.Types.ObjectId, ref: 'liveUpdates' },
    },
    { timestamps: true }
);

liveUpdateItemsSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

liveUpdateItemsSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('liveUpdateItems', liveUpdateItemsSchema);
