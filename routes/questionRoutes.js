const express = require('express')
const quizGeneratingService = require('../services/quizGeneratingService')
const quizService = require('../services/quizService')
const authService = require('../services/authService')
const userService = require('../services/userService')
const messageService = require('../services/messageService')
const UserQuestion = require('../models/userQuestion')
const router = express.Router()

router.get('/quiz-start', authService.checkAuthenticated, async (req, res) => {

    let message = messageService.getMessage(req)
    let currentUser = await userService.getUserById(req.session.passport.user)
    res.render('quizStart.ejs', { username: currentUser.username, message: message })
})

router.post('/quiz-start', authService.checkAuthenticated, async (req, res) => {
    let option = req.body.questionType
    let count = req.body.questionsCount

    let questions = []

    if (parseInt(option) > 0) {
        questions = await quizService.getAllQuestionsByType(option)
    } else if (parseInt(option) === -9999) {
        questions = await quizService.getAllQuestions()
    }
    if (questions.length > 0 && questions.length >= parseInt(count)) {
        
        let randomQuestions = await quizService.getRandomQuestions(questions, count)
        let questionsDTO = randomQuestions.map((item1) => {
            return {
                id: item1.id,
                question: item1.question,
                answers: item1.answers.map((item2) => {
                    return {
                        id: item2.id,
                        text: item2.text,
                        pointed: false
                    }
                })
            }
        })
        res.send({quiz: questionsDTO, length: randomQuestions.length})
    } else {
        res.send({quiz: [], length: 0})
    }

})

router.get('/quiz', authService.checkAuthenticated, async (req, res) => {
    let currentUser = await userService.getUserById(req.session.passport.user)
    res.render('question.ejs', { username: currentUser.username})
})

router.post('/processQuiz', authService.checkAuthenticated, async (req, res) => {
    
    let quizData = []
    let currentUser = await userService.getUserById(req.session.passport.user)
    let quizTimestamp = Date.now()
    req.body.forEach(item => {
        let answer = item.answers.find(item => item.pointed === true)
        if (answer) {

            let userQuestion = new UserQuestion ({
                takenBy: currentUser.id,
                taken: quizTimestamp,
                timestamp: quizTimestamp.valueOf(),
                question: item.id,
                choosenAnswer: answer ? answer.id : null
            })
            quizData.push(userQuestion)
        }
    })
    
    UserQuestion.collection.insertMany(quizData)

    res.send({url: `/quiz/quiz-evaluation/${quizTimestamp}`})
})

router.get('/quiz-evaluation/:timestamp', authService.checkAuthenticated, async (req, res) => {
    let currentUser = await userService.getUserById(req.session.passport.user)
    let lastQuiz = await quizService.getLastQuizByUser(req.session.passport.user, req.params.timestamp)
    let correctlyAnsweredCount = lastQuiz.filter(q => q.choosenAnswer.isCorrect).length
    let incorrectlyAnsweredCount = lastQuiz.filter(q => !q.choosenAnswer.isCorrect).length

    res.render('quizEvaluation.ejs', {
        username: currentUser.username,
        answeredQuestions: lastQuiz,
        correctlyAnsweredCount: correctlyAnsweredCount,
        incorrectlyAnsweredCount: incorrectlyAnsweredCount
    })
})

router.post('/generate', authService.checkAuthenticated, async (req, res) => {
    let question = req.body.questionType
    let questionsCount = req.body.questionsCount

    try {
        let generate = await quizGeneratingService.init(question, questionsCount)
        
        if (generate) {
            req.flash('warning', 'Něco se nepovedlo!')
        } else {
            req.flash('success', 'Generování proběhlo v pořádku!')
        }
    } catch (err) {
        let message =
            `Vznikl problém při generování dat. Překontrolujte prosím dostupnost serveru a správnost připojovací údajů. Error: ${err}`
        req.flash('error', message)
    }

    res.redirect('/quiz/configuration')

})

router.get('/configuration', async (req, res) => {

    let message = messageService.getMessage(req)
    
    let currentUser = await userService.getUserById(req.session.passport.user)
    res.render('configuration.ejs', { username: currentUser.username, message: message })
})


router.get('*', authService.checkAuthenticated, async (req, res) => {
    
    let currentUser = await userService.getUserById(req.session.passport.user)
    res.status(404)
    res.render('404.ejs', { username: currentUser.username })
})

module.exports = router