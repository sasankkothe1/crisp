const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    postedBy: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    media: {
        type: [String]
    },
    tags: {
        type: [String],
        required: true
    },
    datePosted: {
        type: Date,
        required: true
    },
    premiumStatus: {
        type: Boolean,
        required: true
    },
    rating: {
        type: Number,
        required: true
    }
});