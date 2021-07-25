const mongoose = require("mongoose");

const PartnerApplicationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    applicationDate: {
        type: Date,
        default: Date.now,
    },
});

const PartnerApplication = mongoose.model(
    "PartnerApplication",
    PartnerApplicationSchema
);

module.exports = { PartnerApplication };
