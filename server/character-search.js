const igdb = require('../api/igdb-api')

exports.searchCharacter = ( name ) =>{
    return new Promise(function(fulfill, reject){
        igdb.getCharacters({
            fields: '*',
            limit: 10,
            search:name,
            filters: {
                'mug_shot-exists' : ``
            }
        })
        .then(characters=>{
            fulfill(characters)
        })
        .catch(error =>{
            reject(error)
        })
    })
}

