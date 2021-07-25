const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const EventSchema = new mongoose.Schema({
    typeOfPost: {
        type: String,
        required: true,
        default: "event",
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    media: {
        type: [String],
    },
    tags: {
        type: [String],
        default: ["noTags"],
    },
    datePosted: {
        type: Date,
        default: Date.now,
    },
    premiumStatus: {
        type: Boolean,
        default: false,
    },
    eventDate: {
        type: Date,
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    eventLocation: {
        type: String,
        required: true,
    },
    cumulativeRating: {
        type: Number,
        default: 0,
    },
    numRates: {
        type: Number,
        default: 0,
    },
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
});

EventSchema.plugin(mongoosePaginate);

EventSchema.virtual("rating").get(function () {
    if (this.numRates > 0) {
        return this.cumulativeRating / this.numRates;
    } else {
        return 0;
    }
});

const EventModel = mongoose.model("Event", EventSchema);

module.exports = { EventModel };
