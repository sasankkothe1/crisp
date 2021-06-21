const express = require("express");
const router = express.Router();
const { getPrivateData } = require("../../controllers/private");
const { isAuthenticated } = require("../../middleware/auth");

router.route("/").get(isAuthenticated, getPrivateData);

module.exports = router;
