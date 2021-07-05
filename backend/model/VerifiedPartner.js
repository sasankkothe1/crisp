const mongoose = require("mongoose");

const VerifiedPartnerSchema = new mongoose.Schema({
    recipeCollections: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RecipeCollection",
        required: true,
    },
    bankDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BankDetails",
        required: true,
    },
    partnerManager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PartnerManager",
        required: true,
    },
});

const VerifiedPartner = mongoose.model(
    "VerifiedPartner",
    VerifiedPartnerSchema
);

module.exports = { VerifiedPartner };
