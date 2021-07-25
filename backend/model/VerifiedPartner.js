const mongoose = require("mongoose");

const BankDetailsSchema = new mongoose.Schema({
    nameOfTheBank: {
        type: String,
        required: true,
    },
    BIC: {
        type: String,
        required: true,
    },
    IBAN: {
        type: String,
        required: true,
    },
});

const VerifiedPartnerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    partnerManager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PartnerManager",
    },
    recipeCollections: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "RecipeCollection",
        default: [],
    },
    bankDetails: {
        type: BankDetailsSchema,
    },
});

const VerifiedPartner = mongoose.model(
    "VerifiedPartner",
    VerifiedPartnerSchema
);

module.exports = { VerifiedPartner };
