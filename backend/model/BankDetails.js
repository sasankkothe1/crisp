const mongoose = require('mongoose');

const BankDetailsSchema = new mongoose.Schema({
    nameOfTheBank: {
        type: String,
        required: true
    },
    BIC: {
        type: String,
        required: true
    },
    IBAN: {
        type: String,
        required: true
    }
});

const BankDetails = mongoose.model('BankDetails', BankDetailsSchema);

module.exports = BankDetails;
