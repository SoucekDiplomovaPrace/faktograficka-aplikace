const QuestionTypes = {
    ChooseBest: Symbol ('ChooseBest'),
    ChooseTruth: Symbol('ChooseTruth'),
    ChooseNumber: Symbol('ChooseNumber')
}

const prefix = () => {
    let prefixes = 
        `PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX dbr: <http://dbpedia.org/resource/>
        PREFIX dbp: <http://dbpedia.org/property/>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>`
    return prefixes    
}

// 1. option
const mostPopulousCityCountryQuery = {
    getType() {
        return QuestionTypes.ChooseTruth
    },

    getQuestionText(object) {
        return `Do kterého státu patří město ${object}?`
    },

    getQuestionObject(country) {
        let query =
            `${prefix()}
            SELECT ?object WHERE {
                ?city a dbo:City;
                      dbo:country dbr:${country};
                      rdfs:label ?object.
                FILTER(langMatches(lang(?object), "EN"))
            }`

        return query;
    },
    getAnswers() {
        let query =
            `${prefix()}
            SELECT DISTINCT ?object
            WHERE { 
                ?country dbp:commonName ?object;
                         rdf:type dbo:Country.
                FILTER(langMatches(lang(?object), "EN"))
            }`

        return query;
    }
}

// 2. option OK
const countryCapitalQuery = {

    getType() {
        return QuestionTypes.ChooseTruth
    },
    getQuestionText(object) {
        return `Město ${object} je hlavním městem:`
    },
    getQuestionObject(country) {
        let query =
            `${prefix()} 
            SELECT ?object WHERE {
                dbr:${country} dbo:capital ?city.
                ?city foaf:name ?object.
                FILTER(langMatches(lang(?object), "EN"))
            } LIMIT 1`

        return query
    },
    getAnswers() {
        let query =
            `${prefix()}
            SELECT DISTINCT ?object
            WHERE { 
                ?country dbp:commonName ?object;
                         rdf:type dbo:Country.
                FILTER(langMatches(lang(?object), "EN") && datatype(?object) = xsd:string)
            }`

        return query
    }
}

// 3
const highestMountainQuery = {

    getType() {
        return QuestionTypes.ChooseBest
    },
    getQuestionText() {
        return 'Která z těchto hor je nejvyšší?'
    },
    getAnswers() {
        let query = 
            `${prefix()} 
            SELECT ?object ?value WHERE { 
                ?mountain rdf:type dbo:Mountain;
                            dbo:alternativeName ?object;
                            dbo:elevation ?value.
                FILTER(langMatches(lang(?object), "EN"))  
            }`
        return query
    }
}

// 4
const biggestCountryQuery = {
    getType() {
        return QuestionTypes.ChooseBest
    },
    getQuestionText() {
        return 'Který ze států je rozlohou největší?'
    },
    getAnswers() {
        let query = 
            `${prefix()} 
            SELECT ?object ?value
            WHERE { 
                ?country dbp:commonName ?object;
                         rdf:type dbo:Country;
                         dbp:areaKm ?value.
                FILTER(langMatches(lang(?object), "EN") && datatype(?value) = xsd:integer)
            }`
        return query    
    }
}

// 5. option
const countryOfficialLangsCountQuery = {
    getType() {
        return QuestionTypes.ChooseNumber
    },
    getQuestionText(country) {
        return `Kolik úředních jazyků je ustanoveno v ${country}?`
    },
    getAnswers() {
        let query =
            `${prefix()}
            SELECT ?object (COUNT(?lang)) AS ?value
            WHERE {
                ?country dbo:officialLanguage ?lang;
                         dbp:conventionalLongName ?object;
                         rdf:type dbo:Country.
                FILTER(langMatches(lang(?object), "EN")).
            } 
            GROUP BY ?object
            HAVING (COUNT(*) > 1) 

            `
        return query    
    }

}

// 6. option
const firstEstablishedYearCountryQuery = {
    getType() {
        return QuestionTypes.ChooseNumber
    },
    getQuestionText(country) {
        return `Ve kterém roce byla první zmínka o ${country}?`
    },
    getAnswers() {
        let query =
            `${prefix()}
            SELECT ?object year(min(?date)) as ?value
            WHERE {
                ?country rdf:type dbo:Country;
                         dbp:establishedDate ?date;
                         foaf:name ?object.
                FILTER(langMatches(lang(?object), "EN") && datatype(?date) = xsd:date)
            } GROUP BY (?object)
            `
        return query
    }
}

module.exports = {
    QuestionTypes,
    countryCapitalQuery,
    mostPopulousCityCountryQuery,
    highestMountainQuery,
    biggestCountryQuery,
    countryOfficialLangsCountQuery,
    firstEstablishedYearCountryQuery
}