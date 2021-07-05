// routes/api/post.js

const express = require("express");
const router = express.Router();

// Load BankDetails model
const BankDetailsController = require("../../controllers/bankdetails");

const middleware = require("../../middleware/auth");

router.post("/", middleware.isAuthenticated, BankDetailsController.create);

router.get("/:id", middleware.isAuthenticated, BankDetailsController.read);

router.put("/:id", middleware.isAuthenticated, BankDetailsController.update);

router.delete("/:id", middleware.isAuthenticated, BankDetailsController.remove);

module.exports = router;
