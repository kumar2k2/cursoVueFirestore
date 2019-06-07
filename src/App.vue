<template>
  <main>    
    <v-app>
      <v-content v-if='isLoaded'>
        <guestNavigation v-if="userRole === 'customer'"/>
        <guestNavigation v-if="userRole === 'guest'"/>
        <adminNavigation v-if="userRole === 'admin'"/>
        <v-container class='mt-3 mb-3'>     
          <router-view/>
        </v-container>
      </v-content> 
      <v-container v-else fill-height>
        <v-layout flex align-center justify-center>
          <v-progress-circular indeterminate :size='100' :width='10' color='purple'/>
        </v-layout>
      </v-container>
      <app-footer/>  
    </v-app>
  </main>
</template>

<script>

import guestNavigation from '@/navigations/guest'
import adminNavigation from '@/navigations/admin'
import AppFooter from '@/components/footer'
import Store from './store/index' // importacion del Store de Vuex
import { mapGetters } from 'vuex' // ns permite acceder a los valores de los getter de un store

  export default {
    name: 'App',    
    Store,
    components:{
      guestNavigation,
      AppFooter,
      adminNavigation
    },
    computed: {      
      userRole(){
        return Store.state.authModule.role  // probar mapGetters para acceder a los getters 
      },
      isLoaded () {
        return Store.state.loaded === true
      }            
    }
  }   
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
