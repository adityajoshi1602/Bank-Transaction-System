const express= require('express')
const { authmiddleware } = require('../middlewares/auth.middleware')
const transactioncontroller = require('../controllers/transaction.controller')
const router = express.Router()

router.post('/',authmiddleware, transactioncontroller.createtransaction)

module.exports= router