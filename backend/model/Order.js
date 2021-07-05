const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    orderedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    transactionID: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["Subscription", "RecipeCollection"],
        required: () => {
            return this.type && this.recipeCollection ^ this.subscription;
        },
    },
    subscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    recipeCollection: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RecipeCollection",
    },
    totalAmount: {
        type: Number,
        required: true,
    },
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
