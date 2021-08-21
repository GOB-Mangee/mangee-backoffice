<template>
    <v-container fill-height>
        <v-row no-gutters class="d-flex justify-center">
            <b-alert variant="success" v-if="this.success" show>{{this.success}}</b-alert>
            <b-alert variant="danger" v-if="this.err" show>{{this.err}}</b-alert>
		</v-row>
		<v-row no-gutters class="d-flex justify-center">
			<h4>Ingredient: <b>{{ ingredient.name }}</b></h4>
        </v-row>
		<b-row no-gutters align-v="center">
			<v-autocomplete class="mr-3"
				v-model="newAlternative"
				:items="ingredients"
				color="white"
				hide-no-data
				hide-selected
				item-text="name"
				placeholder="Choose alternatives"
				return-object
			></v-autocomplete>
			<b-button @click="addAlternative">Add</b-button>
        </b-row>
		<v-row no-gutters class="d-flex justify-center">
			<ul class="striped-list">
				<li v-for="(ingredient, index) in newAlternatives" :key="ingredient.id">
					<span>{{ ingredient.name }}</span>
					<button @click="removeAlternative(index)" type="button" class="close ml-3" aria-label="Close">
						<span style="color:red" aria-hidden="true">&times;</span>
					</button>
				</li>
			</ul>
        </v-row>
		<v-row no-gutters class="d-flex justify-center mt-3">
			<b-button variant="success" @click="saveIngredient">SAVE</b-button>
        </v-row>
    </v-container>
</template>

<script>
import axios from 'axios'

export default {
    name: "SetAlternatives",
    props : {
		initialIngredient: {
			type: Object,
			default: undefined
		},
		ingredients: {
            type: Array,
            default:() => []
        },
    },
    data(){
        return {
            deploy_to : process.env.VUE_APP_DATABASE,
            err: null,
            success: null,
			ingredient: this.initialIngredient,
			newAlternatives: this.initialIngredient.alternatives.slice(),
			newAlternative: null,
        }
    },

    methods: {
         showErr(msg, timeout=3000){
          this.err = msg
          setTimeout(() => this.err = null, timeout);
        },
        showSuccess(msg){
            this.success = msg
            setTimeout(() => this.success = null, 3000);
        },
        removeAlternative(index){
			this.newAlternatives.splice(index, 1)
		},
		addAlternative(){
			this.newAlternatives.push(this.newAlternative)
			this.newAlternative = null
		},
		saveIngredient(){
			const data = {
				ingredient: this.ingredient.id,
				alternatives: this.newAlternatives.map(i => i.id)
			}
			axios.post(this.deploy_to + 'alternatives/update-ingredient/', data, {headers: {
              'Authorization': `${this.$store.getters.getTokenToSend}`
			}}).then(resp => {
				this.$emit('close', {paramList: [this.ingredient, this.newAlternatives]})
			}).catch(errors => {
				console.log(errors)
				this.showErr(errors)
			})
		}
    },
    created (){
        axios.get(this.deploy_to + 'backoffice/ingredients/',{headers: {
              'Authorization': `${this.$store.getters.getTokenToSend}`
        }}).then(resp => {
            this.ourIngredients = resp.data
        }).catch(errors => {
            console.log(errors)
            this.showErr(errors)
        })
    },

}
</script>

<style scoped>
	ul.striped-list {
		list-style-type: none;
		margin: 0;
		padding: 0;
		width: 100%;
	}
	ul.striped-list > li {
		border-bottom: 1px solid rgb(221,221,221);
		padding: 6px;
	}
	ul.striped-list > li:nth-of-type(odd) {
		background-color: #e9e9f9 ;
	}
	ul.striped-list > li:last-child {
		border-bottom: none;
	}
</style>