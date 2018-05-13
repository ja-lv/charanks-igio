module.exports = (server) => {
    const
        io = require('socket.io')(server),
        cm = require('./character-manager')


    let chars = []
    let games = []
    const searchHistory = []
    const searchHash = {}
    let searchResults = []

    io.on('connection', socket => {

        //start by loading the characters, if already load it just emit
        if(chars.length == 0) {
            //load characters
            cm.startingCharacters( 30 ).then(characters => {
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

        //start searching
        socket.on('search-character',search =>{
            //see if its in our history and cached, cache otherwise
            if(searchHistory.includes(search)){
                console.log("Yep its in history")
                socket.emit('search-results',searchHash[search])
                //exit
                return 1
            }
            
            //push and omit the history
            searchHistory.push(search)
            socket.emit('refresh-search-history', searchHistory)

            cm.searchCharacter( search ).then(characters => {
                console.log("Nope, not in history")

                //store into hash
                searchHash[search] = characters

                searchResults = characters
                // send character information on load
                socket.emit('search-results',searchResults)
            }).catch(error=>console.log(error))
        })

        //send ranks to client
        socket.on('get-ranks', n =>{
            socket.emit('refresh-rankings', cm.getTopN(chars.slice(0), n))
        })

        //send characters to client
        socket.on('get-characters', n =>{
            if(n >= chars.length){
                n = chars.length - 1
            }
            socket.emit('refresh-characters', chars.slice(0).reverse())
        })

        //add character data from search 
        socket.on('add-character-search', data =>{
            //add to stack
            chars.push(data.character)

            const search = data.search
            const char = data.character

            //remove character from search cache
            if(searchHistory.includes(search)){
                searchHash[search] = searchHash[search].splice(searchHash[search].indexOf(char), 1)
            }

            //update client with character list
            socket.emit('refresh-characters', chars.slice(0).reverse())
        })

        //render debugging data on server
        socket.on('sending-debug-data', data =>{
        })

    })
}
