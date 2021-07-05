// routes/api/post.js

const express = require("express");
const router = express.Router();

// Load VerifiedPartner model
const VerifiedPartner = require("../../models/VerifiedPartner");

// @route GET api/verified_partner/test
// @description tests verified_partner route
// @access Public
router.get("/test", (req, res) => res.send("verified_partner route testing!"));

// @route GET api/verified_partner
// @description Get all verified partners
// @access Public
router.get("/", (req, res) => {
    VerifiedPartner.find()
        .then((VerifiedPartner) => res.json(VerifiedPartner))
        .catch((err) =>
            res
                .status(404)
                .json({ noVerifiedPartnerfound: "No Verified Partner found" })
        );
});
