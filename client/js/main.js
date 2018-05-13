const characterComponent = {
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
            <a v-bind:href="character.url" class="has-text-info">{{character.name}}</a>
            <span class="tag is-small">{{character.id}}</span>
          </strong>
          <br> 
          Appeared in:
          <span v-for="(game, i) in character.games">
            <a v-bind:href="game.url" class="has-text-info">{{game.name}}<span v-if="i < character.games.length - 1">, </span></a>
          </span>
        </p>
      </div>
    </div>
	<div class="level-right">
	<div class="media-right">
		<div class="section">
      <div v-if="character.rating >= 0">
        <span class="icon is-small" v-for="i in character.rating">
        <i class="fa fa-star"></i>
        </span>
      </div>
      <div v-else>
        <span>0</span>
      </div>
		</div>
		<div v-else>
			<small>No rating... <br>Rate the character please</small>
			<br>
			<select v-model="selected">
				<option disabled value="">Please select one</option>
				<option>1 star</option>
				<option>2 stars</option>
				<option>3 stars</option>
				<option>4 stars</option>
				<option>5 stars</option>
			</select>
	</div>
	</div>
  </div>`,
  props: ['character']
  // ,
  // methods: {
  //   upvote: function(charId) {
  //     const character = this.characters.find(
  //       character => character.id === charId
  //     )
  //     character.votes++
  //   }
  // }
}

const socket = io(),
app = new Vue({
  el: '#app',
  data: {
    rankings: [],
    characters: [],
    listChoice: '',
    selected: ''	  
  },
  methods:{
    fetchRankings: () =>{
      console.log("making call")
      socket.emit('get-ranks', 10)
    }
  },
  components: {
    'character-component': characterComponent,
    'ranking-component': characterComponent
  }
})

socket.on('refresh-characters', characters=>{
    app.characters = characters
    console.log(app.characters)
})


socket.on('refresh-rankings', characters=>{
    app.rankings = characters
    console.log("Rankings:")
    console.log(app.rankings)
})
