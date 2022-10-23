const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const passport = require("passport")

const User = require('../models/user')
const authService = require('../services/authService')
const userService = require('../services/userService')

// Sign in | page
router.get('/signin', (_, res) => {
    res.render('signIn.ejs')
})

// Sign in
router.post("/signin", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/signin"
  })
)

// Sign up | page
router.get('/signup', (_, res) => {
    res.render('signUp.ejs')
})

// Sign up
router.post('/signup', authService.checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        let user = new User({
            'username': req.body.username,
            'password': hashedPassword
        })

        user.save()
        res.redirect('/auth/signin')
    } catch {
        res.redirect('/auth/signup')
    }
})

// Logout
router.delete('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        res.redirect('/auth/signin')
    })
})

router.get('*', authService.checkAuthenticated, async (req, res) => {
    
    let currentUser = await userService.getUserById(req.session.passport.user)
    res.status(404)
    res.render('404.ejs', { username: currentUser.username })
})

module.exports = router