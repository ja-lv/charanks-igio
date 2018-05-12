const igdb = require('../api/igdb-api')

exports.startingCharacters = ( n ) =>{
    console.log('id-gt :' + `${range(range(10, 304), range(305, 45466))}`)
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
                char.rating = rangeDec(0, 5, 1)

                //assign random votes
                char.votes = range(0, 2425)
                
                igdb.getGame({
                    fields: ['id', 'name', 'url', 'summary', 'storyline', 'rating'],
                    limit: n,
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

//array, amount we want
exports.getTopN = (chars, rankAmt)=> {
    for(let i = 0; i < chars.length; i++) 
    {
        let temp = chars[i].rating;
        let j = i - 1;
        while (j >= 0 && chars[j].rating < temp) 
        {
          chars[j + 1] = chars[j];
          j--;
        }
        chars[j + 1].rating = temp;
    }
    
  return chars;
}

function range (min, max){
    return Math.round((Math.random() * (max - min)) + min)
}

function rangeDec (min, max, decimals){
    decimals = Math.pow(10, decimals)
    return Math.round(((Math.random() * (max - min)) + min) * decimals) / decimals
}