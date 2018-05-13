
const igdb = require('../api/igdb-api'),

exports.builder = {
    character: {
        alias: 'c', //t
        describe: 'name(c) of the character', //title of the game
        type: 'string'
    }
   
}

exports.handler = (argv) => {
    igdb.getCharacters({
        fields: '*',
        search: argv.c,
        species:argv.species,
        ids: [argv.id],
        limit: argv.limit
    }).then(response =>{
        if(response)
            renderGameArray(response)
    })
    .catch(error=>{
        throw error
    })
}
