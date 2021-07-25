const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const PostSchema = new mongoose.Schema({
    typeOfPost: {
        type: String,
        required: true,
        default: "post",
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    media: {
        type: [String],
    },
    tags: {
        type: [String],
    },
    datePosted: {
        type: Date,
        required: true,
        default: Date.now,
    },
    premiumStatus: {
        type: Boolean,
        required: true,
    },
    cumulativeRating: {
        type: Number,
        default: 0,
    },
    numRates: {
        type: Number,
        default: 0,
    },
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
});

PostSchema.plugin(mongoosePaginate);

PostSchema.virtual("rating").get(function () {
    if (this.numRates > 0) {
        return this.cumulativeRating / this.numRates;
    } else {
        return 0;
    }
});

const PostModel = mongoose.model("Post", PostSchema);

module.exports = { PostModel };
