<template>
    <v-container fill-height style="width:100%">
        <v-row justify="center" align="center">
        <v-col cols="12">

		<!-- User Interface controls -->
		<b-row align-v="center">
		<b-col lg="6" class="my-1">
			<b-form-group
			label="Filter"
			label-cols-sm="3"
			label-align-sm="right"
			label-size="sm"
			label-for="filterInput"
			class="mb-0"
			>
			<b-input-group size="sm">
				<b-form-input
				v-model="filter"
				type="search"
				id="filterInput"
				placeholder="Type to Search"
				></b-form-input>
				<b-input-group-append>
				<b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
				</b-input-group-append>
			</b-input-group>
			</b-form-group>
		</b-col>
		<b-col sm="7" md="6" class="my-1">
			<b-pagination
			v-model="currentPage"
			:total-rows="totalRows"
			:per-page="perPage"
			align="fill"
			size="sm"
			class="my-0"
			></b-pagination>
		</b-col>
		</b-row>
			
			<b-table
				striped
				hover 
				show-empty
				small
				stacked="md"
				ref="table"
				:items="ingredients"
				:fields="fields"
				:current-page="currentPage"
				:per-page="perPage"
				:filter="filter"
				:filterIncludedFields="filterOn"
				:sort-by.sync="sortBy"
				:sort-desc.sync="sortDesc"
				:sort-direction="sortDirection"
				:default-sort="['id', 'asc']"
				@filtered="onFiltered"
				@row-clicked="editIngredient"
				>	
					<template v-slot:cell(actions)="">
						<b-icon variant="primary" icon="pencil" aria-hidden="true"></b-icon>
					</template>

				</b-table>
        </v-col>
        </v-row>
    </v-container>
</template>

<script>

import axios from 'axios'
import SetEquivalences from './SetEquivalences.vue'


export default {
    name: "EquivalencesTab",
    components: {
        SetEquivalences
    },
    data(){
        return {
            error : null,
			success : null,
			deploy_to : process.env.VUE_APP_DATABASE,
			ingredients: [],
			totalRows: 1,
			fields: [
				{ key: 'id', label: 'Ingredient Id', sortable: true, class: 'text-center' },
				{ key: 'name', label: 'Name', sortable: true, class: 'text-left' },
				{ key: 'equivalences', label: 'Equivalences', sortable: false, class: 'text-left', formatter: 'display_equivalences'},
				{ key: 'actions', label: 'Actions' }
			],
			currentPage: 1,
			perPage: 10,
			pageOptions: [5, 10, 15],
			sortBy: 'id',
			sortDesc: false,
			sortDirection: 'asc',
			filter: null,
			filterOn: ['id', 'name']
        }
    },
	created (){
		axios.get(this.deploy_to + 'backoffice/ingredients/',{headers: {
				'Authorization': `${this.$store.getters.getTokenToSend}`
			}})
			.then(response => {
				this.ingredients = response.data
				this.totalRows = this.ingredients.length
				// TODO REMOVE
				// HARDCODED TEST DATA
				this.ingredients.forEach(i => {
					i.equivalences = [{id: -1, name: "melao"}, {id: -2, name: "vinho"}, {id: -3, name: "mel"}]
				})
				console.log("fetched ingredients")
			})
			.catch(error => {
				this.showErr(error)
				console.log(error)
			})
	},
    methods: {
		onFiltered(filteredItems) {
			this.totalRows = filteredItems.length
			this.currentPage = 1
		},
		showErr(msg){
          this.err = msg
          setTimeout(() => this.err = null, 3000);
		},
		showSuccess(msg){
			this.success = msg
			setTimeout(() => this.success = null, 3000);
		},
		display_equivalences(ingredients){
			return ingredients.map(i => i.name).join(", ");
		},
		editIngredient(ingredient, index) {
			this.$modal.show(
				SetEquivalences,
				{initialIngredient: ingredient, ingredients: this.ingredients},
				{ width: "700", height: "auto", adaptive: true, scrollable: true},
				{ 'before-close': this.ingredientUpdated }
			)
        },
		ingredientUpdated(event){
			const eventParams = event?.params?.paramList;
			if(!eventParams){
				return
			}
			let ingredient = eventParams[0]
			let newEquivalences = eventParams[1]
			for(var i = 0; i < this.ingredients.length; i++){
				if(this.ingredients[i].id == ingredient.id){
					this.ingredients[i].equivalences = newEquivalences
					break
				}
			}
			this.$refs.table.refresh();
		}
      },
    }

</script>

<style scoped>
</style>