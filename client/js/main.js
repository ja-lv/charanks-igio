const socket = io(),
characterComponent = {
  template: 
  `<div style="display: flex; width: 100%">
    <figure class="media-left picfig">
        <img v-if="character.mug_shot" class="image is-64x64" v-bind:src="character.mug_shot.url">
        <img v-else class="image is-64x64" src="assets/randomario.png">
    </figure>
    <div class="media-content">
      <div class="content">
        <p>
          <strong>
            <a v-bind:href="character.url" class="has-text-info" target="_blank">{{character.name}}</a>
            <span class="tag is-small">{{character.id}}</span>
          </strong>
          <br> 
          Appeared in:
          <span v-for="(game, i) in character.games">
            <a v-bind:href="game.url" class="has-text-info" target="_blank">{{game.name}}<span v-if="i < character.games.length - 1">, </span></a>
          </span>
          <br>
          <div v-if="character.akas">
            <strong>AKA</strong>:
            <span v-for="(aka, i) in character.akas">
              {{aka}}<span v-if="i < character.akas.length - 1">, 
            </span>
          </div>
        </p>
      </div>
    </div>
	<div class="level-right">
      <div class="media-right">
        <div class="section">
          <div v-if="character.votes">
            <span v-if="character.rating > 0" class="icon is-small" v-for="i in character.rating">
              <i class="fa fa-star"></i>
            </span>
            <span v-if="character.rating == 0"  class="icon is-small">
              <i class="far fa-star"></i>
            </span>
            <p class="center">Votes: {{character.votes}}</p>
          </div>
          <div v-else>
            <small>No rating... <br>Please rate the character</small>
            <br>
            <select v-model="character.rating">
              <option disabled value="">Please select one</option>
              <option value='0'>0 star</option>
              <option value='1'>1 star</option>
              <option value='2'>2 stars</option>
              <option value='3'>3 stars</option>
              <option value='4'>4 stars</option>
              <option value='5'>5 stars</option>
            </select>
            <br>
            <button v-if="character.rating" v-on:click="addCharacter(character)" class="button is-primary is-small is-outlined is-5 is-narrow m2">Add vote</button>
          </div>
        </div>
	    </div>
    </div>`,
  props: ['character']
  ,
  methods: {
    addCharacter: (char, search)=>{
      console.log('emmiting character!')
      //convert rating into int
      char.rating = parseInt(char.rating)
      char.votes++
      socket.emit('add-character-search', {character: char, search: app.lastSearch})
    }
  }
}

const app = new Vue({
  el: '#app',
  data: {
    rankings: [],
    characters: [],
    searchHistory:[],
    searchResults:[],
    listChoice: '',
    selected: '0',
    lastSearch: '',
    search: ''	  
  },
  methods:{
    fetchRankings: () =>{
      socket.emit('get-ranks', 10)
    },
    fetchCharacters: () =>{
      socket.emit('get-characters', 24)
    },
    //we get an input from the user we call the submitSearch method
    submitSearch (search) {
      //empty the array
      app.searchResults.splice(0,app.searchResults.length)//clear the results from previous results
        // filters out whitespaces or null
        if(!(search.trim().length===0)){//cuts the spaces out on both ends

            //search first, due to cache
            socket.emit('search-character',search)//this sends a search to the socket to make an api call

            // // adds search to history if it doesn't exist
            // if(!(this.searchHistory.includes(search))){
            //     this.searchHistory.push(search)
            //     socket.emit('add-search-to-history',search)
            // }

        //////make other calls here////////
            
      }
      this.lastSearch = this.search//we set our search to our last search
      this.search = '' // and then we clear search for its ready for the next
    }
  },
  components: {
    'character-component': characterComponent,
    'ranking-component': characterComponent,
    'search-results-component': characterComponent
  }
})

socket.on('refresh-characters', characters=>{
    console.log("Characters:")
    app.characters = characters
    console.log(app.characters)
})


socket.on('refresh-rankings', characters=>{
    app.rankings = characters
    console.log("Rankings:")
    console.log(app.rankings)
})

// search history from server is set to this app's searchHistory
socket.on('refresh-search-history', searchHistory => {
    app.searchHistory = searchHistory
})

socket.on('search-results',searchResults =>{ //recieve a result from the socket
  if(!searchResults) return 0 //if empty we exit the function

  console.log(app.characters.length)
  //app.characters.concat(searchResults)
  searchResults.forEach( result => app.searchResults.push(result))//otherwise we add the results to our searchs array
  //so that we can be displayed our component
})