const express = require("express");

const api = express
    .Router()
    .use("/orders", require("./api/order"))
    .use("/posts", require("./api/post"))
    .use("/events", require("./api/event"))
    .use("/recipes", require("./api/recipe"))
    .use("/recipe_collections", require("./api/recipe_collection"))
    .use("/rating", require("./api/rating"))
    .use("/users", require("./api/user"))
    .use("/auth", require("./api/auth"))
    .use("/private", require("./api/private"))
    .use("/bankdetails", require("./api/bank_details"))
    .use("/partnerManager", require("./api/partner_manager"));

module.exports = {
    api,
};
