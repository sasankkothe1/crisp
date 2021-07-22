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
    rating: {
        type: Number,
        default: 0,
    },
});

PostSchema.plugin(mongoosePaginate);

const PostModel = mongoose.model("Post", PostSchema);

module.exports = { PostModel };
