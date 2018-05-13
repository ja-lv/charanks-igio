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
            cm.startingCharacters( 20 ).then(characters => {
                chars = characters
                // send character information on load
                socket.emit('refresh-characters', chars)
            }).catch(error=>console.log(error))
        }
        else{
            socket.emit('refresh-characters', chars)
        }

        //render debugging data on server
        socket.on('get-ranks', n =>{
            socket.emit('refresh-rankings', cm.getTopN(chars, n))
        })

        //render debugging data on server
        socket.on('sending-debug-data', data =>{

        })

    })
}
