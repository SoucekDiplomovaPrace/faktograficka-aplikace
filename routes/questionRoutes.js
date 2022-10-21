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

    let randomQuestions = await quizService.getRandomQuestions(option, count)

    if (randomQuestions.length === count) {
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

        let currentUser = await userService.getUserById(req.session.passport.user)

        res.render('confirmStart.ejs', { username: currentUser.username, quiz: questionsDTO, length: randomQuestions.length })
    } else {
        req.flash('warning', 'Pro navolené volby není vygenerován dostatek otázek!')
        res.redirect('/quiz/quiz-start')
    }
})

router.get('/quiz', authService.checkAuthenticated, async (req, res) => {
    let currentUser = await userService.getUserById(req.session.passport.user)
    res.render('question.ejs', { username: currentUser.username})
})

router.post('/processQuiz', authService.checkAuthenticated, async (req, res) => {


    let quizData = []

    let currentUser = await userService.getUserById(req.session.passport.user)

    req.body.forEach(item => {
        let answer = item.answers.find(item => item.pointed === true)
        if (answer) {

            let userQuestion = new UserQuestion ({
                takenBy: currentUser.id,
                question: item.id,
                choosenAnswer: answer ? answer.id : null
            })
            quizData.push(userQuestion)

            UserQuestion.collection.insertMany(quizData)
        }
    })

    res.send('/quiz/configuration')
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