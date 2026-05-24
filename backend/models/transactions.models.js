const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    money: {
    type: Number,
    required: true,
    },
    text: {
    type: String,
    required: true,
    },
    category: {
    type: String,
    required: true,
    },
    notes: {
    type: String,
    },
    date: {
    type: Date,
    default: Date.now,
    },
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    },
});

module.exports = mongoose.model('Transaction', transactionSchema);