const db = require("./model");

const mongoose = require("mongoose");

// Data is already in the cloud actually

/*
const user = new db.User({
    _id: new mongoose.Types.ObjectId(),
    username: "Grape"
});

user.save().
    then((data) => { 

    const billingInfo = new db.BillingInfo({
        belongsTo: user._id,
        name: "Andrew",
        cardNumber: "1488148814881488",
        expirationDate: "05-2025"
    });

    console.log(billingInfo.validateSync());

    billingInfo.save().then((data) => { }).catch((err) => { if (err) return handleError(err); });
});
*/

const res = db.BillingInfo.findOne({
    cardNumber: "1488148814881488",
})
    .populate("belongsTo")
    .exec(function (err, billingInfo) {
        console.log(billingInfo);
        // Note that belongsTo was just an _id in the schema, but now it's a full-featured User entry.
        console.log(`Andrew is indeed ${billingInfo.belongsTo.username}!`);
    });
