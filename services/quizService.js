const { support } = require('jquery')
const Question = require('../models/question')
const UserQuestion = require('../models/userQuestion')

const getRandomQuestions = async (option, count) => {

    let randomQuestions = []

    let collectionCount = await Question.find({type: option}).count()

    for (let i = 0; i < count; i++) {

        let random = Math.floor(Math.random() * collectionCount)

        randomQuestions.push(await Question.findOne({type: option}).populate('answers').skip(random))
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


module.exports = {
    getRandomQuestions,
    getLastQuizByUser,
    getAllQuestions,
    getQuizQuestionsByUser
}