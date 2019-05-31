<template>
  <div id="guest">
    <v-toolbar
      app
      dark
      color='primary'
    >
      <v-toolbar-side-icon @click='togglerDrawer'/> 
      <v-toolbar-title>
        <v-btn 
          color='dark'
          to='/'
        >
          Vuejs 2 Firestore
        </v-btn>
      </v-toolbar-title>
    </v-toolbar>  
  </div>
</template>

<script>
    export default {
        name: 'guest',
        data() {
        return {
          drawer: false,
          items: [  
            {title: this.$t('navigation.home'), icon:'home', to:'/'},
            {title: this.$t('navigation.login'), icon:'forward', to:'/login'},
            {title: this.$t('navigation.register'), icon:'account_circle', to:'/register'}
          ]          
          }         
        },
        methods: {
            
        },
        props:{

        }
    }
</script>
