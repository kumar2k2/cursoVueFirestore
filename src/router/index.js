import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home'
import adminHome from '@/components/administration/adminHome'
import Register from '@/components/Register'
import Login from '@/components/login'
import Store from '../store/index.js' // importacion del Store de Vuex

Vue.use(Router)

const beforeEnter=(to,from,next)=>{ // no accede a la ruta si el usuario esta logueado
  if(Store.state.authModule.logged){
    next({path:'/'})
  }else{
    next()
  }
}

const router =  new Router({
  routes: [
    {
      path:'/',
      name:'Home',
      component: Home,
      meta: {Auth: false, title: 'Inicio'} // indica que no requiere autenticacion y que el titulo de la paghina a mostrar es Inicio
    },
    {
      path:'/register',
      name:'Register',
      component: Register,
      meta: {Auth: false, title: 'Registro'},
      beforeEnter:(to,from,next)=>beforeEnter(to,from,next)
    },
    {
      path:'/login',
      name:'Login',
      component: Login,
      meta: {Auth: false, title: 'Login'},
      beforeEnter:(to,from,next)=>beforeEnter(to,from,next)
    },
    {
      path:'/admin',
      name:'Admin',
      component: adminHome,
      meta: {Auth: true, title: 'Admin', role: 'admin'} 
    }  
  ]
})

router.beforeEach((to,from,next)=>{ 
  document.title=to.meta.title // le asigna el titulo a la pagina tomandolo de los metadatos pasados por la ruta
  if (to.meta.Auth && !Store.state.authModule.logged && Store.state.loaded){
    next({path:'/login'}) // redirige al login por solicitar acceso sin estar logueado
    console.log('me fui a login')
  }else{
    console.log('rol requerido', to.meta)
    if(to.meta.role){      
      if(Store.state.loaded && (to.meta.role !== Store.state.authModule.role)){
        next({path:'/'}) // reditige al home por solicitar accedo auna pagina cuyo requerimiento de role no coincide con el del usuario logeado
        return
      }
    }
    next() // muestra la ruta solicitada
  }
})

export default router
