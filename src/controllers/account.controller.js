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

module.exports = { createaccount }