import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/',
      name:'Home',
      component: Home,
      meta: {Auth: false, title: 'Inicio'} // indica que no requiere autenticacion y que el titulo de la paghina a mostrar es Inicio
    }
    
  ]
})
