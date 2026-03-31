const express= require('express')
const { authmiddleware } = require('../middlewares/auth.middleware')
const router = express.Router()

router.post('/',authmiddleware)

module.exports= router