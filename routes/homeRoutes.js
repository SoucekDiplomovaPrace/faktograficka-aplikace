const express = require('express')
const router = express.Router()

const authService = require('../services/authService')

router.get(['/', '/index'], authService.checkAuthenticated, (_, res) => {
    res.redirect('/quiz/quiz-start')
})

module.exports = router