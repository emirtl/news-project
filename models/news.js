const mongoose = require('mongoose');
const newsSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        richDescription: { type: String, required: true },
        image: { type: String, required: true },
        images: { type: String },
        author: {
            type: mongoose.Types.ObjectId,
            ref: 'Author',
        },
        category: {
            type: mongoose.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
    },
    { timestamps: true }
);

newsSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

newsSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('News', newsSchema);
