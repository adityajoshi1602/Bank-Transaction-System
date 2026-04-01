const express = require('express')
const authmiddlware = require('../middlewares/auth.middleware')
const { createaccount, getuseraccount, getaccountbalance } = require('../controllers/account.controller')
const router = express.Router()


router.post('/', authmiddlware.authmiddleware, createaccount)

router.get('/getbalance/:id', authmiddlware.authmiddleware, getaccountbalance)
router.get('/getaccount', authmiddlware.authmiddleware, getuseraccount)


module.exports = router