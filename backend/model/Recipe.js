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

RecipeSchema.plugin(mongoosePaginate);

RecipeSchema.virtual("rating").get(function () {
    if (this.numRates > 0) {
        return this.cumulativeRating / this.numRates;
    } else {
        return 0;
    }
});

const RecipeModel = mongoose.model("Recipe", RecipeSchema);

module.exports = { RecipeModel };
