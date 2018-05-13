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
            let chars = []
            characters.forEach( (character, i) => {
                //assign random ratings 
                character.rating = range(0, 5)

                //assign random votes
                character.votes = range(0, 2425)
                if(character.games){
                    igdb.getGameWrapper({
                        fields: ['id', 'name', 'url', 'summary', 'storyline', 'rating'],
                        limit: 4,
                        ids: [character.games]
                    })
                    .then(games =>{
                        //add the games into the current character
                        character.games = games
    
                        //push the current character into the stack
                        chars.push(character)
                        if(i===characters.length-1)
                            fulfill(chars)
                    })
                    .catch(error=>{
                        console.log("error occured in character manager, game searching")
                    })
                }
            })

        })
        .catch(error =>{
            reject(error)
        })
    })
}

function range (min, max){
    return Math.round((Math.random() * (max - min)) + min)
}

function rangeDec (min, max, decimals){
    decimals = Math.pow(10, decimals)
    return Math.round(((Math.random() * (max - min)) + min) * decimals) / decimals
}