const igdb = require('../api/igdb-api')

exports.startingCharacters = ( n ) =>{
    return new Promise(function(fulfill, reject){
        igdb.getCharacters({
            fields: '*',
            limit: n,
            filters: {
                'mug_shot-exists' : ``,
                'games-exists' : ``
            }
        })
        .then(characters=>{
            let chars = []
            
            //go through each character and get each game info
            characters.map((char, i)=>{

                console.log("Initial characters: ")
                console.log(char.name)

                //assign random ratings 
                char.rating = range(0, 5)

                //assign random votes
                char.votes = range(1, 11)

                if(!char.rating){
                    // console.log("WOops for: ")
                    // console.log(char)
                }

                if(!char.games){
                    console.log(char.games)
                    
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

exports.searchCharacter = ( name ) =>{
    return new Promise(function(fulfill, reject){
        igdb.getCharacters({
            fields: '*',
            limit: 10,
            search: name
        })
        .then(characters=>{
            let chars = []
            characters.forEach( (character, i) => {
                //dont assign rating
                character.rating = ''

                //no votes
                character.votes = ''
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

//array, amount we want
exports.getTopN = (chars, rankAmt)=> {
    //run a function for comparison

     return chars.sort((char1, char2)=>{
        return (char2.rating * char2.votes) - (char1.rating * char1.votes)
    }).slice(0, rankAmt)

}

function range (min, max){
    return Math.round((Math.random() * (max - min)) + min)
}

function rangeDec (min, max, decimals){
    decimals = Math.pow(10, decimals)
    return Math.round(((Math.random() * (max - min)) + min) * decimals) / decimals
}