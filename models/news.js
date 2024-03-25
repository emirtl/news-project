const mongoose = require('mongoose');
const newsSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        richDescription: { type: String, required: true },
        image: { type: String },
        coverImage: { type: String },
        author: {
            type: mongoose.Types.ObjectId,
            ref: 'Author',
        },
        category: {
            type: mongoose.Types.ObjectId,
            ref: 'Category',
            required: true,
        },

        isFeatured: { type: Boolean, default: false },
        isBreakingNews: { type: Boolean, default: false },
        isCatchingUp: { type: Boolean, default: false },
        numReviews: { type: Number, default: 100 },
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
