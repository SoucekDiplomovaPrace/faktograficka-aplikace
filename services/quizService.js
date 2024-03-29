const Question = require('../models/question')
const UserQuestion = require('../models/userQuestion')

const getRandomQuestions = async (array, count) => {
    let randomQuestions = []

    let iter = 0

    while (iter < count) {
        let random = Math.floor(Math.random() * array.length)


        if (!randomQuestions.includes(array[random])) {
            randomQuestions.push(array[random])
            iter++
        }
    }
    return randomQuestions
}

const getQuizQuestionsByUser = (userId) => {
    return UserQuestion.find({takenBy: userId}).populate({path: 'question', populate: {path: 'answers'}}).populate('choosenAnswer')
}

const getAllQuestions = () => {
    return Question.find().populate('answers')
}

const getLastQuizByUser = (userId, timestamp) => {
    let questions = UserQuestion.find({takenBy: userId, taken: timestamp}).sort({taken: 'desc'}).populate({path: 'question', populate: {path: 'answers'}}).populate('choosenAnswer')



    return questions
}

const getAllQuestionsByType = (option) => {
    return Question.find({type: option}).populate('answers')
}

module.exports = {
    getRandomQuestions,
    getLastQuizByUser,
    getAllQuestionsByType,
    getAllQuestions,
    getQuizQuestionsByUser
}