const express = require('express')
const userService = require('../services/userService')
const quizService = require('../services/quizService')
const router = express.Router()

router.get('/taken-questions-user', async (req, res) => {

    let takenQuestions = await quizService.getQuizQuestionsByUser(req.session.passport.user)
    let takenQuestionsCount = takenQuestions.length

    let correctlyAnswered = takenQuestions.filter(item => item.choosenAnswer.isCorrect)
    let incorrectlyAnswered = takenQuestions.filter(item => !item.choosenAnswer.isCorrect)

    let currentUser = await userService.getUserById(req.session.passport.user)
    res.render('allTakenQuestionsByUser.ejs', {
        username: currentUser.username,
        takenQuestions: takenQuestions,
        takenQuestionsCount: takenQuestionsCount,
        correctlyAnsweredCount: correctlyAnswered.length,
        incorrectlyAnsweredCount: incorrectlyAnswered.length}
    )
})

module.exports = router