module.exports = (server) => {
    const
        io = require('socket.io')(server),
        cm = require('./character-manager')

    let chars = []
    let games = []

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

        //send out top ranks 
        socket.on('get-ranks', n =>{
            socket.emit('refresh-rankings', cm.getTopN(chars.slice(0), n))
        })

        //send out list of characters
        socket.on('get-characters', n =>{
            //check if n is valid
            if(n > chars.length){
                n = chars.length
            }
            socket.emit('refresh-characters', chars.slice(0, n - 1))
        })

        //render debugging data on server
        socket.on('sending-debug-data', data =>{

        })

    })
}
