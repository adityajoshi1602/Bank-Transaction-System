const mongoose = require('mongoose')

const accountschema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'account must be associated with a user'],
        index: true
    },
    status: {
        type: String,
        enum: {
            values: ['active', 'frozen', 'closed'],
            message: 'status can be active, frozen or closed'
        },
        default: 'active'
    },
    currency: {
        type: String,
        required: [true, 'currency is required for creating account'],
        default: 'USD'
    }
}, {
    timestamps: true
})

accountschema.index({ user: 1, status: 1 })

const accountmodel = mongoose.model('account', accountschema)

module.exports = accountmodel