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
        enum: ["RecipeCollection"],
        required: true,
    },
    recipeCollection: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RecipeCollection",
        required: true,
    },
    rating: {
        type: Number,
        min: 0,
        max: 10,
    },
});

const Rating = mongoose.model("Rating", RatingSchema);

module.exports = Rating;
