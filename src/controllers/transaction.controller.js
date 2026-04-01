const transactionmodel = require('../models/transaction.model')
const ledgermodel = require('../models/ledger.model')
const emailservice = require('../services/email.service')
const accountmodel = require('../models/account.model')
const mongoose = require('mongoose')

async function createtransaction(req, res) {

    const { fromaccount, toaccount, idempotencykey, amount } = req.body;

    if (!fromaccount || !toaccount || !idempotencykey || !amount) {
        return res.status(400).json({
            message: 'fromaccount, toaccount, idempotencykey and amount are required'
        })
    }

    const fromAccount = await accountmodel.findById(fromaccount)
    const toAccount = await accountmodel.findById(toaccount)

    if (!fromAccount || !toAccount) {
        return res.status(404).json({
            message: 'Invalid fromaccount or toaccount'
        })
    }

    const existingTransaction = await transactionmodel.findOne({
        idempotencykey: idempotencykey
    })

    if (existingTransaction) {

        if (existingTransaction.status === 'completed') {
            return res.status(200).json({
                message: 'Transaction already completed',
                transaction: existingTransaction
            })
        }

        if (existingTransaction.status === 'reversed') {
            return res.status(400).json({
                message: 'Transaction was reversed, please retry',
                transaction: existingTransaction
            })
        }

        return res.status(400).json({
            message: `Transaction already ${existingTransaction.status}`,
            transaction: existingTransaction
        })
    }

    if (fromAccount.status !== 'active' || toAccount.status !== 'active') {
        return res.status(400).json({
            message: 'Both accounts must be active'
        })
    }

    const balance = await fromAccount.getbalance();

    if (balance < amount) {
        throw new Error('Insufficient balance');
    }

    const session = await mongoose.startSession()
    session.startTransaction()

    const transaction = await transactionmodel.create([{
        fromaccount,
        toaccount,
        amount,
        idempotencykey,
        status: 'pending'
    }], { session });

    const debitledgerentry = await ledgermodel.create({
        account: fromaccount,
        type: 'debit',
        amount,
        transaction: transaction[0]._id
    }, { session })

    const creditledgerentry = await ledgermodel.create({
        account: toaccount,
        type: 'credit',
        amount,
        transaction: transaction[0]._id
    }, { session })

    transaction.status = 'completed'
    await transaction.save({session})

    await session.commitTransaction()
    session.endSession()

    await emailservice.sendTransactionEmail(req.user.email,req.user.name,amount,toAccount)

    return res.status(201).json({
        message:'Transaction Completed Successfully',
        transaction:transaction
    })
}

module.exports= {createtransaction}