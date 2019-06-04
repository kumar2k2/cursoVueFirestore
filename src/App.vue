<template>
  <main>    
    <v-app>
      <v-content>
        <guestNavigation/>
        <v-container class='mt-3 mb-3'>
          <router-view/>
        </v-container>
      </v-content> 
      <app-footer/>  
    </v-app>
  </main>
</template>

<script>
import guestNavigation from '@/navigations/guest'
import AppFooter from '@/components/footer'

  export default {
    name: 'App',
    components:{
      guestNavigation,
      AppFooter
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
