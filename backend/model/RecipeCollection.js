const mongoose = require('mongoose');

const RecipeCollectionSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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

const RecipeCollection = mongoose.model('RecipeCollection', RecipeCollectionSchema);

module.exports = RecipeCollection;