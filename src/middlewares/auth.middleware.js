const usermodel = require('../models/user.model')
const jwt = require('jsonwebtoken')

async function authmiddleware(req, res, next) {
    try {
        const token =
            req.cookies?.token ||
            req.headers.authorization?.split(' ')[1]

        if (!token) {
            return res.status(401).json({
                message: 'Unauthorized: No token provided'
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await usermodel.findById(decoded.id)

        if (!user) {
            return res.status(401).json({
                message: 'Unauthorized: User not found'
            })
        }

        req.user = user
        next()
    } catch (err) {
        return res.status(401).json({
            message: 'Unauthorized: Invalid token'
        })
    }
}

module.exports = {authmiddleware}