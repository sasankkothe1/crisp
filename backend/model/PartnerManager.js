const mongoose = require('mongoose');

const PartnerManagerSchema = new mongoose.Schema({
    partnerManagerName: {
        type: String,
        required: true
    },
    partnerManagerEmail: {
        type: String,
        required: true
    },
    assignedTo: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        required: true,
    }
});

const PartnerManager = mongoose.model('PartnerManager', PartnerManagerSchema);

module.exports = { PartnerManager };
