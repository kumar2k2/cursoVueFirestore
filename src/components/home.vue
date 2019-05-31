<template>
  <v-jumbotron 
    color='grey lighten-2'  
  >
    <v-container fill-height>
      <v-layout align-center>
        <v-flex>
          <h3 class='display-3'>
            {{ $t('welcome.title',{app: 'Vuejs 2 + Firestore'}) }}
          </h3>  
          <span class='subheading'>
            {{ $t('welcome.content') }}
          </span>
          <v-divider class='my-3'/>
          <div class='title mb-3'>{{ $t('welcome.call_to_action') }}</div>
          <v-btn 
            large
            color='primary'
            class='mx-0'
            to='/login'>
            {{ $t('welcome.action_button') }}
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>    
  </v-jumbotron>
</template>

<script>
    export default {
        name: 'home',
        data() {
        return {
            
        }
        },
        methods: {
            
        },
        props:{

        }
    }
</script>

<style>
*{
  margin: 0px;
  padding: 0px;
  text-decoration:none;
}
#nombreComponente {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>