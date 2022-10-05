const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const passport = require("passport")

const User = require('../models/user')
const authService = require('../services/authService')

router.get(['/', '/index'], authService.checkAuthenticated, (_, res) => {
    res.redirect('/quiz/quiz-start')
})

// Sign in | page
router.get('/signin', (_, res) => {
    res.render('signIn.ejs')
})

// Sign in
router.post("/signin", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/signin"
  })
  )

// Sign up | page
router.get('/signup', (_, res) => {
    res.render('signUp.ejs')
})

// Sign up
router.post('/signup', authService.checkNotAuthenticated, async (req, res) => {
    try {
        console.log(req.body.password)
        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        let user = new User({
            'username': req.body.username,
            'password': hashedPassword
        })
        console.log(user)
        user.save()
        res.redirect('/signin')
    } catch {
        res.redirect('/signup')
    }
})

// Logout
router.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/signup')
})

module.exports = router;