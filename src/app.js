const express = require('express')
const authrouter = require('./routes/auth.routes')
const accountrouter = require('./routes/account.routes')
const transactionrouter = require('./routes/transaction.routes')
const cookieParser = require('cookie-parser')

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authrouter)
app.use('/api/account', accountrouter)
app.use('/api/transaction', transactionrouter)

module.exports = app