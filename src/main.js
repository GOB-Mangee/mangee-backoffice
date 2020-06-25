import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router';
import vuetify from './plugins/vuetify';
import Recipes from './components/Recipes.vue'
import Home from './components/Home.vue'
import ExportData from './components/ExportData.vue'
import ValidateRecipe from './components/ValidateRecipe.vue'
import Ingredients from './components/Ingredients.vue'
import ValidateIngredient from './components/ValidateIngredient.vue'
import AddIngredient from './components/AddIngredient.vue'
import AddRecipe from './components/AddRecipe/AddRecipe.vue'
import Login from './components/Login.vue'
import VueSidebarMenu from 'vue-sidebar-menu'
import Axios from 'axios'
import store from './store'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faUserSecret)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueSidebarMenu)
Vue.use(VueRouter)

Vue.config.productionTip = false
Vue.prototype.$http = Axios;

const token = localStorage.getItem('token')
if (token) {
  Vue.prototype.$http.defaults.headers.common['Authorization'] = token
}

const routes = [
  { path: '/', name:'Home', component: Home, props: true, meta: {requiresAuth: true}},
  { path:'/recipes', name:'Recipes', component:  Recipes, props: true, meta: {requiresAuth: true}},
  { path: '/exportData',  name:'Export Data', component: ExportData, props: true, meta: {requiresAuth: true}},
  { path: '/validateRecipe', name:'Validate Recipe', component: ValidateRecipe, props: true},
  { path: '/addRecipe', name:'Add Recipe', component: AddRecipe, props: true},
  { path: '/addIngredient', name:'Add Ingredient', component: AddIngredient, props: true},
  { path: '/ingredients',  name:'Ingredients', component: Ingredients, props: true, meta: {requiresAuth: true}},
  { path: '/validateIngredient', name:'Validate Ingredient', component: ValidateIngredient, props: true},
  { path: '/login',  name:'Login', component: Login, props: true}
]

const router = new VueRouter({
  routes
});

new Vue({
  vuetify,
  router: router,
  store,
  render: h => h(App)
}).$mount('#app')
