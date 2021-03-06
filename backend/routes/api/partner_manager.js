// routes/api/post.js

const express = require("express");
const router = express.Router();

const PartnerManagerController = require("../../controllers/partner_manager");

const middleware = require("../../middleware/auth");

router.get(
    "/getAll",
    middleware.isAuthenticated,
    middleware.isAdmin,
    PartnerManagerController.getAll
);

router.post(
    "/create",
    middleware.isAuthenticated,
    middleware.isAdmin,
    PartnerManagerController.create
);

router.put(
    "/assign/:id",
    middleware.isAuthenticated,
    middleware.isAdmin,
    PartnerManagerController.assign
);

router.put(
    "/:id",
    middleware.isAuthenticated,
    middleware.isAdmin,
    PartnerManagerController.removeAssign
);

router.delete(
    "/:id",
    middleware.isAuthenticated,
    middleware.isAdmin,
    PartnerManagerController.remove
);

module.exports = router;
