module.exports = (server) => {
    const
        io = require('socket.io')(server),
        cm = require('./character-manager')

    let chars = []
    let games = []
    const searchHistory = []

    io.on('connection', socket => {

        //start by loading the characters, if already load it just emit
        if(chars.length == 0) {
            //load characters
            cm.startingCharacters( 20 ).then(characters => {
                chars = characters
                // send character information on load
                socket.emit('refresh-characters', chars)
            }).catch(error=>console.log(error))
        }
        else{
            socket.emit('refresh-characters', chars)
        }

        // send search history
        socket.emit('refresh-search-history', searchHistory)

        // adds new search element to searchHistory
        socket.on('add-search-to-history', search =>{
            if(!searchHistory.includes(search))
                searchHistory.push(search)

        })

        //render debugging data on server
        socket.on('get-ranks', n =>{
            socket.emit('refresh-rankings', cm.getTopN(chars.slice(0), n))
        })

        //render debugging data on server
        socket.on('sending-debug-data', data =>{

        })

    })
}
