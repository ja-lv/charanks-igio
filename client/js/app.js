const socket = io()
const app = new Vue({
    el: '#char-app',
    data: {
        characters: []
    },
    methods: {
    }
})

socket.on('refresh-characters', characters=>{
    console.log(characters)
    app.characters = characters
})

socket.emit('sending-debug-data', app.characters)