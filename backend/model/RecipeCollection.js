const mongoose = require("mongoose");

const RecipeCollectionSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
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
    pdfFile: {
        type: String,
        required: true,
    },
    datePosted: {
        type: Date,
        default: Date.now,
    },
    price: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number,
        default: 0,
    },
    numOrders: {
        type: Number,
        default: 0,
    },
});

const RecipeCollection = mongoose.model(
    "RecipeCollection",
    RecipeCollectionSchema
);

module.exports = RecipeCollection;
