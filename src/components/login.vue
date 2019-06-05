<template>
  <div>
    <auth-form action="login" v-on:process="login($event)" />
    <appsnackbar
      v-if="snackBar"
      :snackBar="snackBar"
      :text="message"
      :timeout="timeout"
    />
  </div>
</template>

<script>
import appsnackbar from './SnackBar'
import AuthForm from '@/forms/Auth'
import Store from '../store/index.js' // importacion del Store de Vuex
import {db} from '../main'

    export default {
        name: 'login',
        Store,
        components:{AuthForm, appsnackbar},
        data() {
          return {
              snackBar:false,
              message:'',
              timeout:5000            
          }
        },
        methods: {
          login(user){
            Store.dispatch('firebaseLogin',user)
              .then(data=>{                
                db.collection('users').doc(data.user.uid).onSnapshot(snapshot=>{          
                  
                  this.$router.push('/')
                })
              })
              .catch((error) => {                
                this.message = error.message.substr(0, 60);                
                this.snackBar = true
                setTimeout(() => {
                  this.snackBar = false
                }, this.timeout);
              })
          }    
        },
        props:{

        }
    }
</script>

