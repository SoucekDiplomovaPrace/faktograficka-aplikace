
const express = require('express')
const path = require('path')
const passport = require('passport')
const bodyParser = require("body-parser")
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const initializePassport = require('./configuration/passport-config')

require('./mongo')
require('dotenv').config()

const server = express()

const port = process.env.PORT || 80

server.use(bodyParser.json())
server.use(bodyParser.urlencoded({extended: true}))

// AUTH CONFIGURATION
initializePassport(passport)

server.use(flash())
server.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
server.use(passport.initialize())
server.use(passport.session())
server.use(methodOverride('_method'))

// ROUTES
const authRoutes = require('./routes/authRoutes')
const questionRoutes = require('./routes/questionRoutes')
const homeRoutes = require('./routes/homeRoutes')
const reportRoutes = require('./routes/reportRoutes')

server.use(express.static(path.join(__dirname, 'public')))
server.use('/', homeRoutes)
server.use('/auth', authRoutes)
server.use('/quiz', questionRoutes)
server.use('/report', reportRoutes)

// TEMPLATE ENGINE CONFIGURATION
server.set('view engine', 'ejs')

server.listen(port, () => console.info(`Application listening on port ${port}`));