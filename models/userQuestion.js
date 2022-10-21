const mongoose = require('mongoose')

const Question = require('./question')
const Answer = require('./answer')
const User = require('./user')

const userQuestionSchema = mongoose.Schema({
    taken: {
        type: Date,
        default: Date.now
    },
    takenBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: User
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: Question 
    },
    choosenAnswer: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: Answer
    }
})

const UserQuestion = mongoose.model('UserQuiz', userQuestionSchema)

module.exports = UserQuestion