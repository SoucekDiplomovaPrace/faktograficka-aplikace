
const express = require('express')
const path = require('path')
const passport = require('passport')
const bodyParser = require("body-parser")
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const initializePassport = require('./configuration/passport-config')

const User = require('./models/user')
require('./mongo')
require('dotenv').config()

const server = express()

const port = 8080

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
//const userRoutes = require('./routes/user')

server.use(express.static(path.join(__dirname, 'public')))
server.use('/', authRoutes)
server.use('/quiz', questionRoutes)
//server.use('/users', userRoutes);

// TEMPLATE ENGINE CONFIGURATION
server.set('view engine', 'ejs')


server.listen(port, () => console.info(`Application listening on port ${port}`));