const characterComponent = {
  template: 
  `<div style="display: flex; width: 100%">
    <figure class="media-left">
      <img class="image is-64x64" v-bind:src="character.charImage">
    </figure>
    <div class="media-content">
      <div class="content">
        <p>
          <strong>
            <a v-bind:href="character.url" class="has-text-info">{{character.title}}</a>
            <span class="tag is-small">{{character.id}}</span>
          </strong>
          <br> {{character.description}}
        </p>
      </div>
    </div>
	<div class="level-right">
	<div class="media-right">
		<div class="section" v-if="character.rating.length != 0">
			<span class="icon is-small" v-for="i in character.rating/character.votes" >
			<i class="fa fa-star"></i>
			</span>
		</div>
		<div v-else>
			<small>No rating... <br>Rate the character please</small>
			<br>
			<select v-model="selected" @change="pushRating(character.id, selected)">
			<option disabled value="">Please select one</option>
			<option value=1>1 Star</option>
			<option value=2>2 Stars</option>
			<option value=3>3 Stars</option>
			<option value=4>4 Stars</option>
			<option value=5>5 Stars</option>
			</select>

			<br>
			<span class="icon is-small" v-for="i in character.rating" >
			<i class="fa fa-star"></i>
			</span>
		
	<script>
	new Vue({
	el: '...',
	data: {
    selected: '',
	
	}
	})
	</script>
	</div>
	</div>
  </div>`,
  props: ['character', 'characters','selected'],
  methods: {
    upvote: function(charId) {
      const character = this.characters.find(
        character => character.id === charId
      )
      character.votes++
    },
	pushRating: function(charId, selected) {
		console.log("selected id:"+charId)
		
		const character = this.characters.find(
        character => character.id === charId
      )

	  character.rating.push(selected);
	  character.votes++
	  console.log("character")
	  console.log(character)

	}
  }
}

new Vue({
    el: '#app',
    data: {
      characters: Seed.characters,
	  listChoice: '',
	  selected: ''	  
    },
    computed: {
      sortedCharacters () {
        return this.characters.sort((a, b) => {
			var bRate = 0;
			var aRate = 0;
			for(var i = 0; i < b.rating.length; i++)
			{
				bRate+=b.rating[i];
			}
			for(var q = 0; q < a.rating.length; q++)
			{
				aRate+=a.rating[q];
			}
          return bRate/b.votes - aRate/a.votes
        })
      }
    },
    components: {
      'character-component': characterComponent
    }
  })
  
  