const mongoose = require('mongoose');

const trackingHistorySchema = new mongoose.Schema({
    trackingNumber: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('TrackingHistory', trackingHistorySchema);
