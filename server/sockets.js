module.exports = (server) => {
    const
        io = require('socket.io')(server),
        cm = require('./character-manager')
        characterSearch = require('./find-matching-character')

    let chars = []
    let games = []
    let searchCharacters = []
    
    cm.startingCharacters( 10 ).then(characters => chars = characters).catch(error=>console.log(error))
    

    io.on('connection', socket => {

        // send character information
        socket.emit('refresh-characters', chars)

        // search for characters in database
        socket.on('search-character', searchTerm =>{
            characterSearch( searchTerm )
            .then(characters => {
                searchCharacters = characters
                socket.emit('character-matches', searchCharacters)
            })
            .catch(error=>console.log(error))
        })

        //render debugging data on server
        socket.on('sending-debug-data', data =>{
            console.log(chars)
            console.log("data recieved")
        })

    })
}
