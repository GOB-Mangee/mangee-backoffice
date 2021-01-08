import axios from 'axios'

async function mapExternalMeasures(measureList, serverUrl, token){

	const measuresMapping = await axios.post(serverUrl + 'backoffice/map-external-measures/', {'measures': measureList}, {headers: {'Authorization': token}})
		.then((response) => {
			return response.data
		})
		.catch(errors => {
			console.log(errors)
			return {}
		})
	return measuresMapping
}

async function mapExternalIngredients(ingredientList, serverUrl, token){

	const ingredientsMapping = await axios.post(serverUrl + 'backoffice/map-external-ingredients/', {'ingredients': ingredientList}, {headers: {'Authorization': token}})
		.then((response) => {
			return response.data
		})
		.catch(errors => {
			console.log(errors)
			return {}
		})
	
	return ingredientsMapping
} 

export {
	mapExternalIngredients,
	mapExternalMeasures
}
