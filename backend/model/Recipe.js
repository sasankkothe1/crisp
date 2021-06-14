const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
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
        type: [String],
        default: ["noTags"]
    },
    datePosted: {
        type: Date,
        default: Date.now
    },
    premiumStatus: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
    },
    ingredientsList: [{
        ingredientName: {
            type: String
        },
        ingredientQuantity: {
            type: String
        }
    }],
    instructions: {
        type: [String]
    },
    cuisine: {
        type: String
    }
});

const RecipeModel = mongoose.model('Recipe', RecipeSchema);

module.exports = { RecipeModel };