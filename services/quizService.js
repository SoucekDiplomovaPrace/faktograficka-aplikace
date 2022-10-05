const Answer = require('../models/answer')
const Question = require('../models/question')

const queryTemplate = require('../middleware/questionTemplate')

const fetch = require('node-fetch-commonjs')

const baseUrl1 = 'https://dbpedia.org/sparql'
const baseUrl2 = 'https://query.wikidata.org/sparql'

const produceQA = (queryOption, optionCount) => {

   let query

    switch(queryOption) {
        case 1:
            query = queryTemplate.highestMountainInCountryQuery
            break
        case 2:
            query = queryTemplate.mostPopulousCityCountryQuery
            break
        case 3:
            query = queryTemplate.countryCapitalQuery
            break
        case 4:
            query = queryTemplate.riverMouthQuery
            break
        default:
            break
    }

    let generatedAnswers = sendSparqlRequest(query.getAnswers())

    let chosenAnswers = []
    let counter = optionCount

    while (counter != 0) {
        let item = getRandomItem(generatedAnswers)
        if (!chosenAnswers.includes(item)) {
            chosenAnswers.push(new Answer({
              text: item  
            }))
            counter--
        }
    }

    let questionObject = sendSparqlRequest(query.getQuestionObject(chosenAnswers[0]))
    let completeQuestion

    if (questionObject) {
        chosenAnswers[0].isCorrect = true

        let question = new Question({
            question: questionObject,
            answers: chosenAnswers
        })
        //completeQuestion = question.save()
    }

    return completeQuestion
}

const sendSparqlRequest = async (baseQuery) => {

    const fullUrl = baseUrl1 + '?query=' + encodeURIComponent(baseQuery)
    const headers = { 'Accept': 'application/sparql-results+json' }

    const value =
        await fetch(fullUrl, { headers })
        .then(body => body.json())
        .then(body => body.results.bindings)
        .catch(error => console.log('Error:', error))

    return value
}

const getRandomItem = (array) => {
    
    const randomIndex = Math.floor(Math.random() * array.length)

    const item = array[randomIndex]

    return item
}

module.exports = {
    produceQA
}