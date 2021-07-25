const express = require("express");
const router = express.Router();

const PartnerApplicationController = require("../../controllers/partner_application");

const middleware = require("../../middleware/auth");

router.get(
    "/getAll",
    middleware.isAuthenticated,
    middleware.isAdmin,
    PartnerApplicationController.getAll
);

router.get(
    "/getById",
    middleware.isAuthenticated,
    PartnerApplicationController.getById
);

router.post(
    "/create",
    middleware.isAuthenticated,
    PartnerApplicationController.create
);

router.put(
    "/approve",
    middleware.isAuthenticated,
    middleware.isAdmin,
    PartnerApplicationController.approve
);

router.put(
    "/reject",
    middleware.isAuthenticated,
    middleware.isAdmin,
    PartnerApplicationController.reject
);

module.exports = router;
