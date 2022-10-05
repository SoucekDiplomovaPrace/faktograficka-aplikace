const prefix = () => {
    let prefixes = 
        `PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX dbr: <http://dbpedia.org/resource/>
        PREFIX dbp: <http://dbpedia.org/property/>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>`
    return prefixes    
}

// 1. option OK
const highestMountainInCountryQuery = {
    getQuestionObject(country) {
        let query = 
            `${prefix()}
            SELECT ?value WHERE {
                dbr:List_of_elevation_extremes_by_country dbo:wikiPageWikiLink ?mountain.
                ?mountain dbo:locatedInArea dbr:${country};
                        dbo:elevation ?height;
                        rdfs:label ?value.
                FILTER(langMatches(lang(?value), "EN"))
            } ORDER BY DESC(?height) LIMIT 1`

        return query    
    },
    getAnswers() {
        let query =
            `${prefix()}
            SELECT distinct ?country WHERE {
                ?item foaf:name ?country.
                ?item dbo:countryCode ?p.              
                FILTER(langMatches(lang(?country), "EN"))
            }`

            return query;
    }
}

// 2. option
const mostPopulousCityCountryQuery = {
    getQuestionObject() {
        let query =
            `${prefix()}
            SELECT ?value WHERE {
                ?city a dbo:City;
                    dbo:country dbr:${country};
                    dbo:populationTotal ?population;
                    rdfs:label ?value.
                FILTER(langMatches(lang(?value), "EN"))
            } ORDER BY DESC(?population)`

        return query;
    },
    getAnswers() {
        let query =
            `${prefix()}
            SELECT distinct ?country WHERE {
                ?item foaf:name ?country.
                ?item dbo:countryCode ?p.              
                FILTER(langMatches(lang(?country), "EN"))
            }`

            return query;
    }
}

// 3. option OK
const countryCapitalQuery = {
    getQuestionObject(country) {
        let query =
            `${prefix()} 
            SELECT ?value WHERE {
                dbr:${country} dbo:capital ?city.
                ?city foaf:name ?value.
                FILTER(langMatches(lang(?value), "EN"))
            }`

        return query;
    },
    getAnswers() {
        let query =
            `${prefix()}
            SELECT distinct ?country WHERE {
                ?item foaf:name ?country.
                ?item dbo:countryCode ?p.              
                FILTER(langMatches(lang(?country), "EN"))
            }`

            return query;
    }

}

// 4. option
const riverMouthQuery = {
    getAnswers(river) {
        let query =
            `${prefix()}
            SELECT ?mouth WHERE {
                dbr:${river} dbo:riverMouth ?mouth.
            }`

        return query
    },
    getQuestionObject() {
        let query = 
            `${prefix}
            SELECT ?river WHERE {
                ?river rdf:type dbo:River.
            }`

        return query
    }
}

module.exports = {
    riverMouthQuery,
    countryCapitalQuery,
    highestMountainInCountryQuery,
    mostPopulousCityCountryQuery
}