const mongoose = require("mongoose");
const connectDB = require("../config/db");

connectDB();

module.exports = {
    BillingInfo: require("./BillingInfo"),
    RecipeCollection: require("./RecipeCollection"),
    Post: require("./Post"),
    User: require("./User"),
};
