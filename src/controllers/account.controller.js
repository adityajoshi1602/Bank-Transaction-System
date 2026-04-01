const accountmodel = require('../models/account.model')

async function createaccount(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: 'Unauthorized'
            })
        }

        const existing = await accountmodel.findOne({ user: req.user._id })

        if (existing) {
            return res.status(400).json({
                message: 'Account already exists'
            })
        }

        const account = await accountmodel.create({
            user: req.user._id
        })

        res.status(201).json({
            message: 'Account created',
            account
        })

    } catch (err) {
        res.status(500).json({
            message: 'Server error',
            error: err.message
        })
    }
}


async function getuseraccount(req,res){

    const accounts = await accountmodel.findOne({
        user:req.user._id
    })

    res.status(201).json({
        accounts
    })
}

async function getaccountbalance(req, res) {
    const account = await accountmodel.findOne({
        user: req.user._id
    })

    if (!account) {
        return res.status(404).json({
            message: 'Account not Found!'
        })
    }

    const balance = await account.getbalance()

    return res.json({ balance })
}

module.exports = { createaccount,getuseraccount, getaccountbalance }