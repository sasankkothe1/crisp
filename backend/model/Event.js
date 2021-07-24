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
    rating: {
        type: Number,
        default: 0,
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
});

EventSchema.plugin(mongoosePaginate);
const EventModel = mongoose.model("Event", EventSchema);

module.exports = { EventModel };
