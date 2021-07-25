const express = require("express");
const router = express.Router();

const {
    isAuthenticated,
    authenticateIfPossible,
} = require("../../middleware/auth");

const RatingController = require("../../controllers/rating");

router.get("/user_rate/:id", isAuthenticated, RatingController.getUserRate);

router.post("/:id", isAuthenticated, RatingController.rate);

module.exports = router;
