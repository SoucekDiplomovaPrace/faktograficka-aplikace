const express = require('express');
const quizService = require('../services/quizService')
const authService = require('../services/authService')
const router = express.Router()

router.get('/quiz-start', authService.checkAuthenticated, (_, res) => {
    res.render('quizStart.ejs')
})

router.post('/generate', authService.checkAuthenticated, (_, res) => {
    setTimeout(() => {
        res.render('question.ejs')
   }, 5000);
       
})

module.exports = router