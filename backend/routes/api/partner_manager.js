// routes/api/post.js

const express = require("express");
const router = express.Router();

const PartnerManagerController = require("../../controllers/partner_manager");

const middleware = require("../../middleware/auth");

router.post("/", middleware.isAdmin, PartnerManagerController.create);

router.put("/:id", middleware.isAdmin, PartnerManagerController.assign);

router.put("/:id", middleware.isAdmin, PartnerManagerController.removeAssign);

router.delete("/:id", middleware.isAdmin, PartnerManagerController.remove);

module.exports = router;
