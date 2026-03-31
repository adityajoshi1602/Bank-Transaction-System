const mongoose = require('mongoose')

const ledgerschema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'account',
        required: [true, 'ledger must be associated with an account'],
        index: true,
        immutable: true
    },

    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'transaction',
        required: true
    },

    type: {
        type: String,
        enum: ['debit', 'credit'],
        required: true
    },

    amount: {
        type: Number,
        required: true,
        min: [0, 'amount cannot be negative']
    },

}, {
    timestamps: true
})


function preventModification() {
    throw new Error('Modification is not allowed')
}

ledgerschema.pre('findOneAndUpdate', preventModification)
ledgerschema.pre('findOneAndDelete', preventModification)
ledgerschema.pre('findOneAndReplace', preventModification)
ledgerschema.pre('findOneAndRemove', preventModification)
ledgerschema.pre('updateOne', preventModification)
ledgerschema.pre('deleteOne', preventModification)
ledgerschema.pre('remove', preventModification)
ledgerschema.pre('deleteMany', preventModification)
ledgerschema.pre('updateMany', preventModification)


const ledgermodel =mongoose.model('ledger', ledgerschema)

module.exports = ledgermodel