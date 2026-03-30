const express = require('express')
const authmiddlware=require('../middlewares/auth.middleware')
const { createaccount } = require('../controllers/account.controller')
const router = express.Router()


router.post('/',authmiddlware.authmiddleware , createaccount)


module.exports = router