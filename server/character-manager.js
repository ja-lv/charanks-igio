const igdb = require('../api/igdb-api')

exports.startingCharacters = ( n ) =>{
    return new Promise(function(fulfill, reject){
        igdb.getCharacters({
            fields: '*',
            limit: n,
            filters: {
                'gender-eq' : `${range(0, 2)}`
            }
        })
        .then(characters=>{
            let chars = []
            

            //go through each character and get each game info
            characters.map((char, i)=>{

                //assign random ratings 
                char.rating = range(0, 5)

                //assign random votes
                char.votes = range(0, 2425)

                if(!char.games){
                    char.games = [{
                        id: 'NA',
                        name: 'NA',
                        url: '',
                        summary: 'NA',
                        storyline: 'NA',
                        rating: NaN
                    }]

                    chars.push(char)
                    return 0
                }
                
                igdb.getGameWrapper({
                    fields: ['id', 'name', 'url', 'summary', 'storyline', 'rating'],
                    limit: 4,
                    ids: [char.games]
                })
                .then(games =>{
                    //add the games into the current character
                    char.games = games

                    //push the current character into the stack
                    chars.push(char)
                })
                .catch(error=>{
                    console.log("error occured in character manager, game searching")
                })

                //once we finished going through all chars, fulfill
                if(i == characters.length - 1) fulfill(chars)

                return 1
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