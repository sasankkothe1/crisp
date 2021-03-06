const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const RecipeCollectionSchema = new mongoose.Schema(
    {
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
            select: false,
        },
        meal: {
            type: String,
            enum: ["Breakfast", "Dinner", "Snacks", "Lunch"],
        },
        datePosted: {
            type: Date,
            default: Date.now,
        },
        price: {
            type: Number,
            required: true,
        },
        numOrders: {
            type: Number,
            default: 0,
        },
        cumulativeRating: {
            type: Number,
            default: 0,
        },
        numRates: {
            type: Number,
            default: 0,
        },
    },
    {
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
    }
);

RecipeCollectionSchema.plugin(mongoosePaginate);

RecipeCollectionSchema.virtual("rating").get(function () {
    if (this.numRates > 0) {
        return this.cumulativeRating / this.numRates;
    } else {
        return 0;
    }
});

const RecipeCollection = mongoose.model(
    "RecipeCollection",
    RecipeCollectionSchema
);

module.exports = RecipeCollection;
