const Answer = require('../models/answer')
const Question = require('../models/question')

const queryTemplate = require('../utils/questionTemplate')

const fetch = require('node-fetch-commonjs')

const baseUrl1 = 'https://dbpedia.org/sparql'
const baseUrl2 = 'https://query.wikidata.org/sparql'

const init = async (queryOptions, questionsCountPerOption) => {


    for (let option of queryOptions) {

        let itr = 0

        while (itr < questionsCountPerOption) {
            let object = await produceQA(option)
            if (object) {
                itr++
            }
        }
    }
}

const produceQA = async (queryOption) => {

    let query

    switch(parseInt(queryOption)) {
        case 1:
            query = queryTemplate.mostPopulousCityCountryQuery
            break
        case 2:
            query = queryTemplate.countryCapitalQuery
            break
        case 3:
            query = queryTemplate.highestMountainQuery
            break
        case 4:
            query = queryTemplate.biggestCountryQuery

    }

    let generatedAnswers = await sendSparqlRequest(query.getAnswers())
    let chosenAnswers = []
    let counter = 4

    if (query.getType() === queryTemplate.QuestionTypes.ChooseTruth) {
        let questionObject

        while (counter != 0) {
            let item = getRandomItem(generatedAnswers, false)
            if (!chosenAnswers.includes(item)) {
                chosenAnswers.push(new Answer({
                  text: item  
                }))
                counter--
            }
        }

        for (let i = 0; i < 4; i++) {
            let searchedText = chosenAnswers[i].text.replace(/\s/g, '_')
            questionObject = await sendSparqlRequest(query.getQuestionObject(searchedText))

            if (questionObject) {
                chosenAnswers[i].isCorrect = true
                break
            }
            questionObject = null
        }

        chosenAnswers = chosenAnswers.sort((a, b) => 0.5 - Math.random());

        if (questionObject && questionObject.length > 0) {
            
            await Answer.collection.insertMany(chosenAnswers)

            let answersIds = []
            answersIds = chosenAnswers.map(c => c.id)
            let question = new Question({
                question: query.getQuestionText(questionObject[0].object.value),
                type: queryOption,
                answers: answersIds
            })
            
            question.save()
        } else {
            return
        }

        return questionObject
    } else if (query.getType() === queryTemplate.QuestionTypes.ChooseBest) {
        
        let tempArray = []
        for (let i = 0; i < 4; i++) {
            let item = getRandomItem(generatedAnswers, true)
            tempArray.push(item)
        }
        
        tempArray.sort((i, j) => j.value.value - i.value.value)
        chosenAnswers = []
        chosenAnswers = tempArray.map(item => new Answer({text: item.object.value}))
        chosenAnswers[0].isCorrect = true

        await Answer.collection.insertMany(chosenAnswers)
        
        let answersIds = []
        answersIds = chosenAnswers.map(c => c.id)
        
        let question = new Question({
            question: query.getQuestionText(),
            type: queryOption,
            answers: answersIds
        })
        question.save()
        return answersIds.length > 0
    }
}

const sendSparqlRequest = async (baseQuery) => {
    // nutne navracet objekt pod nazvem "value" ze sparql dotazu -> jednotnost pro vicero typu dotazu
    const fullUrl = baseUrl1 + '?query=' + encodeURIComponent(baseQuery)
    const headers = { 'Accept': 'application/sparql-results+json' }

    let result = await fetch(fullUrl, { headers })
    if (result) {
        let data
        try {
          data = await result.json()
        } catch {
            return
        }
         return data.results.bindings
    }

    return
}

const getRandomItem = (array, wholeObject) => {
    
    const randomIndex = Math.floor(Math.random() * array.length)

    const item = array[randomIndex]
    if (wholeObject)
        return item

    return item.object.value
}

module.exports = {
    init
}