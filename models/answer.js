const mongoose = require('mongoose')

const answerSchema = mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },
    isCorrect: {
        type: Boolean,
        default: false
    },
    isValid: {
        type: Boolean,
        default: true
    }
})

const Answer = mongoose.model('Answer', answerSchema)

module.exports = Answer