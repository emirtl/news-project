const mongoose = require('mongoose');
const opinionSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        richDescription: { type: String, required: true },
        coverImage: { type: String },
        author: {
            type: mongoose.Types.ObjectId,
            ref: 'Author',
        },
        numReviews: { type: Number, default: 100 },
    },
    { timestamps: true }
);

opinionSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

opinionSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('Opinion', opinionSchema);
