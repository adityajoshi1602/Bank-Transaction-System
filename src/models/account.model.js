const mongoose = require('mongoose')
const ledgermodel = require('./ledger.model')

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

accountschema.methods.getbalance = async function () {
    const balancedata = await ledgermodel.aggregate([
        { $match: { account: this._id } },
        {
            $group: {
                _id: null,
                totaldebit: {
                    $sum: {
                        $cond: [
                            { $eq: ['$type', 'debit'] },
                            '$amount',
                            0
                        ]
                    }
                },
                totalcredit: {
                    $sum: {
                        $cond: [
                            { $eq: ['$type', 'credit'] },
                            '$amount',
                            0
                        ]
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                balance: {
                    $subtract: ['$totalcredit', '$totaldebit']
                }
            }
        }
    ])

    return balancedata[0]?.balance || 0;
}

accountschema.index({ user: 1, status: 1 })

const accountmodel = mongoose.model('account', accountschema)

module.exports = accountmodel