const transactionmodel = require("../models/transaction.model")
const ledgermodel = require("../models/ledger.model")
const accountmodel = require("../models/account.model")
const emailservice = require("../services/email.service")
const mongoose = require("mongoose")

async function createtransaction(req, res) {

    const { fromaccount, toaccount, amount, idempotencykey } = req.body

    if (!fromaccount || !toaccount || !amount || !idempotencykey) {
        return res.status(400).json({
            message: "fromaccount, toaccount, amount and idempotencykey are required"
        })
    }

    const fromuseraccount = await accountmodel.findOne({
        _id: fromaccount,
    })

    const touseraccount = await accountmodel.findOne({
        _id: toaccount,
    })

    if (!fromuseraccount || !touseraccount) {
        return res.status(400).json({
            message: "Invalid fromaccount or toaccount"
        })
    }

    const istransactionalreadyexists = await transactionmodel.findOne({
        idempotencykey: idempotencykey
    })

    if (istransactionalreadyexists) {
        if (istransactionalreadyexists.status === "completed") {
            return res.status(200).json({
                message: "Transaction already processed",
                transaction: istransactionalreadyexists
            })
        }

        if (istransactionalreadyexists.status === "pending") {
            return res.status(200).json({
                message: "Transaction is still processing",
            })
        }

        if (istransactionalreadyexists.status === "failed") {
            return res.status(500).json({
                message: "Transaction processing failed, please retry"
            })
        }

        if (istransactionalreadyexists.status === "reversed") {
            return res.status(500).json({
                message: "Transaction was reversed, please retry"
            })
        }
    }

    if (fromuseraccount.status !== "active" || touseraccount.status !== "active") {
        return res.status(400).json({
            message: "Both fromaccount and toaccount must be ACTIVE to process transaction"
        })
    }

    const balance = await fromuseraccount.getbalance()

    if (balance < amount) {
        return res.status(400).json({
            message: `Insufficient balance. Current balance is ${balance}. Requested amount is ${amount}`
        })
    }

    let transaction;
    try {

        const session = await mongoose.startSession()
        session.startTransaction()

        transaction = (await transactionmodel.create([{
            fromaccount,
            toaccount,
            amount,
            idempotencykey,
            status: "pending"
        }], { session }))[0]

        await ledgermodel.create([{
            account: fromaccount,
            amount: amount,
            transaction: transaction._id,
            type: "debit"
        }], { session })

        await (() => {
            return new Promise((resolve) => setTimeout(resolve, 15 * 1000));
        })()

        await ledgermodel.create([{
            account: toaccount,
            amount: amount,
            transaction: transaction._id,
            type: "credit"
        }], { session })

        await transactionmodel.findOneAndUpdate(
            { _id: transaction._id },
            { status: "completed" },
            { session }
        )

        await session.commitTransaction()
        session.endSession()
    } catch (error) {
        return res.status(400).json({
            message: "Transaction is Pending due to some issue, please retry after sometime",
        })
    }

    await emailservice.sendTransactionEmail(req.user.email, req.user.name, amount, toaccount)

    return res.status(201).json({
        message: "Transaction completed successfully",
        transaction: transaction
    })
}

async function createinitialfunds(req, res) {
    const { toaccount, amount, idempotencykey } = req.body

    if (!toaccount || !amount || !idempotencykey) {
        return res.status(400).json({
            message: "toaccount, amount and idempotencykey are required"
        })
    }

    const touseraccount = await accountmodel.findOne({
        _id: toaccount,
    })

    if (!touseraccount) {
        return res.status(400).json({
            message: "Invalid toaccount"
        })
    }

    const fromuseraccount = await accountmodel.findOne({
        user: req.user._id
    })

    if (!fromuseraccount) {
        return res.status(400).json({
            message: "System user account not found"
        })
    }

    const session = await mongoose.startSession()
    session.startTransaction()

    const transaction = new transactionmodel({
        fromaccount: fromuseraccount._id,
        toaccount,
        amount,
        idempotencykey,
        status: "pending"
    })

    await ledgermodel.create([{
        account: fromuseraccount._id,
        amount: amount,
        transaction: transaction._id,
        type: "debit"
    }], { session })

    await ledgermodel.create([{
        account: toaccount,
        amount: amount,
        transaction: transaction._id,
        type: "credit"
    }], { session })

    transaction.status = "completed"
    await transaction.save({ session })

    await session.commitTransaction()
    session.endSession()

    return res.status(201).json({
        message: "Initial funds transaction completed successfully",
        transaction: transaction
    })
}



module.exports = {
    createtransaction,
    createinitialfunds
}