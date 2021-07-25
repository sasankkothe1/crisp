const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    ratedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    type: {
        type: String,
        enum: ["RecipeCollection", "Post", "Event", "Recipe"],
        required: true,
    },
    recipeCollection: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RecipeCollection",
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    },
    recipe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe"
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
    },
});

const Rating = mongoose.model("Rating", RatingSchema);

module.exports = Rating;
