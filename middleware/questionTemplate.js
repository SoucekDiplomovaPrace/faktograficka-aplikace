const QuestionTypes = {
    ChooseBest: Symbol ('ChooseBest'),
    ChooseTruth: Symbol('ChooseTruth')
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
    getQuestionObject(country) {
        let query =
            `${prefix()}
            SELECT ?object WHERE {
                ?city a dbo:City;
                    dbo:country dbr:${country};
                    dbo:populationTotal ?population;
                    rdfs:label ?object.
                FILTER(langMatches(lang(?object), "EN"))
            } ORDER BY DESC(?population)`

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
                FILTER(langMatches(lang(?object), "EN"))
            }`

        return query
    }
}

// 3
const highestMountainQuery = {

    getType() {
        return QuestionTypes.ChooseBest
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
    getAnswers() {
        let query = 
            `${prefix()} 
            SELECT ?object ?value
            WHERE { 
                ?country dbp:commonName ?object;
                         rdf:type dbo:Country;
                         dbp:areaKm ?value.
                FILTER(langMatches(lang(?object), "EN"))
            }`
        return query    
    }
}


module.exports = {
    QuestionTypes,
    countryCapitalQuery,
    mostPopulousCityCountryQuery,
    highestMountainQuery,
    biggestCountryQuery
}