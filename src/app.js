const express=require('express')
const authrouter= require('./routes/auth.routes')
const accountrouter=require('../src/routes/account.routes')
const cookieParser = require('cookie-parser')
const app = express()

app.use(express.json())
app.use(cookieParser())

app.use('/api/auth',authrouter)

module.exports=app