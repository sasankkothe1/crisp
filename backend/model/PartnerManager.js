const mongoose = require("mongoose");

const PartnerManagerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    assignedTo: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: [],
    },
});

const PartnerManager = mongoose.model("PartnerManager", PartnerManagerSchema);

module.exports = { PartnerManager };
