const igdb = require('../api/igdb-api')

exports.matchingCharacter = ( term ) =>{
    return new Promise(function(fulfill, reject){
        igdb.getCharacters({
            fields: '*',
            search: term,
            limit: 10,
            filters: {
                'gender-eq' : `${range(0, 2)}`
            }
        })
        .then(characters=>{
            return 1
        })
        .catch(error =>{
            reject(error)
        })
    })
}