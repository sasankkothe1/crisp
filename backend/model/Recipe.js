const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const RecipeSchema = new mongoose.Schema({
    typeOfPost: {
        type: String,
        required: true,
        default: "recipe",
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
        default: ["noTags"],
    },
    datePosted: {
        type: Date,
        default: Date.now,
    },
    premiumStatus: {
        type: Boolean,
        default: false,
    },
    rating: {
        type: Number,
        default: 0,
    },
    ingredientsList: [
        {
            ingredientName: {
                type: String,
            },
            ingredientQuantity: {
                type: String,
            },
        },
    ],
    instructions: {
        type: [String],
    },
    cuisine: {
        type: String,
    },
});

RecipeSchema.plugin(mongoosePaginate)
const RecipeModel = mongoose.model("Recipe", RecipeSchema);

module.exports = { RecipeModel };
