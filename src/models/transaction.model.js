const mongoose = require('mongoose')

const transactionschema = new mongoose.Schema({
    fromaccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'account',
        required: [true, 'transaction must be associated with a from account'],
        index: true
    },
    toaccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'account',
        required: [true, 'transaction must be associated with a to account'],
        index: true
    },
    status: {
        type: String,
        enum: {
            values: ['pending', 'completed', 'failed', 'reversed'],
            message: 'status must be pending, completed, failed or reversed'
        },
        default: 'pending'
    },
    amount: {
        type: Number,
        required: [true, 'amount is required for transaction'],
        min: [0, 'transaction cannot be negative']
    },
    idempotencykey: {
        type: String,
        required: [true, 'idempotency key is required for transaction'],
        index: true,
        unique: true
    }
}, {
    timestamps: true
})

const transactionmodel = mongoose.model('transaction', transactionschema)

module.exports = transactionmodel