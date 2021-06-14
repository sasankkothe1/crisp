const mongoose = require('mongoose');

const BillingInfoSchema = new mongoose.Schema({
    belongsTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    cardNumber: {
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                return /\d{16}/.test(value);
            },
            message: props => `${props.value} is not a valid credit card number!`
        }
    },
    expirationDate: {
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                return /(?:0[1-9]|1[0-2])-202[1-9]/.test(value);
            },
            message: props => `${props.value} is not a valid expiration date!`
        }
    },
    address: {
        type: String
    },
    contactNumber: {
        type: String
    }
});

module.exports = BillingInfoSchema;