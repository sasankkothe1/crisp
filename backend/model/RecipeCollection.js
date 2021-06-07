const mongoose = require('mongoose');

const RecipeCollectionSchema = new mongoose.Schema({
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
        type: [String]
    },
    pdfFile: {
        type: [String],
        required: true
    },
    datePosted: {
        type: Date,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    numOrders: {
        type: Number,
        required: true
    }
});