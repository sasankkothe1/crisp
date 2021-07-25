const express = require("express");

const api = express
    .Router()
    .use("/orders", require("./api/order"))
    .use("/posts", require("./api/post"))
    .use("/events", require("./api/event"))
    .use("/recipes", require("./api/recipe"))
    .use("/recipe_collections", require("./api/recipe_collection"))
    .use("/partner_managers", require("./api/partner_manager"))
    .use("/partner_applications", require("./api/partner_application"))
    .use("/rating", require("./api/rating"))
    .use("/users", require("./api/user"))
    .use("/auth", require("./api/auth"));

module.exports = {
    api,
};
