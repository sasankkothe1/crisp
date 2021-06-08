const mongoose = require('mongoose');

const VerifiedPartnerSchema = new mongoose.Schema({
    recipeCollections: {
        type: [String],
        required: true
    },
    bankDetails: {
        type: String,
        required: true
    },
    partnerManager: {
        type: String,
        required: true
    }
});

const VerifiedPartner = mongoose.model('VerifiedPartner', VerifiedPartnerSchema);

module.exports = VerifiedPartner;
