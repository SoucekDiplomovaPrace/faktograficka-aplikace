const mongoose = require('mongoose')

const Answer = require('./answer')
const User = require('./user')

const questionSchema = mongoose.Schema({
    generated: {
        type: Date,
        default: Date.now
    },
    question: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: Number,
        required: true
    },
    answers: [{
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: Answer
    }]
})

const Question = mongoose.model('Question', questionSchema)

module.exports = Question