const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    media: {
        type: [String]
    },
    tags: {
        type: [String],
        default: ["noTags"]
    },
    datePosted: {
        type: Date,
        default: Date.now
    },
    premiumStatus: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    eventLocation: {
        type: String,
        required: true
    }
});

const EventModel = mongoose.model('Event', EventSchema);

module.exports = { EventModel };