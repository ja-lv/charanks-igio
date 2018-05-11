module.exports = (server) => {
    const
        io = require('socket.io')(server),
        cm = require('./character-manager')

    let chars = []
    let games = []
    
    cm.startingCharacters( 10 ).then(characters => chars = characters).catch(error=>console.log(error))

    io.on('connection', socket => {

        // send character information
        socket.emit('refresh-characters', chars)


        //render debugging data on server
        socket.on('sending-debug-data', data =>{
            console.log(chars)
            console.log("data recieved")
        })

    })
}
