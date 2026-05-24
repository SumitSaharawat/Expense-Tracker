const mongoose = require('mongoose');

const goalsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },amount: {
        type: Number,
        required: true,
    },saved: {
        type: Number,
        default: 0,
    },note: {
        type: String,
    },date: {
        type: Date,
        default: Date.now,
    },user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

module.exports = mongoose.model('Goal', goalsSchema);