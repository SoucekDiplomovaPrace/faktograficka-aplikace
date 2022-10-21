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
        incorrectlyAnsweredCount: incorrectlyAnswered.length
    })
})


router.get('/questions-overview', async (req, res) => {

    let questions = await quizService.getAllQuestions()
    let questionsCount = questions.length
    console.log(questions)
    let currentUser = await userService.getUserById(req.session.passport.user)
    res.render('questionsOverview.ejs', {
        username: currentUser.username,
        questions: questions,
        questionsCount: questionsCount
    })
})

module.exports = router